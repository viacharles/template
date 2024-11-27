import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { OnlyInputPasswordDirective } from './input/only-input-password.directive';
import { PassiveTooltipDirective } from './passive-tooltip.directive';
import { ClickRippleDirective } from './click-ripple.directive';

@NgModule({
  declarations: [
    TooltipDirective,
    PassiveTooltipDirective,
    OnlyInputPasswordDirective,
    ClickRippleDirective
  ],
  exports: [
    TooltipDirective,
    PassiveTooltipDirective,
    OnlyInputPasswordDirective,
    ClickRippleDirective
  ],
  imports: [CommonModule],
})
export class DirectiveModule {}
