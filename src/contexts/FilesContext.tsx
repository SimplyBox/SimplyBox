import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import supabase from "../libs/supabase";
import { useAuth } from "./AuthContext";

export interface UploadedFile {
    id: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    category: string;
    tags: string[];
    description: string;
    uploadDate: string;
    status: "completed" | "uploading" | "failed";
    documentUrl?: string;
}

interface FilesContextType {
    files: UploadedFile[] | null;
    loading: boolean;
    uploading: boolean;
    refreshFiles: () => Promise<void>;
    uploadFile: (
        file: File,
        fileName: string,
        fileCategory: string,
        fileDescription: string,
        fileTags: string
    ) => Promise<{ success: boolean; error?: string; file?: UploadedFile }>;
    deleteFile: (
        fileId: string
    ) => Promise<{ success: boolean; error?: string }>;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const useFiles = () => {
    const context = useContext(FilesContext);
    if (context === undefined) {
        throw new Error("useFiles must be used within a FilesProvider");
    }
    return context;
};

const getLimitsForTier = (tier: string) => {
    switch (tier) {
        case "free":
            return { files_limit: 2 };
        case "starter":
            return { files_limit: 10 };
        case "professional":
            return { files_limit: 50 };
        case "enterprise":
            return { files_limit: 500 };
        default:
            return { files_limit: 0 };
    }
};

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user, company } = useAuth();
    const [files, setFiles] = useState<UploadedFile[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const loadFilesFromDatabase = useCallback(async (companyId: string) => {
        if (!companyId) {
            console.warn("No company ID provided for fetching files");
            return;
        }

        try {
            setLoading(true);
            console.log("Fetching files for company:", companyId);

            const { data: filesData, error } = await supabase
                .from("files")
                .select("*")
                .eq("company_id", companyId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching files:", error);
                setFiles([]);
                return;
            }

            const formattedFiles: UploadedFile[] = (filesData || []).map(
                (file) => ({
                    id: file.id.toString(),
                    name: file.file_name,
                    originalName: file.original_name || file.file_name,
                    type: file.mime_type || "application/pdf",
                    size: file.size || 0,
                    category: file.category,
                    tags: Array.isArray(file.tags)
                        ? file.tags
                        : typeof file.tags === "string"
                        ? file.tags
                              .split(",")
                              .map((tag: string) => tag.trim())
                              .filter((tag: string) => tag)
                        : [],
                    description: file.description || "",
                    uploadDate: file.created_at,
                    status: "completed" as const,
                    documentUrl: file.document_url,
                })
            );

            console.log("Formatted files:", formattedFiles);
            setFiles(formattedFiles);
        } catch (error) {
            console.error("Error loading files:", error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshFiles = useCallback(async () => {
        if (!company?.id) {
            console.warn("No company ID available, skipping files refresh");
            return;
        }

        await loadFilesFromDatabase(company.id);
    }, [company?.id, loadFilesFromDatabase]);

    const uploadFile = async (
        file: File,
        fileName: string,
        fileCategory: string,
        fileDescription: string,
        fileTags: string
    ): Promise<{ success: boolean; error?: string; file?: UploadedFile }> => {
        if (!file || !fileName.trim() || !fileCategory || !company?.id) {
            return {
                success: false,
                error: "Harap isi semua kolom yang diperlukan.",
            };
        }

        try {
            setUploading(true);

            // Check file limit
            const { data: subscriptionData, error: subscriptionError } =
                await supabase
                    .from("subscriptions")
                    .select("id, tier")
                    .eq("company_id", company.id)
                    .single();

            if (subscriptionError) {
                return { success: false, error: subscriptionError.message };
            }

            const limits = getLimitsForTier(subscriptionData.tier);
            if (files && files.length >= limits.files_limit) {
                return {
                    success: false,
                    error: "File limit reached for your subscription tier",
                };
            }

            // Validate file
            const allowedTypes = [
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "text/plain",
                "image/jpeg",
                "image/png",
                "image/webp",
            ];

            if (!allowedTypes.includes(file.type)) {
                return {
                    success: false,
                    error: "Unsupported file type. Only PDF, DOCX, TXT, JPG, PNG, and WEBP are allowed.",
                };
            }

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                return {
                    success: false,
                    error: `File too large. Maximum size is 10MB. Your file is ${(
                        file.size /
                        1024 /
                        1024
                    ).toFixed(1)}MB.`,
                };
            }

            // Check if file already exists
            const encodedFileName = encodeURIComponent(fileName);
            const { data: existingFile } = await supabase
                .from("files")
                .select("file_name")
                .eq("company_id", company.id)
                .eq("file_name", encodedFileName)
                .single();

            if (existingFile) {
                return {
                    success: false,
                    error: `A file with the name "${fileName}" already exists in your knowledge base.`,
                };
            }

            // Upload to edge function using invoke
            const formData = new FormData();
            formData.append("file", file);
            formData.append("file_name", fileName);
            formData.append("category", fileCategory);

            const { data, error: invokeError } =
                await supabase.functions.invoke("rag-files/upload", {
                    body: formData,
                    headers: {
                        "x-company-id": company.id,
                    },
                });

            if (invokeError) {
                console.error("Invoke error:", invokeError);
                throw new Error(
                    invokeError.message || "Failed to process file"
                );
            }

            if (!data.success) {
                throw new Error(data.error || "Failed to process file");
            }

            const { documentUrl, ragResult } = data;

            // Process tags
            let tagsArray: string[] = [];
            if (fileTags) {
                tagsArray = fileTags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag);
            }

            // Save metadata to database
            const fileRecord = {
                company_id: company.id,
                file_name: fileName,
                original_name: file.name,
                mime_type: file.type,
                size: file.size,
                category: fileCategory,
                tags: tagsArray,
                description: fileDescription,
                document_url: documentUrl,
            };

            const { data: savedFile, error: dbError } = await supabase
                .from("files")
                .insert([fileRecord])
                .select()
                .single();

            if (dbError) {
                // Clean up by calling delete endpoint
                await supabase.functions.invoke("rag-files/delete", {
                    method: "DELETE",
                    headers: {
                        "x-company-id": company.id,
                    },
                    body: JSON.stringify({
                        file_name: fileName,
                    }),
                });
                throw new Error(`Database error: ${dbError.message}`);
            }

            // Update subscription usage
            const { data: currentUsage, error: usageGetError } = await supabase
                .from("subscription_usage")
                .select("files_used")
                .eq("subscription_id", subscriptionData.id)
                .single();

            if (!usageGetError && currentUsage) {
                const { error: usageUpdateError } = await supabase
                    .from("subscription_usage")
                    .update({
                        files_used: currentUsage.files_used + 1,
                    })
                    .eq("subscription_id", subscriptionData.id);

                if (usageUpdateError) {
                    console.warn(
                        "Failed to update files usage:",
                        usageUpdateError
                    );
                }
            }

            // Format response
            const responseFile: UploadedFile = {
                id: savedFile.id.toString(),
                name: savedFile.file_name,
                originalName: savedFile.original_name,
                type: savedFile.mime_type,
                size: savedFile.size,
                category: savedFile.category,
                tags: savedFile.tags || [],
                description: savedFile.description || "",
                uploadDate: savedFile.created_at,
                status: "completed",
                documentUrl: savedFile.document_url,
            };

            // Refresh files list
            await refreshFiles();

            return { success: true, file: responseFile };
        } catch (error) {
            console.error("Upload error:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Upload gagal",
            };
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = async (
        fileId: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!company?.id) {
                return { success: false, error: "No company found" };
            }

            // Get file info before deletion
            const { data: fileToDelete, error: fetchError } = await supabase
                .from("files")
                .select("*")
                .eq("id", fileId)
                .eq("company_id", company.id)
                .single();

            if (fetchError || !fileToDelete) {
                return {
                    success: false,
                    error: "File not found or access denied",
                };
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from("files")
                .delete()
                .eq("id", fileId)
                .eq("company_id", company.id);

            if (dbError) {
                console.error("Database delete error:", dbError);
                throw new Error(`Database error: ${dbError.message}`);
            }

            // Delete from edge function using invoke
            const { data, error: invokeError } =
                await supabase.functions.invoke("rag-files/delete", {
                    method: "DELETE",
                    headers: {
                        "x-company-id": company.id,
                    },
                    body: JSON.stringify({
                        file_name: fileToDelete.file_name,
                    }),
                });

            if (invokeError || !data.success) {
                console.error(
                    "Invoke delete error:",
                    invokeError || data.error
                );
                throw new Error(
                    invokeError?.message ||
                        data.error ||
                        "Failed to delete from RAG API"
                );
            }

            // Update subscription usage
            const { data: subscriptionData, error: subscriptionError } =
                await supabase
                    .from("subscriptions")
                    .select("id")
                    .eq("company_id", company.id)
                    .single();

            if (subscriptionData && !subscriptionError) {
                const { data: currentUsage, error: usageGetError } =
                    await supabase
                        .from("subscription_usage")
                        .select("files_used")
                        .eq("subscription_id", subscriptionData.id)
                        .single();

                if (!usageGetError && currentUsage) {
                    const { error: usageUpdateError } = await supabase
                        .from("subscription_usage")
                        .update({
                            files_used: Math.max(
                                0,
                                currentUsage.files_used - 1
                            ),
                        })
                        .eq("subscription_id", subscriptionData.id);

                    if (usageUpdateError) {
                        console.warn(
                            "Failed to update files usage:",
                            usageUpdateError
                        );
                    }
                }
            }

            // Refresh files list
            await refreshFiles();

            return { success: true };
        } catch (error) {
            console.error("Delete file error:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete file",
            };
        }
    };

    useEffect(() => {
        if (company?.id) {
            loadFilesFromDatabase(company.id);
        } else {
            setFiles(null);
        }
    }, [company?.id, loadFilesFromDatabase]);

    const value: FilesContextType = {
        files,
        loading,
        uploading,
        refreshFiles,
        uploadFile,
        deleteFile,
    };

    return (
        <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
    );
};
