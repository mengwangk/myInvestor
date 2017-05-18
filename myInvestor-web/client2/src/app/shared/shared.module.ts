import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from "ag-grid-angular/main";
import { DateComponent } from "./date-component";
import { HeaderComponent } from "./header-component";
import { HeaderGroupComponent } from "./header-group-component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents(
      [
        DateComponent,
        HeaderComponent,
        HeaderGroupComponent
      ]
    ),
  ],
  declarations: [
    DateComponent,
    HeaderComponent,
    HeaderGroupComponent
  ],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateComponent,
    HeaderComponent,
    HeaderGroupComponent
  ]
})
export class SharedModule { }
