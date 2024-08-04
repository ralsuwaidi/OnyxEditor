
type NoteSidebarItemProp = {
    title: string;
    description: string;

}

export default function NoteSidebarItem({ title, description }: NoteSidebarItemProp) {
    return (
        <div className="hover:cursor-pointer max-w-full">
            <p>{title}</p>
            <p className="text-xs opacity-40 line-clamp-2">{description}</p>
        </div>
    )
}