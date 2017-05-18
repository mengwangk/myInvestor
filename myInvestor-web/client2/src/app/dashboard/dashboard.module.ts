import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './dashboard.route';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared';
import { MaterialModule } from '@angular/material';

import { AgGridModule } from "ag-grid-angular/main";
import { DateComponent } from "../shared/date-component";
import { HeaderComponent } from "../shared/header-component";
import { HeaderGroupComponent } from "../shared/header-group-component";


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DashboardComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        RouterModule.forChild(routes),
        AgGridModule.withComponents(
            [
                DateComponent,
                HeaderComponent,
                HeaderGroupComponent
            ]
        )
    ],
})
export class DashboardModule {
    public static routes = routes;
}
