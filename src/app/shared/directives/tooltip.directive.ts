import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements AfterViewInit, OnChanges {
  @Input('appTooltip') tooltipText = '';
  @Input() innerHtml?: string;
  @Input() disableWrap = false;
  /** 關閉tooltip內容互動 */
  @Input() disableContentHover = false;
  private toolTipElement?: HTMLElement;

  constructor(
    private self: ElementRef,
    private renderer: Renderer2,
    private $translate: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.renderer.addClass(this.self.nativeElement, 'tooltip__target');
    this.toolTipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.toolTipElement, 'tooltip__overlay');
    if (this.disableContentHover) {
      this.renderer.addClass(this.toolTipElement, 'disableHover');
    }
    if (this.disableWrap) {
      this.renderer.setStyle(this.toolTipElement, 'text-wrap', 'nowrap');
    }
    this.renderer.appendChild(this.self.nativeElement, this.toolTipElement);
    this.toolTipElement!.innerHTML =
      this.innerHtml ?? this.getInnerHTML(this.tooltipText);
  }

  ngOnChanges(): void {
    if (
      (this.tooltipText && this.toolTipElement) ||
      (this.innerHtml && this.toolTipElement)
    ) {
      this.toolTipElement.innerHTML =
        this.innerHtml ??
        this.getInnerHTML(this.$translate.instant(this.tooltipText));
    }
  }

  private getInnerHTML(text: string): string {
    return text.replace(/\n/g, '<br>').replace(
      /(https?):\/\/[^\s/$.?#].[^\s]*/gi,
      `<a href="$&" target="
    _blank">$&</a>`
    );
  }
}
