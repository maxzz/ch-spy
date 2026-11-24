import { useAtomValue } from "jotai";
import { ScrollArea } from "../../../ui/shadcn/scroll-area";
import { Accordion } from "@/ui/shadcn/accordion";

import { itemsAtom } from "../../store/a-local-storage-state";
import { useAccordionOpenState } from "../../store/a-local-storage-atoms";

import { ErrorMessage } from "./6-error-message";
import { Row1_SourceInput } from "./1-row1-source-input";
import { Row2_Actions } from "./2-row2-actions";
import { Part_AllTogether, Part_BatchRename } from "./4-part2-other";
import { Part_GeneratedItems } from "./3-part1-playable-items";
import { Part_DevPanels } from "./5-1-part3-dev-panels";

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
            <Row2_Actions />

            <Part_GeneratedItems />

            <Accordion type="multiple" {...generatedAccordion}>
                <Part_BatchRename />
                <Part_AllTogether />
                <Part_DevPanels />
            </Accordion>
        </div>
    );
}
