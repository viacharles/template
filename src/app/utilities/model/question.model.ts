import {AbstractControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {IQuestion} from '@utilities/interface/api/project-api.interface';
import {
  QuestionIdMap,
  QuestionMap,
  QuestionSectionMap,
} from '@utilities/map/question.map';
import {
  EQuestionGroupId,
  EQuestionSectionId,
} from '@utilities/enum/question.enum';

export class Question {
  public source?: IQuestion;
  /** 獲得 編輯時的formly題目 */
  public formlyEdit?: {fieldGroup: IFormlyQuestion[]};
  public questionTemplateId?: string;
  constructor(
    question: IQuestion,
    public $translate?: TranslateService
  ) {
    this.source = question;
    this.questionTemplateId = question.questionTemplateId;
    if ($translate) {
      this.formlyEdit = this.getFormlyQuestion(question, $translate);
    }
    if (QuestionMap) {
      this.setQuestionMap(question);
    }
    if (QuestionIdMap) {
      this.setQuestionIdMap(question);
    }
    if (QuestionSectionMap) {
      this.setQuestionSectionMap(question);
    }
  }

  /** 獲得 新增時的formly題目 */
  public getFormlyAdd(): {fieldGroup: IFormlyQuestion[]} {
    const question = this.formlyEdit as {fieldGroup: IFormlyQuestion[]};
    this.handleAllFields(question.fieldGroup, this.disableField, false);
    return question;
  }

  /** 獲得 檢視時的formly題目 */
  public getFormlyView(): {fieldGroup: IFormlyQuestion[]} {
    const question = this.formlyEdit as {fieldGroup: IFormlyQuestion[]};
    this.handleAllFields(question.fieldGroup, this.disableField, true);
    return question;
  }

  /** 組合出QuestionSectionMap */
  public setQuestionSectionMap(question: IQuestion): void {
    const fields: any = {};
    question.groups.forEach(group => {
      Object.entries(group.questions).forEach(([key, field]) => {
        fields[key] = field;
      });
      QuestionSectionMap.set(group.sectionId as EQuestionSectionId, {
        ...QuestionSectionMap.get(group.sectionId as EQuestionSectionId),
        ...fields,
      });
    });
  }

  /** 組合出QuestionIdMap */
  public setQuestionIdMap(question: IQuestion): void {
    question.groups.forEach(group => {
      Object.entries(group.questions).forEach(([fieldKey, field]) => {
        QuestionIdMap.set(fieldKey, {
          sectionId: group.sectionId as EQuestionSectionId,
          groupId: group.groupId as EQuestionGroupId,
        });
      });
    });
  }

  /** 組合出QuestionMap */
  public setQuestionMap(question: IQuestion): void {
    question.groups.forEach(group => {
      Object.entries(group.questions).forEach(([key, question]) =>
        QuestionMap.set(key, question)
      );
    });
  }

  private getFormlyQuestion(
    question: IQuestion,
    translate: TranslateService
  ): {fieldGroup: IFormlyQuestion[]; type: string} {
    const IsEnglish = translate.currentLang === 'en';
    const FormlyQuestion: any = {
      fieldGroup: question.groups
        .sort((a, b) => a.groupOrder - b.groupOrder)
        .map(group => {
          return {
            templateOptions: {label: group.groupName},
            fieldGroup: Object.getOwnPropertyNames(group.questions)
              .map(key => {
                const Question = group.questions[key];
                return {
                  questionOrder: Question.questionOrder,
                  type: Question.type,
                  key: key,
                  className: Question.className,
                  templateOptions: {
                    label: IsEnglish
                      ? Question.longTitleEN
                      : Question.longTitleCN,
                    required: Question.required,
                    disabled: !!Question.disabled,
                    placeholder: Question.placeholder,
                    validators: null,
                    desc: Question.desc,
                    hideExpression: this.getHideExpression(
                      Question.hideExpression
                    ),
                    options: Question.options?.map(({label, value, desc}) => ({
                      label,
                      value,
                      desc,
                    })),
                  },
                };
              })
              .sort((a, b) => a.questionOrder - b.questionOrder),
          };
        }),
      type: 'tabstepper',
    };
    this.handleAllFields(
      FormlyQuestion.fieldGroup,
      this.handleFieldsAttr,
      true,
      translate
    );
    return FormlyQuestion;
  }

  private getHideExpression(
    fields: {key: string; value: string | number | null}[]
  ): ((model: any) => boolean) | boolean {
    return model => {
      return !!fields.find(({key, value}) => model[key] === value);
    };
  }

  /** enable/disabled欄位 */
  private disableField(fieldGroup: IFormlyField, isDisabled?: boolean) {
    fieldGroup.templateOptions.disabled = !!isDisabled;
  }

  private handleFieldsAttr(
    fieldGroup: IFormlyField,
    boolean = true,
    translate?: TranslateService
  ) {
    fieldGroup.validators = fieldGroup.validators || {};
    // textarea 限制字數 1000 字
    if (fieldGroup.type === 'textarea') {
      fieldGroup.templateOptions['maxlength'] = 1000;
      fieldGroup.validators['maxlength'] = {
        expression: (c: AbstractControl) => {
          if (!c.value) {
            return true;
          }
          return c.value.length <= 1000;
        },
        message: () => `${translate!.instant('validators.maxLength')}(1000)`,
      };
    }
    // Owner 限定國泰內部 email
    if (fieldGroup.className && fieldGroup.className.includes('cathay-email')) {
      fieldGroup.validators['email'] = {
        expression: (c: AbstractControl) => {
          if (!c.value) {
            return true;
          }
          const EMAIL_REGEXP =
            /^[A-Z0-9._%+-]+@(cathaylife\.com\.vn|cathaylife\.com\.tw|cathaybk\.com\.tw|cathay-ins\.com\.tw|cathayholdings\.com\.tw|cathaysec\.com\.tw)$/i;
          return EMAIL_REGEXP.test(c.value);
        },
        message: () => translate!.instant('validators.cath-email'),
      };
    }
  }

  /** 處理所有欄位
   * @param handle 處理的方法  */
  private handleAllFields(
    questions: IFormlyQuestion[],
    handle: (
      field: any,
      boolean?: boolean,
      translate?: TranslateService
    ) => any,
    boolean?: boolean,
    translate?: TranslateService
  ): any {
    questions.forEach(questionGroup =>
      questionGroup.fieldGroup.forEach(question =>
        handle(question, boolean, translate)
      )
    );
  }
}

/** formly 使用規格的題目(評估表) */
export interface IFormlyQuestion {
  templateOptions: {
    label: string; // ex. "系統一般資訊"
    // key: string,
  };
  fieldGroup: Array<{
    // IFormlyField
    templateOptions: {
      label: string; // ex. "系統編號"
      required: boolean;
      disabled: boolean;
      desc: string;
      hideExpression?: ((model: any) => boolean) | boolean;
      options?: IFormlyOption[];
      multiple?: boolean;
      [attr: string]: any;
    };
    type: string;
    key: string;
    className: string;
    validators?: {[name: string]: any};
  }>;
}

/** formly 單欄 */
export interface IFormlyField {
  templateOptions: {
    label: string; // ex. "系統編號"
    required: boolean;
    disabled: boolean;
    desc: string;
    hideExpression?: ((model: any) => boolean) | boolean;
    options?: IFormlyOption[];
    [attr: string]: any;
  };
  type: string;
  key: string;
  className: string;
  validators?: {[name: string]: any};
}

export interface IFormlyOption {
  label: string;
  value: number;
  desc: string;
}
