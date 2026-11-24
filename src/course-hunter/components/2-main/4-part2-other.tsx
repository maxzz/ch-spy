import { type ComponentProps } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { classNames } from "@/utils/classnames";
import { Button } from "@/ui/shadcn/button";
import { Textarea } from "../../../ui/shadcn/textarea";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/shadcn/accordion";

import { itemsAtom } from "../../store/a-local-storage-state";
import { allTogetherTextAtom, batchRenameFileAtom } from "../../store/a-derived";
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

//---------------------------------------------------------------------------

//---------------------------------------------------------------------------

export function DownloadRenameButton({ className, ...rest }: ComponentProps<"button">) {
    const saveFiles = useSetAtom(saveFilesAtom);

    return (
        <Button variant="outline" className={classNames("py-0 h-6 text-sm", className)} onClick={() => saveFiles()} type="button" {...rest}>
            Download rename.cmd
        </Button>
    );
}
