import { type ComponentProps } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { classNames } from "@/utils/classnames";
import { Button } from "@/ui/shadcn/button";
import { Textarea } from "../../../ui/shadcn/textarea";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/shadcn/accordion";

import { itemsAtom } from "../../store/a-local-storage-state";
import { allTogetherTextAtom } from "../../store/a-derived";
import { saveFilesAtom } from "../../store/a-actions";

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

export function DownloadRenameButton({ className, ...rest }: ComponentProps<"button">) {
    const saveFiles = useSetAtom(saveFilesAtom);

    return (
        <Button variant="outline" className={classNames("py-0 h-6 text-sm", className)} onClick={() => saveFiles()} type="button" {...rest}>
            Download rename.cmd
        </Button>
    );
}
