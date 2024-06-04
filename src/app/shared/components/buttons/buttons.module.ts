import {NgModule} from '@angular/core';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { GoTopButtonComponent } from './go-top-button/go-top-button.component';
import { BorderLessButtonComponent } from './borderless-button/borderless-button.component';
import { CommonModule } from '@angular/common';
import { BorderButtonComponent } from './borderless-button copy/border-button.component';
import { ButtonComponent } from './button/button.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GoTopButtonComponent,
    IconButtonComponent,
    BorderLessButtonComponent,
    BorderButtonComponent,
    ButtonComponent
  ],
  exports: [
    GoTopButtonComponent,
    IconButtonComponent,
    BorderLessButtonComponent,
    BorderButtonComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
})
export class ButtonsModule {}
