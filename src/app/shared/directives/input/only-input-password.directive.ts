import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appOnlyInputPassword]',
})
export class OnlyInputPasswordDirective {
  constructor() {}

  @HostListener('input', ['$event']) input(event: Event) {
    const Input = event.target as HTMLInputElement;
    Input.value = Input.value.replace(/[\u4E00-\u9FA5]/g, '');
  }
}
