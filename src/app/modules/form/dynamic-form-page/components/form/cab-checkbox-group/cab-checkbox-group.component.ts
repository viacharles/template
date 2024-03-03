import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {ECabFormProcess} from '@utilities/enum/common.enum';
import { EFieldType } from '@utilities/enum/form.enum';
import {ICabQuestionOption} from '@utilities/interface/api/cab-api.interface';

@Component({
  selector: 'app-cab-checkbox-group',
  templateUrl: './cab-checkbox-group.component.html',
  styleUrls: ['./cab-checkbox-group.component.scss'],
  providers: [getFormProvider(CabCheckboxGroupComponent)],
})
export class CabCheckboxGroupComponent extends CustomForm implements OnChanges {
  @Input() progressStatus?: ECabFormProcess;
  @Input() optionLines?: ICabQuestionOption[][] | null;
  @Input() isMulti = true;
  @Input() id = '';
  @Input() memo = '';
  @Input() maxOptionInLine = 3;
  @Output() memoChange = new EventEmitter<string>();

  constructor() {
    super();
  }

  public optionLinesView?: (ICabQuestionOption | null)[][] | null;

  get isEditRequiredTemp() {
    return +this.progressStatus! === this.progress.RequiredForApprove;
  }

  get fieldTyp() {
    return EFieldType;
  }
  get progress() {
    return ECabFormProcess;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init(changes);
  }

  public onMemoChange(event: Event): void {
    this.memoChange.emit((event.target as HTMLInputElement).value);
  }

  public isChecked(value: string): boolean {
    if (this.isMulti) {
      return (this.model as string[]).some(exist => `${exist}` === `${value}`);
    } else {
      return `${this.model as string}` === `${value}`;
    }
  }

  public isOtherFieldChecked(options: (ICabQuestionOption | null)[]): boolean {
    const otherFieldValue = options.find(option => option?.memo)?.value;
    return otherFieldValue
      ? this.isMulti
        ? (this.model as string[]).includes(otherFieldValue)
        : this.model === otherFieldValue
      : false;
  }

  public change(value: string): void {
    if (this.isMulti) {
      if (!this.model!.includes(value)) {
        (this.model as string[])!.push(value);
      } else {
        this.model = (this.model as string[])!.filter(exist => exist !== value);
      }
    } else {
      this.model = value === this.model ? '' : value;
    }
    this.notifyValueChange(this.model);
  }

  private init({optionLines, isMulti, memo}: SimpleChanges): void {
    if (optionLines && optionLines.currentValue.length > 0) {
      this.optionLinesView = optionLines.currentValue.map(
        (options: (ICabQuestionOption | null)[]) => {
          if (options && options.length < 3) {
            options.push(null);
          }
          return options;
        }
      );
    }
  }
}
