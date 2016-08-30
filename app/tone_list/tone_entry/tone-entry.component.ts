import { Component, Input } from '@angular/core';
import { ToneEntry } from './tone-entry';
import { TimeUnit, MathUtil } from './../../util/index';
import { AppBus } from './../../app_bus/app-bus';
import { ToneRemovedEvent, ToneAddedEvent } from './events/index';
import { TimeUnitPipe } from './../../pipes/index';

@Component({
    pipes: [TimeUnitPipe],
    selector: 'tone-entry-component',
    styleUrls: ['./app/tone_list/tone_entry/tone-entry.css'],
    templateUrl: './app/tone_list/tone_entry/tone-entry.html'
})
export class ToneEntryComponent {

    @Input() entry: ToneEntry;

    public TimeUnit: any = TimeUnit;
    public MathUtil: any = MathUtil;

    constructor(private appBus: AppBus) {
    }

    public clickRemove(): void {
        this.appBus.publish(new ToneRemovedEvent(this.entry));
    }

    public validateInputNumber(text: string): boolean {
        return Number(text) && Number(text) > 0;
    }

    public addEntryIfTemp(entry: ToneEntry): void {
        if(entry.temp) {
            entry.temp = false;
            this.appBus.publish(new ToneAddedEvent());
        }
    }
}
