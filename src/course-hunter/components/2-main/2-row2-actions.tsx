import { useAtomValue } from "jotai";

import { courseInfoAtom } from "../../store/a-local-storage-state";
import { DownloadRenameButton, EditableLockToggle } from "./4-part2-other";

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
