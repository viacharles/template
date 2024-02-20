import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Directive({
  selector: '[appPassiveTooltip]',
})
export class PassiveTooltipDirective implements AfterViewInit, OnChanges {
  @Input('appPassiveTooltip') tooltipText = '';
  /** 是否顯示 */
  @Input() show = false;

  private toolTipElement?: HTMLElement;
  private tailElement?: HTMLElement;
  private closeButtonElement?: HTMLElement;

  constructor(
    private self: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private $translate: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.renderer.addClass(this.self.nativeElement, 'passive-tooltip__target');
    this.toolTipElement = this.renderer.createElement('div');
    this.closeButtonElement = this.renderer.createElement(
      'em'
    ) as HTMLDivElement;
    const ContentElement = this.renderer.createElement('div');
    this.tailElement = this.renderer.createElement('span');
    this.renderer.addClass(this.closeButtonElement, 'cancel');
    this.renderer.addClass(this.closeButtonElement, 'icon-cancel');
    this.renderer.addClass(this.toolTipElement, 'passive-tooltip__overlay');
    this.renderer.addClass(this.tailElement, 'passive-tooltip__tail');
    this.renderer.appendChild(this.self.nativeElement, this.toolTipElement);
    this.renderer.appendChild(this.toolTipElement, ContentElement);
    this.renderer.setStyle(
      this.toolTipElement,
      'top',
      `${this.self.nativeElement.clientHeight + 10}px`
    );
    this.renderer.setStyle(
      this.toolTipElement,
      'min-width',
      `${this.self.nativeElement.clientWidth}px`
    );
    this.renderer.setStyle(this.tailElement, 'position', `absolute`);
    this.renderer.setStyle(this.tailElement, 'left', `50%`);
    ContentElement!.innerHTML = this.getInnerHTML(this.tooltipText);
    this.toolTipElement?.addEventListener('click', event =>
      event.stopPropagation()
    );
    if (!this.toolTipElement!.contains(this.tailElement!)) {
      this.addTailAndButton();
    }
    this.closeButtonElement.addEventListener('click', event => {
      event.stopPropagation();
      if (this.toolTipElement) {
        this.renderer.setStyle(this.toolTipElement, 'transition', `0.3s ease`);
        this.renderer.setStyle(
          this.toolTipElement,
          'top',
          `${this.self.nativeElement.clientHeight}px`
        );
        this.renderer.setStyle(this.toolTipElement, 'opacity', '0');
        setTimeout(() => {
          this.renderer.setStyle(this.toolTipElement, 'display', 'none');
        }, 300); // close animation time 0.3s
      }
    });
    this.showOrHide();
  }

  ngOnChanges({show}: SimpleChanges): void {
    if (this.tooltipText && this.toolTipElement && this.tailElement) {
      this.toolTipElement.innerHTML = this.getInnerHTML(
        this.$translate.instant(this.tooltipText)
      );
      if (!this.toolTipElement.contains(this.tailElement)) {
        this.addTailAndButton();
      }
    }
    if (this.toolTipElement) {
      this.showOrHide();
    }
  }

  private addTailAndButton(): void {
    this.renderer.appendChild(this.toolTipElement, this.tailElement);
    this.renderer.appendChild(this.toolTipElement, this.closeButtonElement);
  }

  private getInnerHTML(text: string): string {
    return text.replace(/\n/g, '<br>').replace(
      /(https?):\/\/[^\s/$.?#].[^\s]*/gi,
      `<a href="$&" target="
    _blank">$&</a>`
    );
  }

  private showOrHide(): void {
    this.renderer.setStyle(
      this.toolTipElement,
      'display',
      this.show ? 'flex' : 'none'
    );
  }
}
