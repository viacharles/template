import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';

@Component({
  selector: 'app-fit-content-textarea',
  templateUrl: './fit-content-textarea.component.html',
  styleUrls: ['./fit-content-textarea.component.scss'],
  providers: [getFormProvider(FitContentTextareaComponent)],
})
export class FitContentTextareaComponent
  extends CustomForm<string>
  implements OnChanges, AfterViewInit
{
  @ViewChild('tTextArea') tTextArea?: ElementRef<HTMLTextAreaElement>;
  @Input() placeholder = 'common.question-basic-content-placeholder';
  @Input() minHeight = '';
  @Input() show?: boolean;
  @Input() clear?: boolean;

  constructor(
    private selfElem: ElementRef,
    private renderer: Renderer2
  ) {
    super();
  }

  public override model = '';
  public override disabled = false;
  public preReserveHeight?: number;

  ngOnChanges({show, clear}: SimpleChanges): void {
    if (show) {
      this.setHeightByShow('ngOnChanges');
    }
    if (clear) {
      this.model = '';
      this.setHeightByShow('ngOnChanges');
    }
  }

  ngAfterViewInit(): void {
    if (this.show) {
      setTimeout(() => this.setHeightByShow('ngAfterViewInit'));
    }
  }

  public resize(fieldElem: HTMLElement): void {
    this.renderer.setStyle(this.selfElem.nativeElement, 'height', 'auto');
    this.renderer.setStyle(
      this.selfElem.nativeElement,
      'height',
      fieldElem.scrollHeight + 'px'
    );
    this.preReserveHeight = fieldElem.scrollHeight;
    this.notifyValueChange();
  }

  private setHeightByShow(s: string) {
    if (this.show) {
      this.renderer.setStyle(this.selfElem.nativeElement, 'height', 'auto');
      this.renderer.setStyle(
        this.selfElem.nativeElement,
        'height',
        this.tTextArea?.nativeElement.scrollHeight + 'px'
      );
    } else {
      this.renderer.setStyle(this.selfElem.nativeElement, 'height', '0');
    }
  }
}
