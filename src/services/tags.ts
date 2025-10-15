import { useState, useEffect } from "react";
import supabase from "@/libs/supabase";
import { Tag } from "@/types";

const GLOBAL_TAGS = [
    {
        name: "VIP",
        color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900",
    },
    {
        name: "Lead",
        color: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900",
    },
    {
        name: "Partnership",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900",
    },
    {
        name: "Sponsorship",
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900",
    },
    {
        name: "Reactivate",
        color: "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900",
    },
];

export const useTagService = (companyId: string | undefined) => {
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [tagsLoading, setTagsLoading] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagError, setTagError] = useState<string | null>(null);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("");
    const [editingTag, setEditingTag] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [editingColor, setEditingColor] = useState("");

    useEffect(() => {
        if (companyId) {
            fetchAvailableTags();
        }
    }, [companyId]);

    const fetchAvailableTags = async () => {
        if (!companyId) return;
        setTagsLoading(true);
        try {
            const { data: existingTags, error: fetchError } = await supabase
                .from("tags")
                .select("id, name, color")
                .eq("company_id", companyId)
                .order("name", { ascending: true });
            if (fetchError) throw fetchError;

            const tagsToInsert = GLOBAL_TAGS.filter(
                (globalTag) =>
                    !existingTags?.some((tag) => tag.name === globalTag.name)
            ).map((globalTag) => ({
                name: globalTag.name,
                color: globalTag.color,
                company_id: companyId,
            }));

            if (tagsToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from("tags")
                    .insert(tagsToInsert);
                if (insertError) throw insertError;
            }

            const { data: updatedTags, error: updatedFetchError } =
                await supabase
                    .from("tags")
                    .select("id, name, color")
                    .eq("company_id", companyId)
                    .order("name", { ascending: true });
            if (updatedFetchError) throw updatedFetchError;

            setTags(
                updatedTags?.map((tag) => ({
                    ...tag,
                    isGlobal: GLOBAL_TAGS.map((gt) => gt.name).includes(
                        tag.name
                    ),
                })) || []
            );
            setAvailableTags(updatedTags?.map((d) => d.name) || []);
        } catch (err) {
            console.error("Error fetching or initializing tags:", err);
            setTagError("Failed to load tags");
        } finally {
            setTagsLoading(false);
        }
    };

    const handleAddTag = () => {
        if (!newTagName.trim()) {
            setTagError("Tag name is required");
            return;
        }

        const trimmedName = newTagName.trim();
        if (tags.some((tag) => tag.name === trimmedName && !tag.isDeleted)) {
            setTagError("Tag already exists!");
            return;
        }

        const newTag: Tag = {
            id: `temp-${Date.now()}-${Math.random()}`,
            name: trimmedName,
            color: newTagColor || "bg-gray-100 text-gray-800",
            isNew: true,
        };

        setTags((prev) => [...prev, newTag]);
        setNewTagName("");
        setNewTagColor("");
        setTagError(null);
    };

    const handleEditTag = (
        tagId: string,
        currentName: string,
        currentColor: string
    ) => {
        setEditingTag(tagId);
        setEditingValue(currentName);
        setEditingColor(currentColor || "bg-gray-100 text-gray-800");
    };

    const handleSaveEdit = () => {
        if (!editingValue.trim() || !editingTag) {
            setTagError("Tag name is required");
            return;
        }

        const trimmedValue = editingValue.trim();
        if (
            trimmedValue !== editingValue &&
            tags.some((tag) => tag.name === trimmedValue && !tag.isDeleted)
        ) {
            setTagError("Tag name already exists!");
            return;
        }

        setTags((prev) =>
            prev.map((tag) =>
                tag.id === editingTag
                    ? {
                          ...tag,
                          name: trimmedValue,
                          color: editingColor,
                          isGlobal: GLOBAL_TAGS.map((gt) => gt.name).includes(
                              trimmedValue
                          ),
                      }
                    : tag
            )
        );
        setEditingTag(null);
        setEditingValue("");
        setEditingColor("");
        setTagError(null);
    };

    const handleDeleteTag = (tagId: string, tagName: string) => {
        if (GLOBAL_TAGS.map((gt) => gt.name).includes(tagName)) {
            setTagError("Global tags cannot be deleted");
            return;
        }

        if (
            window.confirm(
                `Are you sure you want to delete the "${tagName}" tag? This action cannot be undone after saving changes.`
            )
        ) {
            setTags((prev) =>
                prev.map((tag) =>
                    tag.id === tagId ? { ...tag, isDeleted: true } : tag
                )
            );
            setTagError(null);
        }
    };

    const handleChangeTagColor = (tagId: string, color: string) => {
        setTags((prev) =>
            prev.map((tag) => (tag.id === tagId ? { ...tag, color } : tag))
        );
    };

    const handleSaveTagChanges = async () => {
        if (!companyId) return;
        setTagsLoading(true);
        try {
            const tagsToDelete = tags.filter(
                (tag) => tag.isDeleted && !tag.isNew && !tag.isGlobal
            );
            for (const tag of tagsToDelete) {
                if (GLOBAL_TAGS.map((gt) => gt.name).includes(tag.name)) {
                    setTagError("Global tags cannot be deleted");
                    continue;
                }

                const { error: deleteTagError } = await supabase
                    .from("tags")
                    .delete()
                    .eq("id", tag.id)
                    .eq("company_id", companyId);
                if (deleteTagError) throw deleteTagError;

                const { data: contacts, error: fetchContactsError } =
                    await supabase
                        .from("contacts")
                        .select("id, tags")
                        .eq("company_id", companyId)
                        .contains("tags", [tag.name]);
                if (fetchContactsError) throw fetchContactsError;

                for (const contact of contacts) {
                    const updatedTags = contact.tags.filter(
                        (t: string) => t !== tag.name
                    );
                    const { error: updateContactError } = await supabase
                        .from("contacts")
                        .update({ tags: updatedTags })
                        .eq("id", contact.id)
                        .eq("company_id", companyId);
                    if (updateContactError) throw updateContactError;
                }
            }

            const tagsToInsert = tags.filter(
                (tag) => tag.isNew && !tag.isDeleted
            );
            if (tagsToInsert.length > 0) {
                const { error } = await supabase.from("tags").insert(
                    tagsToInsert.map((tag) => ({
                        name: tag.name,
                        color: tag.color,
                        company_id: companyId,
                    }))
                );
                if (error) throw error;
            }

            const tagsToUpdate = tags.filter(
                (tag) => !tag.isNew && !tag.isDeleted
            );
            for (const tag of tagsToUpdate) {
                if (
                    !tag.isGlobal ||
                    !GLOBAL_TAGS.map((gt) => gt.name).includes(tag.name)
                ) {
                    const { error } = await supabase
                        .from("tags")
                        .update({ name: tag.name, color: tag.color })
                        .eq("id", tag.id)
                        .eq("company_id", companyId);
                    if (error) throw error;
                }
            }

            const { data: updatedTags, error: fetchError } = await supabase
                .from("tags")
                .select("id, name, color")
                .eq("company_id", companyId)
                .order("name", { ascending: true });
            if (fetchError) throw fetchError;

            setTags(
                updatedTags?.map((tag) => ({
                    ...tag,
                    isGlobal: GLOBAL_TAGS.map((gt) => gt.name).includes(
                        tag.name
                    ),
                })) || []
            );
            setAvailableTags(updatedTags?.map((t) => t.name) || []);
        } catch (err: any) {
            setTagError("Failed to save changes: " + err.message);
        } finally {
            setTagsLoading(false);
        }
    };

    const handleResetTags = () => {
        setNewTagName("");
        setNewTagColor("");
        setEditingTag(null);
        setEditingValue("");
        setEditingColor("");
        setTagError(null);
        fetchAvailableTags();
    };

    return {
        availableTags,
        tagsLoading,
        tags,
        tagError,
        newTagName,
        newTagColor,
        editingTag,
        editingValue,
        editingColor,
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
        fetchAvailableTags,
    };
};
