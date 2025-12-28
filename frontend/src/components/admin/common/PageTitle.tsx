interface PageTitleProps {
    title: string;
    subTitle: string;
}

export default function PageTitle({title, subTitle} : PageTitleProps) {
    return (
        <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
            <p className="text-2xl lg:text-3xl font-bold">{title}</p>
            <p className="text-sm md:text-base text-gray-600">{subTitle}</p>
        </div>
    )
}