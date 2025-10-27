import React, { useState } from "react";
import {
    Plus,
    FileText,
    File,
    Download,
    Trash2,
    Eye,
    Calendar,
    Tag,
    Loader2,
    ArrowUpRight,
    AlertCircle,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFiles, UploadedFile } from "@/contexts/FilesContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import FileUploadModal from "./FileUploadModal";

interface FilesPageProps {
    onFileUpload?: (file: UploadedFile) => void;
    userPlan: "free" | "starter" | "professional" | "enterprise";
    currentUsage: {
        files: { used: number; total: number };
    };
    onUpgrade?: () => void;
}

const FilesPage: React.FC<FilesPageProps> = ({
    onFileUpload = () => {},
    userPlan,
    currentUsage,
    onUpgrade,
}) => {
    const { files, loading, deleteFile } = useFiles();
    const { t } = useLanguage();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const planLimits = {
        free: { maxFiles: 2, name: "Free" },
        starter: { maxFiles: 10, name: "Starter" },
        professional: { maxFiles: 50, name: "Professional" },
        enterprise: { maxFiles: 200, name: "Enterprise" },
    };

    const currentLimit = planLimits[userPlan];
    const usedFiles = currentUsage.files.used;
    const usagePercentage =
        currentUsage.files.total > 0
            ? (usedFiles / currentUsage.files.total) * 100
            : 0;

    const handleViewFile = (documentUrl: string) => {
        if (documentUrl) {
            window.open(documentUrl, "_blank", "noopener,noreferrer");
        }
    };

    const handleDownloadFile = async (
        documentUrl: string,
        fileName: string
    ) => {
        try {
            const response = await fetch(documentUrl);
            if (!response.ok) {
                throw new Error(t("FilesPage.uploadModal.downloadFailedError"));
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleDeleteClick = (fileId: string) => {
        setFileToDelete(fileId);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (fileToDelete) {
            setIsDeleting(true);
            try {
                const result = await deleteFile(fileToDelete);
                if (!result.success) {
                    console.error(
                        result.error ||
                            t("FilesPage.uploadModal.deleteFailedError")
                    );
                }
            } catch (error) {
                console.error(
                    error instanceof Error
                        ? error.message
                        : t("FilesPage.uploadModal.deleteFailedError")
                );
            } finally {
                setIsDeleting(false);
                setIsDeleteDialogOpen(false);
                setFileToDelete(null);
            }
        }
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="h-[calc(100vh-65px)] bg-gray-50">
            <div className="mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {t("FilesPage.title")}
                        </h1>
                        <p className="text-gray-600">
                            {t("FilesPage.description")}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">
                                {t("FilesPage.fileUsage")}
                            </div>
                            <div className="font-semibold">
                                {t("FilesPage.filesUsed", {
                                    used: usedFiles,
                                    total: currentUsage.files.total,
                                })}
                            </div>
                        </div>
                        <Button
                            variant="default"
                            size="default"
                            onClick={() => setShowUploadModal(true)}
                            disabled={
                                loading || usedFiles >= currentUsage.files.total
                            }
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t("FilesPage.addFileButton")}
                        </Button>
                    </div>
                </div>
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {t("FilesPage.fileUsage")}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {t("FilesPage.planName", {
                                            plan: currentLimit.name,
                                            used: usedFiles,
                                            total: currentUsage.files.total,
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">
                                    {t("FilesPage.usedPercentage", {
                                        percentage: Math.round(usagePercentage),
                                    })}
                                </div>
                            </div>
                        </div>
                        <Progress
                            value={usagePercentage}
                            className="h-3 mb-4"
                        />
                        {usagePercentage >= 80 && (
                            <Alert>
                                <AlertTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {t("FilesPage.approachingLimitTitle")}
                                </AlertTitle>
                                <AlertDescription className="flex items-center justify-between">
                                    <span>
                                        {t(
                                            "FilesPage.approachingLimitDescription",
                                            {
                                                used: usedFiles,
                                                total: currentUsage.files.total,
                                            }
                                        )}
                                    </span>
                                    {onUpgrade && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={onUpgrade}
                                        >
                                            <ArrowUpRight className="h-4 w-4 mr-1" />
                                            {t("FilesPage.upgradeButton")}
                                        </Button>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
                {loading && (
                    <div className="text-center py-16">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">
                            {t("FilesPage.loadingFiles")}
                        </p>
                    </div>
                )}
                {!loading && files && files.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {files.map((file) => (
                            <Card key={file.id}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                            {getFileIcon(file.originalName)}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {file.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {file.originalName}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {file.category}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-3 mb-4">
                                        {file.tags && file.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {file.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border"
                                                    >
                                                        <Tag className="h-2 w-2 mr-1" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {file.description && (
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {file.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {formatDate(file.uploadDate)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatFileSize(file.size)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex space-x-2 w-full">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() =>
                                                    file.documentUrl &&
                                                    handleViewFile(
                                                        file.documentUrl
                                                    )
                                                }
                                                disabled={!file.documentUrl}
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                {t("FilesPage.viewButton", {
                                                    defaultValue: "View",
                                                })}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() =>
                                                    file.documentUrl &&
                                                    handleDownloadFile(
                                                        file.documentUrl,
                                                        file.originalName
                                                    )
                                                }
                                                disabled={!file.documentUrl}
                                            >
                                                <Download className="h-3 w-3 mr-1" />
                                                {t("FilesPage.downloadButton", {
                                                    defaultValue: "Download",
                                                })}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteClick(file.id)
                                                }
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t("FilesPage.noFilesTitle")}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {t("FilesPage.noFilesDescription")}
                            </p>
                            <Button
                                variant="default"
                                size="default"
                                onClick={() => setShowUploadModal(true)}
                                disabled={
                                    loading ||
                                    usedFiles >= currentUsage.files.total
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t("FilesPage.addFirstFileButton")}
                            </Button>
                        </div>
                    )
                )}
                <FileUploadModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onFileUpload={onFileUpload}
                    usedFiles={usedFiles}
                    totalFiles={currentUsage.files.total}
                />
                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {t("FilesPage.confirmDeleteTitle")}
                            </DialogTitle>
                            <DialogDescription>
                                {t("FilesPage.confirmDeleteDescription")}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                size="default"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                {t("FilesPage.uploadModal.cancelButton")}
                            </Button>
                            <Button
                                variant="destructive"
                                size="default"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                {t("FilesPage.deleteButton")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default FilesPage;
