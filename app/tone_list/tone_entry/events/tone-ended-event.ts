import { AppEvent } from './../../../app_bus/app-event';
import { ToneEntry } from './../tone-entry';

export class ToneEndedEvent extends AppEvent {

    constructor(readonly toneEntry: ToneEntry) {
        super("Tone ended");
    }
}
