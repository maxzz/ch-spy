/** Joins the truthy class names. */
export function cx(...inputs: (string | false | null | undefined)[]): string {
    return inputs.filter(Boolean).join(' ');
}
