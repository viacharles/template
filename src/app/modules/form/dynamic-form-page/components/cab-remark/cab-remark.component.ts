import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {ECabAnswerStatus} from '../../shared/enum/cab.enum';
import {
  ECabFormProcess,
  EContent,
  EFieldStatus,
  ELang,
  ELoadingStatus,
} from '@utilities/enum/common.enum';
import {ICabRemark} from '@utilities/interface/api/cab-api.interface';
import {TranslateService} from '@ngx-translate/core';
import {CabService} from '@core/services/cab-api.service';
import {OverlayService} from '@shared/service/overlay.service';

@Component({
  selector: 'app-cab-remark',
  templateUrl: './cab-remark.component.html',
  styleUrls: ['./cab-remark.component.scss'],
  providers: [getFormProvider(CabRemarkComponent)],
})
export class CabRemarkComponent extends CustomForm implements OnChanges {
  @Output() valueChange = new EventEmitter();
  @Input() fieldStatus?: EFieldStatus;
  @Input() progressStatus?: ECabFormProcess;
  @Input() answerStatus?: ECabAnswerStatus;
  @Input() submitBody?: any;
  @Input() questionId?: string;

  constructor(
    private $cab: CabService,
    private $translate: TranslateService,
    private $overlay: OverlayService
  ) {
    super();
  }

  public content = '';
  public preReServeRemark?: ICabRemark;
  /** 重新編輯模式 */
  public isReEditMode = false;

  get isInputting() {
    return !!this.model.length && this.model.length - 1 >= 0
      ? +this.model[this.model.length - 1].fieldStatus ===
          EFieldStatus.Inputting
      : false;
  }

  get progress() {
    return ECabFormProcess;
  }
  get fieldStatusType() {
    return EFieldStatus;
  }
  get loadingStatus() {
    return ELoadingStatus;
  }
  get answerStatusType() {
    return ECabAnswerStatus;
  }

  ngOnChanges(): void {
    if (this.model && !!this.model.length) {
      this.content = this.model[this.model.length - 1].content;
    }
  }

  protected override onModelChanged({
    value,
  }: {
    value: any;
    isFirstChange: boolean;
  }): void {
    if (value) {
      const records = value.filter((item: ICabRemark) => item.content);
      this.content =
        +this.progressStatus! > ECabFormProcess.SubmitForReview
          ? ''
          : records.length
            ? records[0].content
            : '';
    }
  }

  public isAlreadyHasRemark(remark: ICabRemark) {
    return !remark
      ? false
      : remark.type &&
          ((+remark.type === ECabAnswerStatus.Draft &&
            +this.progressStatus! === ECabFormProcess.Draft) ||
            (+remark.type === ECabAnswerStatus.RequiredForApprove &&
              +this.progressStatus! === ECabFormProcess.RequiredForApprove));
  }

  public toggleInput(): void {
    this.model[this.model.length - 1].fieldStatus =
      this.model[this.model.length - 1].fieldStatus === EFieldStatus.Inputting
        ? EFieldStatus.Complete
        : EFieldStatus.Inputting;
  }

  public getEditorInfo(remark: ICabRemark): string {
    return `${remark?.editDate ?? ''} ${
      (this.$translate.currentLang === ELang.Cn
        ? remark?.departmentCn
        : remark?.departmentEn) ?? ''
    } ${
      (this.$translate.currentLang === ELang.Cn
        ? remark?.sectionCn
        : remark.sectionEn) ?? ''
    } ${remark?.name ?? ''}`;
  }

  public isOnProgressAnswer(type: ECabAnswerStatus) {
    return +this.progressStatus! === ECabFormProcess.Draft
      ? +type === ECabAnswerStatus.Draft
      : +type === ECabAnswerStatus.RequiredForApprove;
  }

  public change(content: string): void {
    let latest = this.model[this.model.length - 1];
    if (
      this.answerStatus !== undefined &&
      +latest.type === +this.answerStatus
    ) {
      this.model[this.model.length - 1] = {
        content,
        type: `${this.answerStatus}`,
        loadStatus: ELoadingStatus.Loading,
        fieldStatus: EFieldStatus.Inputting,
      };
    } else {
      this.model[this.model.length] = {
        content,
        type: `${this.answerStatus}`,
        loadStatus: ELoadingStatus.Loading,
        fieldStatus: EFieldStatus.Inputting,
      };
    }
    this.notifyValueChange(this.model);
  }

  public openSupplementRemark() {
    this.fieldStatus = EFieldStatus.Inputting;
    this.model.push({
      content: '',
      type: `${this.answerStatus}`,
      fieldStatus: EFieldStatus.Inputting,
    });
  }

  public cancel() {
    this.content = '';
    this.fieldStatus = EFieldStatus.Complete;
    if (!this.isReEditMode) {
      this.model.pop();
      this.notifyValueChange(this.model);
    } else {
      this.model[this.model.length - 1] = this.preReServeRemark;
    }
  }

  public submit() {
    this.$cab.putApplicationForm(this.submitBody).subscribe({
      next: res => {
        this.$overlay.addToast(EContent.Success, {
          title: 'common.post-success',
        });
        this.fieldStatus = EFieldStatus.Complete;
        const remarkRes = res.answers[this.questionId as string].remark?.filter(
          remark => remark.content
        );
        if (remarkRes) {
          this.model[this.model.length - 1] = remarkRes[remarkRes.length - 1];
        }
      },
      error: err => {
        this.handleSubmitError(err);
        this.model[this.model.length - 1] = this.preReServeRemark;
      },
    });
  }

  private handleSubmitError(err: any) {
    if (err.error.message) {
      this.$overlay.addToast(EContent.Error, {title: err.error.message});
    } else {
      this.$overlay.addToast(EContent.Error, {title: 'common.update-fail'});
    }
  }

  /** 重新編輯 */
  public reEdit() {
    this.isReEditMode = true;
    this.fieldStatus = EFieldStatus.Inputting;
    this.preReServeRemark = this.model[this.model.length - 1];
    this.content = this.model[this.model.length - 1].content;
    this.model[this.model.length - 1].fieldStatus = EFieldStatus.Inputting;
  }
}
