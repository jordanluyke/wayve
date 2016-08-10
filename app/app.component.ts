import { Component } from '@angular/core';
import { ToneListComponent } from './tone_list/tone-list.component';

@Component({
    directives: [ToneListComponent],
    selector: 'waveform-app',
    templateUrl: './app/app.html'
})
export class AppComponent {}
