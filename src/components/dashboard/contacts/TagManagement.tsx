import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Tag,
    Plus,
    X,
    Edit,
    Trash2,
    Save,
    AlertCircle,
    CheckCircle,
    Palette,
    Lock,
    Loader2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useInbox } from "@/contexts/InboxContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface TagManagementProps {
    isOpen: boolean;
    onClose: () => void;
}

const TagManagement: React.FC<TagManagementProps> = ({ isOpen, onClose }) => {
    const {
        tags,
        tagError,
        newTagName,
        newTagColor,
        editingTag,
        editingValue,
        editingColor,
        tagsLoading,
        setNewTagName,
        setNewTagColor,
        setEditingTag,
        setEditingValue,
        setEditingColor,
        handleAddTag,
        handleEditTag,
        handleSaveEdit,
        handleDeleteTag,
        handleChangeTagColor,
        handleSaveTagChanges,
        handleResetTags,
    } = useInbox();
    const { t } = useLanguage();

    const predefinedColors = [
        "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900",
        "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900",
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900",
        "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900",
        "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:text-indigo-900",
        "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900",
        "bg-pink-100 text-pink-800 hover:bg-pink-200 hover:text-pink-900",
        "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900",
        "bg-teal-100 text-teal-800 hover:bg-teal-200 hover:text-teal-900",
        "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 hover:text-cyan-900",
    ];

    const getTagColor = (tag: {
        id: string;
        name: string;
        color?: string;
        isGlobal?: boolean;
        isNew?: boolean;
        isDeleted?: boolean;
    }) => {
        return tag.color || "bg-gray-100 text-gray-800";
    };

    const handleCancel = () => {
        handleResetTags();
        onClose();
    };

    const handleSave = () => {
        handleSaveTagChanges();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-blue-500" />
                        {t("TagManagement.title")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {tagError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{tagError}</AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5 text-green-500" />
                                {t("TagManagement.addNewTag.title")}
                            </CardTitle>
                            <CardDescription>
                                {t("TagManagement.addNewTag.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <Input
                                    value={newTagName}
                                    onChange={(e) =>
                                        setNewTagName(e.target.value)
                                    }
                                    placeholder={t(
                                        "TagManagement.addNewTag.placeholder"
                                    )}
                                    className="flex-1"
                                    disabled={tagsLoading}
                                />
                                <Select
                                    value={newTagColor}
                                    onValueChange={setNewTagColor}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue
                                            placeholder={t(
                                                "TagManagement.addNewTag.colorPlaceholder"
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {predefinedColors.map((color) => (
                                            <SelectItem
                                                key={color}
                                                value={color}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-4 h-4 rounded-full ${
                                                            color.split(" ")[0]
                                                        }`}
                                                    />
                                                    <span>
                                                        {color.split("-")[1]}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleAddTag}
                                    disabled={!newTagName.trim() || tagsLoading}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("TagManagement.addNewTag.addButton")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Edit className="h-5 w-5 text-blue-500" />
                                    {t("TagManagement.existingTags.title", {
                                        count: tags.filter(
                                            (tag) => !tag.isDeleted
                                        ).length,
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetTags}
                                    disabled={tagsLoading}
                                >
                                    {t(
                                        "TagManagement.existingTags.resetButton"
                                    )}
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                {t("TagManagement.existingTags.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tagsLoading ? (
                                <div className="text-center py-8">
                                    {t("TagManagement.existingTags.loading")}
                                </div>
                            ) : tags.filter((tag) => !tag.isDeleted).length ===
                              0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>
                                        {t("TagManagement.existingTags.noTags")}
                                    </p>
                                    <p className="text-sm mt-1">
                                        {t(
                                            "TagManagement.existingTags.noTagsDescription"
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tags
                                        .filter((tag) => !tag.isDeleted)
                                        .map((tag) => (
                                            <div
                                                key={tag.id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                            >
                                                {editingTag === tag.id ? (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                value={
                                                                    editingValue
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingValue(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder={t(
                                                                    "TagManagement.existingTags.tagNamePlaceholder"
                                                                )}
                                                                className="w-40"
                                                                autoFocus
                                                                disabled={
                                                                    tagsLoading
                                                                }
                                                            />
                                                            <Select
                                                                value={
                                                                    editingColor
                                                                }
                                                                onValueChange={
                                                                    setEditingColor
                                                                }
                                                            >
                                                                <SelectTrigger className="w-40">
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            "TagManagement.addNewTag.colorPlaceholder"
                                                                        )}
                                                                    />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {predefinedColors.map(
                                                                        (
                                                                            color
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    color
                                                                                }
                                                                                value={
                                                                                    color
                                                                                }
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <div
                                                                                        className={`w-4 h-4 rounded-full ${
                                                                                            color.split(
                                                                                                " "
                                                                                            )[0]
                                                                                        }`}
                                                                                    />
                                                                                    <span>
                                                                                        {
                                                                                            color.split(
                                                                                                "-"
                                                                                            )[1]
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setEditingTag(
                                                                        null
                                                                    );
                                                                    setEditingValue(
                                                                        ""
                                                                    );
                                                                    setEditingColor(
                                                                        ""
                                                                    );
                                                                }}
                                                                disabled={
                                                                    tagsLoading
                                                                }
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={
                                                                    handleSaveEdit
                                                                }
                                                                className="bg-green-500 hover:bg-green-600"
                                                                disabled={
                                                                    tagsLoading
                                                                }
                                                            >
                                                                <Save className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-3">
                                                            <Badge
                                                                className={`${getTagColor(
                                                                    tag
                                                                )} px-3 py-1 flex items-center gap-2`}
                                                            >
                                                                {tag.name}
                                                                {tag.isGlobal && (
                                                                    <Lock className="h-3 w-3" />
                                                                )}
                                                            </Badge>
                                                            <span className="text-sm text-gray-600">
                                                                {tag.color
                                                                    ? t(
                                                                          `TagManagement.colors.${
                                                                              tag.color.split(
                                                                                  "-"
                                                                              )[1]
                                                                          }`
                                                                      )
                                                                    : t(
                                                                          "TagManagement.existingTags.noColor"
                                                                      )}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1">
                                                                <Palette className="h-4 w-4 text-gray-400" />
                                                                <div className="flex gap-1">
                                                                    {predefinedColors.map(
                                                                        (
                                                                            color
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    color
                                                                                }
                                                                                className={`w-4 h-4 rounded-full border-2 ${
                                                                                    getTagColor(
                                                                                        tag
                                                                                    ) ===
                                                                                    color
                                                                                        ? "border-gray-600"
                                                                                        : "border-gray-300"
                                                                                } ${
                                                                                    color.split(
                                                                                        " "
                                                                                    )[0]
                                                                                } hover:scale-110 transition-transform`}
                                                                                onClick={() =>
                                                                                    handleChangeTagColor(
                                                                                        tag.id,
                                                                                        color
                                                                                    )
                                                                                }
                                                                                title={t(
                                                                                    "TagManagement.existingTags.changeColor",
                                                                                    {
                                                                                        color: color.split(
                                                                                            "-"
                                                                                        )[1],
                                                                                    }
                                                                                )}
                                                                                disabled={
                                                                                    tagsLoading
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className={`${
                                                                    tag.isGlobal
                                                                        ? "text-gray-400 cursor-not-allowed"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    handleEditTag(
                                                                        tag.id,
                                                                        tag.name,
                                                                        tag.color ||
                                                                            predefinedColors[0]
                                                                    )
                                                                }
                                                                disabled={
                                                                    tagsLoading ||
                                                                    tag.isGlobal
                                                                }
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleDeleteTag(
                                                                        tag.id,
                                                                        tag.name
                                                                    )
                                                                }
                                                                className={`${
                                                                    tag.isGlobal
                                                                        ? "text-gray-400 cursor-not-allowed"
                                                                        : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                }`}
                                                                disabled={
                                                                    tagsLoading ||
                                                                    tag.isGlobal
                                                                }
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <CheckCircle className="h-5 w-5" />
                                {t("TagManagement.bestPractices.title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-blue-800">
                            <ul className="space-y-2 text-sm">
                                <li>
                                    {t(
                                        "TagManagement.bestPractices.clearNames"
                                    )}
                                </li>
                                <li>
                                    {t(
                                        "TagManagement.bestPractices.shortNames"
                                    )}
                                </li>
                                <li>
                                    {t(
                                        "TagManagement.bestPractices.colorGrouping"
                                    )}
                                </li>
                                <li>
                                    {t(
                                        "TagManagement.bestPractices.reviewTags"
                                    )}
                                </li>
                                <li>
                                    {t(
                                        "TagManagement.bestPractices.businessSegments"
                                    )}
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={tagsLoading}
                    >
                        {t("TagManagement.cancelButton")}
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={tagsLoading}
                    >
                        {tagsLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {t("TagManagement.saveButton")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TagManagement;
