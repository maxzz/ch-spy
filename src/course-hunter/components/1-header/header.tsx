import { useAtom, useAtomValue } from 'jotai';
import { courseInfoAtom, dragActiveAtom, showRawInfoAtom } from '../../store/a-state';

export function Header() {
    const { raw, duration, preview, site } = useAtomValue(courseInfoAtom);
    const dragActive = useAtomValue(dragActiveAtom);
    const [showRawInfo, setShowRawInfo] = useAtom(showRawInfoAtom);

    return (
        <div className="flex justify-between items-center">
            <div className="pl-2 py-4 text-2xl font-bold bg-[#201c2b] ch-custom-cursor">
                <a href="https://coursehunter.net" target="_blank" rel="noreferrer">
                    <span className={dragActive ? 'text-green-400' : 'text-gray-100'}>course</span>
                    <span className={dragActive ? 'text-green-400' : 'text-[#944fff]'}>hunter</span>
                </a>
            </div>

            <div className="flex">
                <div className="relative self-center mr-2 w-6 h-6 text-gray-400 cursor-pointer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" onClick={() => setShowRawInfo((v) => !v)}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>

                    {showRawInfo && (
                        <div className="absolute top-8 text-xs font-mono text-gray-400 bg-gray-800 border rounded-sm z-20 cursor-default -right-32">
                            <div className="max-w-xs max-h-96 overflow-auto ch-smallscroll">
                                <pre>{JSON.stringify(raw, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <div className="px-1 text-xs text-gray-400 grid grid-flow-row grid-cols-2 gap-x-1">
                        <div className="text-right">Published:</div>
                        <div>{raw.datePublished}</div>
                        <div className="text-right">Modified:</div>
                        <div>{raw.dateModified}</div>
                        <div className="text-right">Duration:</div>
                        <div>{duration}</div>
                    </div>

                    <span>
                        {preview && (
                            <a href={site} target="_blank" rel="noreferrer">
                                <img className="mr-2 max-h-14" src={preview} alt="course logo" />
                            </a>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}
