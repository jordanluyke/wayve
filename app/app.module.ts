import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TimeElapsedPipe, TimeUnitPipe } from './pipes/index';
import { ToneListComponent } from './tone_list/tone-list.component';
import { ToneEntryComponent } from './tone_list/tone_entry/tone-entry.component';
import { routing } from './app.routing';
import { RouterModule } from '@angular/router';
import { AppBus } from './app_bus/app-bus';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        routing
    ],
    declarations: [
        AppComponent,
        TimeElapsedPipe,
        TimeUnitPipe,
        ToneListComponent,
        ToneEntryComponent,
    ],
    providers: [
        AppBus
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
