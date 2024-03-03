import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableIconDropdownComponent} from './icon-dropdown/icon-dropdown.component';
import {DataTableComponent} from './data-table.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTableDatePickerComponent} from './datatable-date-picker/datatable-date-picker.component';
import {DataTableCalendarComponent} from './datatable-calendar/datatable-calendar.component';
import { DataTablePaginationComponent } from './datatable-pagination/datatable-pagination.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TableIconDropdownComponent,
    DataTableComponent,
    DataTableDatePickerComponent,
    DataTableCalendarComponent,
    DataTablePaginationComponent,
    DataTableComponent
  ],
  exports: [
    TableIconDropdownComponent,
    DataTableComponent,
    DataTableDatePickerComponent,
    DataTableComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
})
export class DataTableModule {
}
