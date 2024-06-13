import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DynamicFormPageComponent } from './dynamic-form-page/dynamic-form-page.component';
import { SelectPageComponent } from './select-page/select-page.component';
import { InputPageComponent } from './input-page/input-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { ButtonPageComponent } from './button-page/button-page.component';
import { FilePageComponent } from './file-page/file-page.component';
import { FormRoutingModule } from './form-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { ShareFormModule } from '@shared/components/form/share-form.module';
import { PresentationSectionComponent } from './components/presentation-section/presentation-section.component';
import { NormalSelectPresentationSectionComponent } from './select-page/components/normal-select-presentation-section/normal-select-presentation-section.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormBasicTypeComponent } from './dynamic-form-page/components/form-type/dynamic-form-basic-type/dynamic-form-basic-type.component';
import { DynamicFormGroupTypeComponent } from './dynamic-form-page/components/form-type/dynamic-form-group-type/dynamic-form-group-type.component';
import { DirectiveModule } from '@shared/directives/directive.module';
import { OverlayModule } from '@shared/components/overlay/overlay.module';
import { DynamicFieldEditDialogComponent } from './dynamic-form-page/shared/components/dynamic-field-edit-dialog/dynamic-field-edit-dialog.component';
import { DynamicFormValidatorsService } from '@core/dynamic-form-validators.service';
import { ButtonsModule } from '@shared/components/buttons/buttons.module';
import { TextDividerComponent } from './dynamic-form-page/components/form-type/dynamic-form-basic-type/components/text-divider/text-divider.component';
import { BasicTypeQuestionCardComponent } from './dynamic-form-page/components/form-type/dynamic-form-basic-type/components/basic-type-question-card/basic-type-question-card.component';



@NgModule({
  declarations: [
    DynamicFormPageComponent,
    SelectPageComponent,
    InputPageComponent,
    CalendarPageComponent,
    ButtonPageComponent,
    FilePageComponent,
    PresentationSectionComponent,
    NormalSelectPresentationSectionComponent,
    DynamicFormBasicTypeComponent,
    DynamicFormGroupTypeComponent,
    DynamicFieldEditDialogComponent,
    BasicTypeQuestionCardComponent
  ],
  imports: [
    CommonModule,
    FormRoutingModule,
    TranslateModule,
    SharedModule,
    ShareFormModule,
    ReactiveFormsModule,
    DirectiveModule,
    OverlayModule,
    ButtonsModule,
    TextDividerComponent,
  ],
  providers: [
    DatePipe,
    DynamicFormValidatorsService
  ]
})
export class FormElementsModule { }
