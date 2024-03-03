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
import { CabCardComponent } from './dynamic-form-page/components/cab-card/cab-card.component';
import { CabRecordDialogComponent } from './dynamic-form-page/components/cab-record-dialog/cab-record-dialog.component';
import { CabRemarkComponent } from './dynamic-form-page/components/cab-remark/cab-remark.component';
import { CabCheckboxGroupComponent } from './dynamic-form-page/components/form/cab-checkbox-group/cab-checkbox-group.component';
import { DynamicFormBasicTypeComponent } from './dynamic-form-page/components/form-type/dynamic-form-basic-type/dynamic-form-basic-type.component';
import { DynamicFormGroupTypeComponent } from './dynamic-form-page/components/form-type/dynamic-form-group-type/dynamic-form-group-type.component';
import { CabUploadFieldComponent } from './dynamic-form-page/components/cab-card/cards/cab-file-card/componsnts/cab-upload-field/cab-upload-field.component';
import { CabFileCardComponent } from './dynamic-form-page/components/cab-card/cards/cab-file-card/cab-file-card.component';
import { DirectiveModule } from '@shared/directives/directive.module';
import { OverlayModule } from '@shared/components/overlay/overlay.module';
import { DynamicFieldEditDialogComponent } from './dynamic-form-page/shared/components/dynamic-field-edit-dialog/dynamic-field-edit-dialog.component';



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
    CabCardComponent,
    CabRecordDialogComponent,
    CabRemarkComponent,
    CabCheckboxGroupComponent,
    DynamicFormBasicTypeComponent,
    DynamicFormGroupTypeComponent,
    CabUploadFieldComponent,
    CabFileCardComponent,
    DynamicFieldEditDialogComponent
  ],
  imports: [
    CommonModule,
    FormRoutingModule,
    TranslateModule,
    SharedModule,
    ShareFormModule,
    ReactiveFormsModule,
    DirectiveModule,
    OverlayModule
  ],
  providers: [
    DatePipe
  ]
})
export class FormElementsModule { }
