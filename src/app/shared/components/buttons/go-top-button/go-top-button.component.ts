import { Component, ElementRef, Renderer2 } from '@angular/core';
import { WindowService } from '@shared/service/window.service';
import { Base } from '@utilities/base/base';

@Component({
  selector: 'app-go-top-button',
  templateUrl: './go-top-button.component.html',
  styleUrls: ['./go-top-button.component.scss'],
})
export class GoTopButtonComponent extends Base {
  constructor(
    private readonly selfElem: ElementRef,
    private renderer: Renderer2,
    private readonly $window: WindowService
  ) { super(); }

  private isShow = false;

  protected override onInitBase(): void {
    this.$window.mainScroll$.subscribe(scroll => {
      if (scroll && (scroll.target as HTMLElement)?.scrollTop > 10 && this.isShow === false) {
        this.renderer.setStyle(this.selfElem.nativeElement, 'display', 'block');
        this.isShow = true;
      } else if (scroll && (scroll.target as HTMLElement)?.scrollTop <= 10 && this.isShow === true) {
        this.renderer.setStyle(this.selfElem.nativeElement, 'display', 'none');
        this.isShow = false;
      }
    });
  }

  public click(button: HTMLButtonElement): void {
    this.renderer.addClass(button, 'clicked');
    setTimeout(() => {
      this.renderer.removeClass(button, 'clicked');
    }, 300);
  }
}
