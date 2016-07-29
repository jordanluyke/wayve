export class TimeUnit {

    public static NANOSECONDS = new TimeUnit(1);
    public static MICROSECONDS = new TimeUnit(TimeUnit.NANOSECONDS.scale * 1000);
    public static MILLISECONDS = new TimeUnit(TimeUnit.MICROSECONDS.scale * 1000);
    public static SECONDS = new TimeUnit(TimeUnit.MILLISECONDS.scale * 1000);
    public static MINUTES = new TimeUnit(TimeUnit.SECONDS.scale * 60);
    public static HOURS = new TimeUnit(TimeUnit.MINUTES.scale * 60);
    public static DAYS = new TimeUnit(TimeUnit.HOURS.scale * 24);

    private constructor(private scale: number) {
    }

    public toNanos(duration: number): number {
        return this.scale * duration / TimeUnit.NANOSECONDS.scale;
    }

    public toMicros(duration: number): number {
        return this.scale * duration / TimeUnit.MICROSECONDS.scale;
    }

    public toMillis(duration: number): number {
        return this.scale * duration / TimeUnit.MILLISECONDS.scale;
    }

    public toSeconds(duration: number): number {
        return this.scale * duration / TimeUnit.SECONDS.scale;
    }

    public toMinutes(duration: number): number {
        return this.scale * duration / TimeUnit.MINUTES.scale;
    }

    public toHours(duration: number): number {
        return this.scale * duration / TimeUnit.HOURS.scale;
    }

    public toDays(duration: number): number {
        return this.scale * duration / TimeUnit.DAYS.scale;
    }
}
