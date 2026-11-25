import { useAtomValue } from "jotai";
import { Textarea } from "../../../ui/shadcn/textarea";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/shadcn/accordion";

import { itemsAtom } from "../../store/a-local-storage-state";
import { allTogetherTextAtom } from "../../store/a-derived";
//---------------------------------------------------------------------------

export function Part_AllTogether() {
    const items = useAtomValue(itemsAtom);
    const allTogetherText = useAtomValue(allTogetherTextAtom);

    return (
        <AccordionItem value="all-together">
            <AccordionTrigger>All Together</AccordionTrigger>
            <AccordionContent>
                <Textarea value={allTogetherText} readOnly rows={items.length + 1} />
            </AccordionContent>
        </AccordionItem>
    );
}