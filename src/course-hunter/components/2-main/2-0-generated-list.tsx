import { type ComponentProps } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Textarea } from '../../../ui/shadcn/textarea';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../../../ui/shadcn/accordion';

import { editableTitlesAtom, itemsAtom } from '../../store/a-local-storage-state';
import { allTogetherTextAtom, batchRenameFileAtom } from '../../store/a-derived';
import { saveFilesAtom } from '../../store/a-actions';
import { IconLock } from './2-2-icon-lock';
import { classNames } from '@/utils/classnames';

//---------------------------------------------------------------------------

export function BatchRenameSection() {
    const items = useAtomValue(itemsAtom);
    const batchRenameFile = useAtomValue(batchRenameFileAtom);
    const saveFiles = useSetAtom(saveFilesAtom);

    return (
        <AccordionItem value="batch-rename">
            <AccordionTrigger>Batch rename file</AccordionTrigger>
            <AccordionContent>
                <button onClick={() => saveFiles()} type="button">
                    Download rename.cmd
                </button>
                <span className="text-[0.7em]"> * convert in notepad++ utf8 saved file to ansi for russian names</span>
                <Textarea value={batchRenameFile} readOnly rows={items.length + 2} />
            </AccordionContent>
        </AccordionItem>
    );
}

//---------------------------------------------------------------------------

export function AllTogetherSection() {
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

export function DownloadRenameButton({ className, ...rest }: ComponentProps<"button">) {
    const saveFiles = useSetAtom(saveFilesAtom);

    return (
        <button className={classNames("btn py-0 h-6 text-sm", className)} onClick={() => saveFiles()} type="button" {...rest}>
            Download rename.cmd
        </button>
    );
}
