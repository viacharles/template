import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickRipple]',
})
export class ClickRippleDirective {
  @Input('appClickRipple') enable = true;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (this.enable) {
      const ripple = this.renderer.createElement('span');
      this.renderer.setStyle(this.el.nativeElement , 'position', `relative`);
      this.renderer.setStyle(this.el.nativeElement , 'overflow', `hidden`);
      this.renderer.setStyle(ripple, 'backgroundColor', `rgba(250, 250, 250, 0.5)`);
      this.renderer.setStyle(ripple, 'border-radius', '0 50% 50% 0');
      this.renderer.setStyle(ripple, 'position', `absolute`);
      this.renderer.setStyle(ripple, 'width', `0`);
      this.renderer.setStyle(ripple, 'height', `0`);
      this.renderer.setStyle(ripple, 'left', `0`);
      this.renderer.setStyle(ripple, 'top', `-50%`);
      this.renderer.setStyle(ripple, 'transition', `0.7s ease`);

      this.renderer.appendChild(this.el.nativeElement, ripple);

      const rect = this.el.nativeElement.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      this.renderer.setStyle(ripple, 'width', `${size*1.5}px`);
      this.renderer.setStyle(ripple, 'height', `${size}px`);

      setTimeout(() => {
        this.renderer.removeChild(this.el.nativeElement, ripple);
      }, 600);
    };
  }
  }



