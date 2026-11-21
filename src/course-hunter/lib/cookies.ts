/** Sets a cookie for the current domain. An empty value deletes the cookie (expires yesterday). */
export function setCookieValue(name: string, value?: string, domain = document.domain, path = '/'): void {
    const d = new Date();
    if (value) {
        d.setDate(d.getDate() + 7);
    } else {
        d.setDate(d.getDate() - 1);
    }
    document.cookie = `${name}=${value ?? ''}; expires=${d}; domain=${domain}; path=${path}`;
}

/** "a=1; b=2" -> [['a', '1'], ['b', '2']] */
export function splitCookie(cookieStr: string): string[][] {
    return (cookieStr || '').split(';').map((_) => _.trim()).filter(Boolean).map((_) => _.split('=')).filter((_) => !!_[0]);
}
