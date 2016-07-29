import { AppEvent } from './../../../app_bus/app-event';
import { ToneEntry } from './../tone-entry';

export class ToneAddedEvent extends AppEvent {

    constructor() {
        super("Added tone entry");
    }
}
