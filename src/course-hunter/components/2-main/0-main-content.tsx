import { useAtomValue } from "jotai";
import { ScrollArea } from "../../../ui/shadcn/scroll-area";
import { Accordion } from "@/ui/shadcn/accordion";

import { courseInfoAtom, itemsAtom } from "../../store/a-local-storage-state";
import { useAccordionOpenState } from "../../store/a-local-storage-atoms";

import { ErrorMessage } from "./6-error-message";
import { Row1_SourceInput } from "./1-row1-source-input";
import { Part_AllTogether, Part_BatchRename, DownloadRenameButton, EditableLockToggle } from "./4-part2-other";
import { Part_GeneratedItems } from "./3-part1-playable-items";
import { Part_DevPanels } from "./5-part3-dev-panels";

export function MainContent() {
    return (
        <div className="flex-1 mx-auto min-h-0 w-full max-w-3xl rounded bg-gray-300">
            <ScrollArea fullHeight fixedWidth className="h-full">
                <div className="px-4 py-4">
                    <Row1_SourceInput />

                    <Part_AllSections />

                    <ErrorMessage />
                </div>
            </ScrollArea>
        </div>
    );
}

function Part_AllSections() {
    const items = useAtomValue(itemsAtom);
    const generatedAccordion = useAccordionOpenState('generated-list');

    if (!items.length) {
        return null;
    }

    return (
        <div className="relative">
            <Part_ListHeader />

            <Part_GeneratedItems />

            <Accordion type="multiple" {...generatedAccordion}>
                <Part_BatchRename />
                <Part_AllTogether />
                <Part_DevPanels />
            </Accordion>
        </div>
    );
}

/** Title bar of the generated list, with the lock toggle and the download button. Positioned within `Part_AllSections`. */
function Part_ListHeader() {
    const { title, desc } = useAtomValue(courseInfoAtom);

    return (<>
        <div className="my-2 p-2 relative min-h-16 text-sm bg-linear-to-r from-[#88b0ff] to-[#bc94fe82] border border-foreground/30 rounded flex flex-col gap-2">
            <div className="truncate" title={desc}>
                {title}
                {/* this is long title that should be truncated with ellipsis even if it is longer than the container even though it is not a tooltip */}
            </div>

            <div className="flex items-center justify-end gap-2">
                <EditableLockToggle className="w-5 h-5 text-purple-500 stroke-1" />

                <div className="justify-end">
                    <DownloadRenameButton className="h-8 text-sm" />
                </div>
            </div>
        </div>
    </>);
}
