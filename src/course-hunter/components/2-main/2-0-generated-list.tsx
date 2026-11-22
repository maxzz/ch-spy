import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { courseInfoAtom, editableTitlesAtom, itemsAtom } from '../../store/state';
import { allTogetherTextAtom, batchRenameFileAtom, itemNamesAtom } from '../../store/derived';
import { saveFilesAtom } from '../../store/actions';
import { DownloadButton } from './2-1-download-button';
import { IconLock } from './2-2-icon-lock';

export function GeneratedList() {
    const items = useAtomValue(itemsAtom);
    const { title, desc } = useAtomValue(courseInfoAtom);
    const names = useAtomValue(itemNamesAtom);
    const batchRenameFile = useAtomValue(batchRenameFileAtom);
    const allTogetherText = useAtomValue(allTogetherTextAtom);
    const [editable, setEditable] = useAtom(editableTitlesAtom);
    const saveFiles = useSetAtom(saveFilesAtom);

    if (!items.length) {
        return null;
    }

    return (
        <div className="ch-generated relative">
            <div className="relative pb-2 min-h-16 font-bold text-[#5d0083] bg-linear-to-r from-[#88b0ff] to-[#bc94fe82] flex items-end justify-center">
                <div title={desc}>{title}</div>

                <div
                    className="absolute bottom-1 right-1 w-5 h-5 text-purple-500 stroke-1"
                    onClick={() => setEditable((v) => !v)}
                    title="List items editable/non-editable"
                >
                    <IconLock locked={!editable} />
                </div>
            </div>

            <div className="absolute top-1 right-0 flex justify-end">
                <button className="btn py-0 h-6 text-sm" onClick={() => saveFiles()} type="button">
                    Download rename.cmd
                </button>
            </div>

            <div className="ch-list bg-[#f1f1f1]">
                <ul>
                    {items.map((item, index) => (
                        <li key={`${index}:${names[index]}`}>
                            {editable
                                ? <input className="text-sm" defaultValue={names[index]} />
                                : <div className="pl-2 py-2 text-sm leading-tight hover:bg-[#ffffff80]">{names[index]}</div>
                            }

                            <DownloadButton selectable={!editable} url={item.url} />

                            <a
                                className={`select-none ${item.url ? '' : 'ch-nolink'}`}
                                href={item.url || undefined}
                                title={`video ${index + 1}`}
                                tabIndex={-1}
                                target="blank"
                            >
                                <span>{item.duration}</span> mp4
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <details>
                <summary>Batch rename file</summary>
                <button onClick={() => saveFiles()} type="button">
                    Download rename.cmd
                </button>
                <span className="ch-rename-node"> * convert in notepad++ utf8 saved file to ansi for russian names</span>
                <textarea value={batchRenameFile} readOnly rows={items.length + 2} />
            </details>

            <details>
                <summary>All Together</summary>
                <textarea value={allTogetherText} readOnly rows={items.length + 1} />
            </details>
        </div>
    );
}
