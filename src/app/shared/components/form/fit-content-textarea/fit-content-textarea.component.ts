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
import { IDynamicFieldValue } from '@utilities/interface/api/cab-api.interface';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-fit-content-textarea',
  templateUrl: './fit-content-textarea.component.html',
  styleUrls: ['./fit-content-textarea.component.scss'],
  providers: [getFormProvider(FitContentTextareaComponent)],
})
export class FitContentTextareaComponent
  extends CustomForm<[IDynamicFieldValue] | string>
  implements OnChanges, AfterViewInit {
  @ViewChild('tTextArea') tTextArea?: ElementRef<HTMLTextAreaElement>;
  @Input() placeholder = 'common.question-basic-content-placeholder';
  @Input() errorMessage?: string
  @Input() minHeight = '';
  @Input() maxHeight = '';
  @Input() show?: boolean;
  @Input() clear?: boolean;
  @Input() override disabled = false;
  @Input() isError = false;
  /** 是 Dynamic 系統模式： IDynamicFieldValue */
  @Input() isDynamic = false;

  constructor(
    private selfElem: ElementRef,
    private renderer: Renderer2
  ) {
    super();
  }

  public preReserveHeight?: number;

  ngOnChanges({ show, clear }: SimpleChanges): void {
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
      timer(1000).pipe(take(1)).subscribe(() => this.setHeightByShow('ngAfterViewInit'));
    };
  }

  public resize(fieldElem: HTMLElement): void {
    this.renderer.setStyle(this.selfElem.nativeElement, 'height', 'auto');
    this.renderer.setStyle(
      this.selfElem.nativeElement,
      'height',
      fieldElem.scrollHeight + 'px'
    );
    this.preReserveHeight = fieldElem.scrollHeight;
    const inputValue = (fieldElem as HTMLInputElement).value;
    this.notifyValueChange(this.isDynamic ? [{ value: inputValue, memo: '' }] : inputValue);
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
