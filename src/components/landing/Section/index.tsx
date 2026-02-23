import { Description } from "@/components/landing/Section/description";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { format, formatRelative, subDays } from "date-fns";
import { ExternalLink } from "lucide-react";
import type React from "react";

export interface SectionViewModel {
    title: string,
    description?: string,
    url?: string,
    startDate?: Date,
    endDate?: Date,
    subnodes?: {
        title: string,
        description?: string,
        url?: string,
        startDate?: Date,
        endDate?: Date,
    }[]
}

interface SectionProps {
    header: string,
    sectionViewmodels: SectionViewModel[]
}

export const Section: React.FC<SectionProps> = ({ header, sectionViewmodels }) => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">
                    <EncryptedText
                        text={header}
                        encryptedClassName="text-primary/20"
                        revealedClassName="text-primary"
                        revealDelayMs={100}
                        flipDelayMs={10}
                    />
                </h3>
            </div>
            <div className="flex flex-col gap-y-4">
                {
                    sectionViewmodels.map((viewmodel) => (
                        <div className="flex flex-col gap-y-1.5" key={viewmodel.title}>
                            <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-base font-semibold relative border-foreground border-b-2 --offset-4">
                                        {viewmodel.url ? (
                                            <a href={viewmodel.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                                                {viewmodel.title}
                                                <ExternalLink className="size-3.5" />
                                            </a>
                                        ) : viewmodel.title}
                                    </h4>
                                    {viewmodel.startDate ? <span className="text-sm text-foreground">{viewmodel.startDate.toLocaleDateString()}</span> : null}
                                </div>
                                <Description value={viewmodel.description} />
                            </div>
                            {viewmodel.subnodes?.map((subnode) => (
                                <div className="space-y-1" key={subnode.title}>
                                    <div className="flex justify-between items-start">
                                        <h5 className="text-sm font-semibold">
                                            {subnode.url ? (
                                                <a href={subnode.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                                                    {subnode.title}
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            ) : subnode.title}
                                        </h5>
                                        <p className="text-xs text-foreground/80">
                                            {
                                                subnode.startDate ? (
                                                    <span className="text-sm text-foreground text-nowrap">
                                                        {format(subnode.startDate, "MMM yyyy")}
                                                    </span>
                                                ) : null
                                            }
                                            {
                                                subnode.endDate ? (
                                                    <span className="text-sm text-foreground text-nowrap">
                                                        {" "}- {format(subnode.endDate, "MMM yyyy")}
                                                    </span>
                                                ) : (
                                                    <>
                                                        {
                                                            subnode.startDate && !subnode.endDate ? (
                                                                <span className="text-sm text-foreground text-nowrap">
                                                                    {" "}- Present
                                                                </span>
                                                            ) : null
                                                        }
                                                    </>
                                                )
                                            }
                                        </p>
                                    </div>
                                    <Description value={subnode.description} />
                                </div>

                            ))}
                        </div>
                    ))
                }
            </div>
        </div >
    )
}