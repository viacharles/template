import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormPageComponent } from './form-page/form-page.component';
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



@NgModule({
  declarations: [
    FormPageComponent,
    SelectPageComponent,
    InputPageComponent,
    CalendarPageComponent,
    ButtonPageComponent,
    FilePageComponent,
    PresentationSectionComponent,
    NormalSelectPresentationSectionComponent
  ],
  imports: [
    CommonModule,
    FormRoutingModule,
    TranslateModule,
    SharedModule,
    ShareFormModule,
    ReactiveFormsModule,
  ],
  providers: [
    DatePipe
  ]
})
export class FormElementsModule { }
