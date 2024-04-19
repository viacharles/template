import {NgModule} from '@angular/core';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { GoTopButtonComponent } from './go-top-button/go-top-button.component';
import { BorderLessButtonComponent } from './borderless-button/borderless-button.component';
import { CommonModule } from '@angular/common';
import { BorderButtonComponent } from './borderless-button copy/border-button.component';

@NgModule({
  declarations: [
    GoTopButtonComponent,
    IconButtonComponent,
    BorderLessButtonComponent,
    BorderButtonComponent
  ],
  exports: [
    GoTopButtonComponent,
    IconButtonComponent,
    BorderLessButtonComponent,
    BorderButtonComponent
  ],
  imports: [
    CommonModule
  ],
})
export class ButtonsModule {}
