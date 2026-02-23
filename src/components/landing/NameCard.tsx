export const NameCard: React.FC = () => {
    return (
        <div className="rounded-2xl p-4 flex flex-col items-center justify-center text-foreground">
            <div className="flex flex-col -gap-y-1 mb-8 w-full justify-center">
                <h1 className="text-5xl font-bold text-primary">
                    Gus
                </h1>
                <h2 className="text-2xl text-wrap font-medium">
                    Supratouch Suwatno
                </h2>
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <div className="flex gap-x-2">
                    <span className="text-foreground font-medium">Fulltime</span><span className="text-foreground/50">Software Engineer</span>
                </div>
                <div className="flex gap-x-2">
                    <span className="text-foreground font-medium">Parttime</span><span className="text-foreground/50">Random stuff coder</span>
                </div>
            </div>
        </div>
    )
}