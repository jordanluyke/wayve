import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToneListComponent } from './tone_list/tone-list.component';

const routes: Routes = [
    {
        path: '',
        component: ToneListComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
