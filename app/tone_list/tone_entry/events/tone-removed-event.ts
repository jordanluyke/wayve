import { AppEvent } from './../../../app_bus/app-event';
import { ToneEntry } from './../tone-entry';

export class ToneRemovedEvent extends AppEvent {

    constructor(readonly toneEntry: ToneEntry) {
        super("Clicked remove tone entry");
    }
}
