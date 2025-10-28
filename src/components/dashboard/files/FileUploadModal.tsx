import React, { useEffect, useState } from "react";
import {
    Upload,
    FileText,
    File,
    Image,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFiles, UploadedFile } from "@/contexts/FilesContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFileUpload: (file: UploadedFile) => void;
    usedFiles: number;
    totalFiles: number;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
    isOpen,
    onClose,
    onFileUpload,
    usedFiles,
    totalFiles,
}) => {
    const { t } = useLanguage();
    const { uploadFile, uploading } = useFiles();
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileCategory, setFileCategory] = useState("");
    const [fileTags, setFileTags] = useState("");
    const [fileDescription, setFileDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const categories = [
        "FAQ",
        "Payment",
        "Complaint",
        "Product",
        "Technical",
        "Partnership",
        "Legal",
        "General",
    ];
    const acceptedTypes = [
        ".pdf",
        ".docx",
        ".txt",
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    ];
    const acceptedTypesForInput = acceptedTypes.join(",");
    const acceptedMimeTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/webp",
    ];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        setUploadError("");
        setPreviewUrl(null);

        if (!acceptedMimeTypes.includes(file.type)) {
            setUploadError(t("FilesPage.uploadModal.unsupportedFileTypeError"));
            return;
        }

        if (file.size > maxFileSize) {
            setUploadError(
                t("FilesPage.uploadModal.fileTooLargeError", {
                    size: (file.size / 1024 / 1024).toFixed(1),
                })
            );
            return;
        }

        setSelectedFile(file);
        setFileName(file.name.replace(/\.[^/.]+$/, ""));

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploadError("");

        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 5, 90));
        }, 200);

        try {
            const result = await uploadFile(
                selectedFile,
                fileName,
                fileCategory,
                fileDescription,
                fileTags
            );

            if (result.success && result.file) {
                onFileUpload(result.file);
                setShowSuccess(true);
            } else {
                setUploadError(
                    result.error || t("FilesPage.uploadModal.uploadFailedError")
                );
                setUploadProgress(0);
            }
        } catch (error) {
            setUploadError(
                error instanceof Error
                    ? error.message
                    : t("FilesPage.uploadModal.uploadFailedError")
            );
            setUploadProgress(0);
        } finally {
            clearInterval(progressInterval);
            if (uploadError) {
                setUploadProgress(0);
            } else {
                setUploadProgress(100);
            }
        }
    };

    const resetModal = () => {
        setSelectedFile(null);
        setFileName("");
        setFileCategory("");
        setFileTags("");
        setFileDescription("");
        setUploadError("");
        setUploadProgress(0);
        setShowSuccess(false);
        setPreviewUrl(null);
        onClose();
    };

    const handleAddAnother = () => {
        setShowSuccess(false);
        setSelectedFile(null);
        setFileName("");
        setFileCategory("");
        setFileTags("");
        setFileDescription("");
        setUploadError("");
        setUploadProgress(0);
        setPreviewUrl(null);
    };

    const handleBackToKnowledgeBase = () => {
        setShowSuccess(false);
        resetModal();
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
        switch (extension) {
            case "pdf":
                return <FileText className="h-8 w-8 text-red-500" />;
            case "docx":
                return <FileText className="h-8 w-8 text-blue-500" />;
            case "txt":
                return <File className="h-8 w-8 text-gray-500" />;
            case "jpg":
            case "jpeg":
            case "png":
            case "webp":
                return <Image className="h-8 w-8 text-purple-500" />;
            default:
                return <File className="h-8 w-8 text-gray-500" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={resetModal}
                />
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <Upload className="h-5 w-5 mr-2 text-gray-700" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                {t("FilesPage.uploadModal.title")}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            {t("FilesPage.uploadModal.description")}
                        </p>
                    </div>
                    {!showSuccess ? (
                        <div className="space-y-6">
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    dragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-400"
                                } ${
                                    selectedFile
                                        ? "border-green-500 bg-green-50"
                                        : ""
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {selectedFile ? (
                                    <div className="flex items-center justify-center space-x-4">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="h-16 w-16 object-cover rounded-md border"
                                            />
                                        ) : (
                                            getFileIcon(selectedFile.name)
                                        )}
                                        <div className="text-left">
                                            <p className="font-medium text-green-700">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-green-600">
                                                {formatFileSize(
                                                    selectedFile.size
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setSelectedFile(null)
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-gray-700 mb-2">
                                            {t(
                                                "FilesPage.uploadModal.dragDropText"
                                            )}
                                        </p>
                                        <p className="text-gray-500 mb-4">
                                            {t("FilesPage.uploadModal.orText")}
                                        </p>
                                        <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept={acceptedTypesForInput}
                                                onChange={handleFileInputChange}
                                            />
                                            {t(
                                                "FilesPage.uploadModal.selectFileButton"
                                            )}
                                        </label>
                                        <p className="text-xs text-gray-500 mt-4">
                                            {t(
                                                "FilesPage.uploadModal.acceptedFilesText"
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {uploading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>
                                            {t(
                                                "FilesPage.uploadModal.processingFile"
                                            )}
                                        </span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {uploadError && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                    <div className="flex">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">
                                                {uploadError}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedFile && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t(
                                                "FilesPage.uploadModal.fileNameLabel"
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            value={fileName}
                                            onChange={(e) =>
                                                setFileName(e.target.value)
                                            }
                                            placeholder={t(
                                                "FilesPage.uploadModal.fileNamePlaceholder"
                                            )}
                                            disabled={uploading}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t(
                                                "FilesPage.uploadModal.categoryLabel"
                                            )}
                                        </label>
                                        <select
                                            value={fileCategory}
                                            onChange={(e) =>
                                                setFileCategory(e.target.value)
                                            }
                                            disabled={uploading}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                                        >
                                            <option value="">
                                                {t(
                                                    "FilesPage.uploadModal.categoryPlaceholder"
                                                )}
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t(
                                                "FilesPage.uploadModal.tagsLabel"
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            value={fileTags}
                                            onChange={(e) =>
                                                setFileTags(e.target.value)
                                            }
                                            placeholder={t(
                                                "FilesPage.uploadModal.tagsPlaceholder"
                                            )}
                                            disabled={uploading}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            {t(
                                                "FilesPage.uploadModal.tagsExample"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t(
                                                "FilesPage.uploadModal.descriptionLabel"
                                            )}
                                        </label>
                                        <textarea
                                            value={fileDescription}
                                            onChange={(e) =>
                                                setFileDescription(
                                                    e.target.value
                                                )
                                            }
                                            placeholder={t(
                                                "FilesPage.uploadModal.descriptionPlaceholder"
                                            )}
                                            rows={3}
                                            disabled={uploading}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t("FilesPage.uploadModal.successTitle")}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {t("FilesPage.uploadModal.successDescription")}
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={handleAddAnother}
                                >
                                    {t(
                                        "FilesPage.uploadModal.addAnotherButton"
                                    )}
                                </Button>
                                <Button
                                    variant="default"
                                    size="default"
                                    onClick={handleBackToKnowledgeBase}
                                >
                                    {t(
                                        "FilesPage.uploadModal.backToKnowledgeBaseButton"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                    {!showSuccess && (
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                size="default"
                                onClick={resetModal}
                                disabled={uploading}
                            >
                                {t("FilesPage.uploadModal.cancelButton")}
                            </Button>
                            <Button
                                variant="default"
                                size="default"
                                onClick={handleUpload}
                                disabled={
                                    !selectedFile ||
                                    !fileName.trim() ||
                                    !fileCategory ||
                                    uploading ||
                                    usedFiles >= totalFiles
                                }
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {t(
                                            "FilesPage.uploadModal.uploadingButton"
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {t(
                                            "FilesPage.uploadModal.uploadButton"
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
