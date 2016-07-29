export class MathUtil {

    private constructor() {
    }

    public static clamp(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }

    public static numberWithinPercentOfMod(value: number, mod: number, percent: number) {
        let t = (value % mod) / mod;
        return Math.abs(1 - t) < percent / 100 || t < percent / 100;
    }
}
