import { Pipe, PipeTransform } from '@angular/core';
import { TimeUnit } from './../util/index';
import { DatePipe } from '@angular/common';

/**
 * usage:
 *  {{123000 | timeElapsed}}
 *  {{123 | timeElapsed : TimeUnit.SECONDS}}
 */

@Pipe({
    name: 'timeElapsed',
})
export class TimeElapsedPipe implements PipeTransform {

    private datePipe: DatePipe;

    constructor() {
        this.datePipe = new DatePipe();
    }

    transform(duration: number, timeUnit: TimeUnit = TimeUnit.MILLISECONDS) {
        let date = new Date(1970, 0, 1).setMilliseconds(timeUnit.toMillis(duration));
        return this.datePipe.transform(date, "HH:mm:ss");
    }
}
