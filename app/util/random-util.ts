export class RandomUtil {

    private constructor() {
    }

    public static generateId(): string {
        return (Math.random()*1e64).toString(36).substr(0, 15);
    }
}
