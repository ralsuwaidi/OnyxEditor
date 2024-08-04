import { SidebarHeading, SidebarItem } from "../../../../components/sidebar";
import useDocumentStore from "../../../../contexts/useDocumentStore";
import useFilteredNoteList from "../../../../hooks/useFilteredNoteList";
import { sortDocumentsByUpdatedAt } from "../../../../utils/documents";
import NoteSidebarItem from "./NoteSidebarItem";



export default function NoteListWrapper() {
    const { selectDocument, selectedDocument } = useDocumentStore()
    const filteredDocs = useFilteredNoteList();


    return (
        <>
            <SidebarHeading>Notes</SidebarHeading>
            {sortDocumentsByUpdatedAt(filteredDocs).map((doc) => (
                <SidebarItem current={doc.id === selectedDocument?.id} key={doc.id} onClick={() => selectDocument(doc.id)} >
                    <NoteSidebarItem title={doc.title || "(No Title)"} description={doc.content || " "} />
                </SidebarItem>
            ))}
        </>
    )
}