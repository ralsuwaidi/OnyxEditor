import { SidebarItem } from "../../../../components/sidebar";
import useDocumentStore from "../../../../contexts/useDocumentStore";
import NoteSidebarItem from "./NoteSidebarItem";



export default function NoteListWrapper() {
    const { getNotes, selectDocument } = useDocumentStore()


    return (
        <>
            {getNotes().map((doc) => (
                <SidebarItem key={doc.id} onClick={() => selectDocument(doc.id)} >
                    <NoteSidebarItem title={doc.title || "(No Title)"} description={doc.content || ""} />
                </SidebarItem>
            ))}
        </>
    )
}