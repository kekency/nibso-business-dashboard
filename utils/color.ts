/**
 * Lightens or darkens a color.
 * @param color The hex color code (e.g., "#RRGGBB").
 * @param percent The percentage to lighten (positive) or darken (negative).
 * @returns The new hex color code.
 */
export const shadeColor = (color: string, percent: number): string => {
    let f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = (f >> 8) & 0x00ff,
        B = f & 0x0000ff;
    return (
        "#" +
        (
            0x1000000 +
            (Math.round((t - R) * p) + R) * 0x10000 +
            (Math.round((t - G) * p) + G) * 0x100 +
            (Math.round((t - B) * p) + B)
        )
            .toString(16)
            .slice(1)
            .padStart(6, '0')
    );
};
