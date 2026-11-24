import { type ComponentProps } from "react";
import { useAtom, useAtomValue } from "jotai";
import { classNames } from "@/utils/classnames";

import { courseInfoAtom, editableTitlesAtom } from "../../store/a-local-storage-state";
import { DownloadRenameButton } from "./4-part2-other";

/** Row 2: title bar of the generated list, with the lock toggle and the download button. */
export function Row2_Actions() {
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
