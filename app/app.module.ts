import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TimeElapsedPipe, TimeUnitPipe } from './pipes/index';
import { ToneListComponent } from './tone_list/tone-list.component';
import { ToneEntryComponent } from './tone_list/tone_entry/tone-entry.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        TimeElapsedPipe,
        TimeUnitPipe,
        ToneListComponent,
        ToneEntryComponent
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
