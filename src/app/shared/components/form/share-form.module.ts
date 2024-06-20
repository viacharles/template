import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './search-input/search-input.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { SelectComponent } from './select/select.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FitContentTextareaComponent } from './fit-content-textarea/fit-content-textarea.component';
import { RadioComponent } from './radio/radio.component';
import { MappingInputComponent } from './input/mapping-input/mapping-input.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { ToggleComponent } from './toggle/toggle.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { DirectiveModule } from '@shared/directives/directive.module';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CheckboxSetComponent } from './checkbox-set/checkbox-set.component';
import { SharedModule } from '@shared/shared.module';
import { InputComponent } from './input/input/input.component';
import { DynamicInputListComponent } from './input/dynamic-input-list/dynamic-input-list.component';
import { RadioSetComponent } from './radio-set/radio-set.component';

@NgModule({
  declarations: [
    SearchInputComponent,
    CheckboxGroupComponent,
    SelectComponent,
    FitContentTextareaComponent,
    RadioComponent,
    MappingInputComponent,
    DatePickerComponent,
    CalendarComponent,
    ToggleComponent,
    MultiSelectComponent,
    CheckboxComponent,
    CheckboxSetComponent,
    InputComponent,
    DynamicInputListComponent,
    RadioSetComponent,
  ],
  exports: [
    SearchInputComponent,
    CheckboxGroupComponent,
    SelectComponent,
    FitContentTextareaComponent,
    RadioComponent,
    MappingInputComponent,
    DatePickerComponent,
    CalendarComponent,
    ToggleComponent,
    MultiSelectComponent,
    CheckboxComponent,
    CheckboxSetComponent,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    DynamicInputListComponent,
    RadioSetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DirectiveModule,
    SharedModule,
  ],
})
export class ShareFormModule {}
