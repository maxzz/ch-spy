import { type ComponentProps } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { classNames } from "@/utils/classnames";
import { Button } from "@/ui/shadcn/button";
import { Textarea } from "../../../ui/shadcn/textarea";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/shadcn/accordion";

import { editableTitlesAtom, itemsAtom } from "../../store/a-local-storage-state";
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

export function EditableLockToggle({ className, ...rest }: ComponentProps<"div">) {
    const [editable, setEditable] = useAtom(editableTitlesAtom);

    return (
        <div
            className={classNames("cursor-pointer", className)}
            onClick={() => setEditable((v) => !v)}
            title="List items editable/non-editable"
            {...rest}
        >
            <IconLock locked={!editable} />
        </div>
    );
}

function IconLock({ locked }: { locked: boolean; }) { //https://icones.js.org/collection/tabler
    return (
        <svg viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="16" r="1" />
                {locked
                    ? <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    : <path d="M8 11V6a4 4 0 0 1 8 0" />
                }
            </g>
        </svg>
    );
}

//---------------------------------------------------------------------------

export function DownloadRenameButton({ className, ...rest }: ComponentProps<"button">) {
    const saveFiles = useSetAtom(saveFilesAtom);

    return (
        <Button variant="outline" className={classNames("py-0 h-6 text-sm", className)} onClick={() => saveFiles()} type="button" {...rest}>
            Download rename.cmd
        </Button>
    );
}
