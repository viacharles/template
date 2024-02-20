import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipDirective} from './tooltip.directive';
import {OnlyInputPasswordDirective} from './input/only-input-password.directive';
import {PassiveTooltipDirective} from './passive-tooltip.directive';

@NgModule({
  declarations: [
    TooltipDirective,
    PassiveTooltipDirective,
    OnlyInputPasswordDirective,
  ],
  exports: [
    TooltipDirective,
    PassiveTooltipDirective,
    OnlyInputPasswordDirective,
  ],
  imports: [CommonModule],
})
export class DirectiveModule {}
