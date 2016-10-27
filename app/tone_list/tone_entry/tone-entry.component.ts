import { Component, Input, OnInit } from '@angular/core';
import { ToneEntry } from './tone-entry';
import { TimeUnit, MathUtil } from './../../util/index';
import { AppBus } from './../../app_bus/app-bus';
import { ToneRemovedEvent, ToneAddedEvent, ToneEndedEvent } from './events/index';

@Component({
    selector: 'tone-entry-component',
    styleUrls: ['./app/tone_list/tone_entry/tone-entry.css'],
    templateUrl: './app/tone_list/tone_entry/tone-entry.html'
})
export class ToneEntryComponent implements OnInit {

    @Input() entry: ToneEntry;

    public TimeUnit: any = TimeUnit;
    public MathUtil: any = MathUtil;

    constructor(private appBus: AppBus) {
    }

    public ngOnInit(): void {
        this.entry.onEnded.subscribe(Void => this.appBus.publish(new ToneEndedEvent(this.entry)));
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
