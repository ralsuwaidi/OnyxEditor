import { Hash } from "@phosphor-icons/react";
import { SidebarItem, SidebarLabel } from "../../../../components/sidebar";
import useDocumentStore from "../../../../contexts/useDocumentStore";
import { useMemo } from "react";
import { countTagOccurrences, moveSelectedTagsToFront, sortTagsByFrequency } from "../../../Mobile/NotesListPage/components/utils";
import useFilterStore from "../../../../contexts/useFilterStore";

export default function TagList() {
    const { documents } = useDocumentStore();
    const { filterTags, toggleFilterTag } = useFilterStore();

    const sortedUniqueTags = useMemo(() => {
        const tagCounts = countTagOccurrences(documents);
        const sortedTags = sortTagsByFrequency(tagCounts);
        return moveSelectedTagsToFront(sortedTags, filterTags);
    }, [documents, filterTags]);

    return (
        <div className="max-h-36 overflow-y-auto">
            {sortedUniqueTags.map((tag) => (
                <SidebarItem current={filterTags.includes(tag)} onClick={() => toggleFilterTag(tag)} key={tag}>
                    <Hash size={20} />
                    <SidebarLabel>{tag}</SidebarLabel>
                </SidebarItem>
            ))}
        </div>
    );
}
