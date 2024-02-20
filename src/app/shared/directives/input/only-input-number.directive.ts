import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appOnlyInput1to9]',
})
export class OnlyInput1to9Directive {
  @Input('bitLimit') bitLimit = 2;
  constructor() {}

  @HostListener('input', ['$event']) input(event: Event) {
    const Input = event.target as HTMLInputElement;
    Input.value = Input.value.replace(new RegExp(`[^1-9]{1, ${this.bitLimit}}`), 'g');
  };
}
