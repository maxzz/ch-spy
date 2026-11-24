import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/ui/shadcn/button";
import { Textarea } from "../../../ui/shadcn/textarea";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/shadcn/accordion";

import { itemsAtom } from "../../store/a-local-storage-state";
import { batchRenameFileAtom } from "../../store/a-derived";
import { saveFilesAtom } from "../../store/a-actions";

//---------------------------------------------------------------------------

export function Part_BatchRename() {
    const items = useAtomValue(itemsAtom);
    const batchRenameFile = useAtomValue(batchRenameFileAtom);
    const saveFiles = useSetAtom(saveFilesAtom);

    return (
        <AccordionItem value="batch-rename">
            <AccordionTrigger>Batch rename file</AccordionTrigger>
            <AccordionContent>
                <Button onClick={() => saveFiles()} type="button">
                    Download rename.cmd
                </Button>
                <span className="text-[0.7em]"> * convert in notepad++ utf8 saved file to ansi for russian names</span>
                <Textarea value={batchRenameFile} readOnly rows={items.length + 2} />
            </AccordionContent>
        </AccordionItem>
    );
}
