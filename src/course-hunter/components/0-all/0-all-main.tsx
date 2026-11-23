import { useSetAtom } from 'jotai';
import { dropFileAtom } from '../../store/a-actions';
import { dragActiveAtom } from '../../store/a-local-storage-state';
import { Header } from '../1-header/header';
import { MainContent } from '../2-main/0-main-content';
import './styles.css';

/** Course list browser: paste or drop a course page, then download the videos. */
export function CourseHunterApp() {
    const setDragActive = useSetAtom(dragActiveAtom);
    const dropFile = useSetAtom(dropFileAtom);

    return (
        <div
            className="h-screen flex flex-col overflow-hidden bg-[#201c2b]"
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
            onDrop={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setDragActive(false);

                const file = event.dataTransfer?.files[0];
                if (file) {
                    void dropFile(file);
                }
            }}
        >
            <div className="shrink-0">
                <Header />
            </div>

            <MainContent />
        </div>
    );
}
