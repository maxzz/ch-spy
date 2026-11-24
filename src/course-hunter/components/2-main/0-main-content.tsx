import { useAtomValue } from "jotai";
import { ScrollArea } from "../../../ui/shadcn/scroll-area";
import { Accordion } from "@/ui/shadcn/accordion";

import { courseInfoAtom, itemsAtom } from "../../store/a-local-storage-state";
import { useAccordionOpenState } from "../../store/a-local-storage-atoms";

import { ErrorMessage } from "./6-error-message";
import { Row1_SourceInput } from "./1-row1-source-input";
import { Part_AllTogether, Part_BatchRename, DownloadRenameButton, EditableLockToggle } from "./4-part2-other";
import { Part_GeneratedItems } from "./3-part1-playable-items";
import { Part_DevPanels, Part_PlayerItems } from "./5-part3-dev-panels";

export function MainContent() {
    return (
        <div className="flex-1 mx-auto min-h-0 w-full max-w-3xl rounded bg-gray-300">
            <ScrollArea fullHeight fixedWidth className="h-full">
                <div className="px-4 py-4">
                    <Row1_SourceInput />

                    <Part_PlayerItems />

                    <Part_AllSections />

                    <ErrorMessage />
                </div>
            </ScrollArea>
        </div>
    );
}

function Part_AllSections() {
    const { title, desc } = useAtomValue(courseInfoAtom);
    const items = useAtomValue(itemsAtom);
    const generatedAccordion = useAccordionOpenState('generated-list');

    if (!items.length) {
        return null;
    }

    return (
        <div className="relative">
            <div className="relative pb-2 min-h-16 font-bold text-[#5d0083] bg-linear-to-r from-[#88b0ff] to-[#bc94fe82] flex items-end justify-center">
                <div title={desc}>{title}</div>

                <EditableLockToggle className="absolute bottom-1 right-1 w-5 h-5 text-purple-500 stroke-1" />
            </div>

            <div className="absolute top-1 right-0 flex justify-end">
                <DownloadRenameButton />
            </div>

            <Part_GeneratedItems />

            <Accordion type="multiple" {...generatedAccordion}>
                <Part_BatchRename />
                <Part_AllTogether />
                <Part_DevPanels />
            </Accordion>
        </div>
    );
}
