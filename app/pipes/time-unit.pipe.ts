import { Pipe, PipeTransform } from '@angular/core';
import { TimeUnit } from './../util';

/**
 * usage:
 *  {{TimeUnit.SECONDS | timeunit : "shortname"}}
 */

@Pipe({
    name: 'timeunit'
})
export class TimeUnitPipe implements PipeTransform {
    transform(timeUnit: TimeUnit, arg1: string) {
        if(arg1 == "shortname") {
            switch(timeUnit) {
                case TimeUnit.NANOSECONDS: return "ns";
                case TimeUnit.MICROSECONDS: return "μs";
                case TimeUnit.MILLISECONDS: return "ms";
                case TimeUnit.SECONDS: return "sec";
                case TimeUnit.MINUTES: return "min";
                case TimeUnit.HOURS: return "hour";
                case TimeUnit.DAYS: return "day";
                default:
                    throw new Error("Invalid TimeUnit");
            }
        }
        throw new Error(this.constructor.name + " arguments: \"shortname\"")
    }
}
