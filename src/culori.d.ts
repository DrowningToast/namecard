declare module 'culori' {
    type Color = Record<string, unknown> & { mode: string };
    export function parse(color: string): Color | undefined;
    export function formatHex(color: Color): string | undefined;
}
