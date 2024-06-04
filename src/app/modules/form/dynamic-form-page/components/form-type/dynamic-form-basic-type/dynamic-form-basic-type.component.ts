import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ICabFormPage,
  ICabQuestionView,
  ICabReviewFormOptionView,
} from '../../../shared/interface/dynamic-form.interface';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { downFadeInAndCompressOut, fadeEnterAndHideOut, slideEnter, verticalShortenOut } from '@utilities/helper/animations.helper';
import { Base } from '@utilities/base/base';
import { OverlayService } from '@shared/service/overlay.service';
import { DynamicFieldEditDialogComponent } from '../../../shared/components/dynamic-field-edit-dialog/dynamic-field-edit-dialog.component';
import { EErrorMessage, EFieldType } from '@utilities/enum/form.enum';
import { IEditDynamicForm } from '../../../shared/interface/dynamic-form-form.interface';
import { DynamicForm } from '../../../shared/model/dynamic-form.model';
import { IDynamicFieldValue, IDynamicFromValidator } from '@utilities/interface/api/cab-api.interface';
import { IDynamicOption } from '@utilities/interface/form.interface';
import { take, timer } from 'rxjs';
import { WarnDialogComponent } from '@shared/components/overlay/warn-dialog/warn-dialog.component';

@Component({
  selector: 'app-dynamic-form-basic-type',
  templateUrl: './dynamic-form-basic-type.component.html',
  styleUrls: ['./dynamic-form-basic-type.component.scss'],
  animations: [fadeEnterAndHideOut(), verticalShortenOut(), downFadeInAndCompressOut(), slideEnter()],
})
export class DynamicFormBasicTypeComponent extends Base {
  @Input() model?: DynamicForm;
  @Input() pageIndex?: number;
  @Input() page?: ICabFormPage;
  @Input() form?: FormGroup;
  /** 是否有按下[完成] */
  @Input() isCompleteClicked = false;
  @Output() valueChange = new EventEmitter<FormGroup>();

  constructor(
    private $overlay: OverlayService,
    private cdr: ChangeDetectorRef
  ) { super() }

  public basicPage?: any;
  get fieldType() { return EFieldType };

  protected override onInitBase(): void {
    console.log('aa--onInit', this.page, this.form);
  }

  public isRequired(question: ICabQuestionView) {
    return question.SubQuestionGroup.some(answer => answer.required);
  }
  public hasMemo(SubQuestion: any) {
    return SubQuestion.options.some(
      (optionGroup: ICabReviewFormOptionView[]) => {
        return optionGroup.some(options => options.hasMemo);
      }
    );
  }

  /** 編輯題目 */
  public editSubQuestion(SubQuestion: ICabQuestionView, groupIndex: number, questionIndex: number): void {
    this.$overlay.addDialog(
      DynamicFieldEditDialogComponent,
      SubQuestion,
      {
        callback: {
          confirm: (update: IEditDynamicForm) => {
            this.page!.groups[groupIndex]!.questions[questionIndex].show = false;
            const firstGroup = (this.form?.controls['answers'] as FormArray).controls[0] as FormGroup;
            const question = ((firstGroup.controls[SubQuestion.questionId] as FormGroup).controls['answers'] as FormGroup).controls['A'];
            const isMulti = update.fieldType === EFieldType.MultiSelect || update.fieldType === EFieldType.Checkbox;
            // 設定 validators
            const validationView = this.getDynamicFromValidator(update.validation as any, !!update.required);
            if (update.validation) {
              const validators = this.model ?
              this.model.getValidations(validationView ?? [], isMulti, !!update.required) : null;
            question.setValidators(validators);
            if (!question.value.length) {
              question.setValue([{ value: '', memo: '' }])
            };
            };
            // 替換資料
            this.page!.groups[groupIndex]!.questions[questionIndex]! = {
              ...SubQuestion,
              SubQuestionGroup: [{
                ...SubQuestion.SubQuestionGroup[0],
                required: !!update.required,
                placeholder: update.placeholder ?? null,
                type: update.fieldType,
                validation: update.validation as IDynamicFromValidator[] | undefined,
                validationView: validationView,
                options: update.options?.map((v, index) => ({ label: v.name, hasMemo: v.hasMemo, value: `${index + 1}`, code: `${index + 1}`, name: v.name })) ?? null,
                optionsForNormal: update.options?.map((option, index) => ({ code: `${index + 1}`, name: option.name, hasMemo: option.hasMemo })) as IDynamicOption<string>[],
              }],
              description: update.des ?? null,
              form: (firstGroup.controls[SubQuestion.questionId] as FormGroup),
              title: update.title
            };
            timer(700).pipe(take(1)).subscribe(() => this.page!.groups[groupIndex]!.questions[questionIndex].show = true);
          }
        }
      }
    )
  }

  private getDynamicFromValidator(validations: IDynamicFieldValue[], require: boolean): IDynamicFromValidator[] {
    const validation = validations.map(validation => ({
      type: validation.value as EErrorMessage,
      ...( !!validation.memo ? {value: [+validation.memo as number]} : {})
    }));
    console.log('aa-getDynamicFromValidator', [...validation, ...(require ? [{ type: EErrorMessage.REQUIRED }] : [])], validation, )
    return [...validation, ...(require ? [{ type: EErrorMessage.REQUIRED }] : [])];
  }

  /** 刪除題目 */
  public deleteSubQuestion(groupIndex: number, questionIndex: number): void {
    this.$overlay.addDialog(
      WarnDialogComponent,
      {
        title: 'custom-form.question-delete-warn',
        buttons: {
          confirm: {
            bgColor: 'warn-color',
            text: 'common.delete',
          },
          cancel: {}
        }
      },
      {
        callback: {
          confirm: () => {
            const questions = this.page?.groups[groupIndex].questions.filter((q, index) => index !== questionIndex);
            this.page!.groups[groupIndex].questions = questions ?? [];
          },
          cancel: () => {},
        },
      }
    )

  }

  public trim(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }
}
