import Editor from "../../Mobile/EditorPage/components/Editor";
import DesktopSidebar from "./components/Sidebar";



export default function DesktopPage() {
    return (
        <DesktopSidebar>
            {/* <div className="overflow-auto max-h-screen"> */}
            <Editor />
            {/* </div> */}
        </DesktopSidebar>
    )
}