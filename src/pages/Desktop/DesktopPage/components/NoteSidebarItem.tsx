
type NoteSidebarItemProp = {
    title: string;
    description: string;

}

export default function NoteSidebarItem({ title, description }: NoteSidebarItemProp) {
    return (
        <div>
            <p>{title}</p>
            <p className="text-sm opacity-40 line-clamp-2">{description}</p>
        </div>
    )
}