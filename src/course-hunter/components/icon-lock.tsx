// https://icones.js.org/collection/tabler

export function IconLock({ locked }: { locked: boolean; }) {
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
