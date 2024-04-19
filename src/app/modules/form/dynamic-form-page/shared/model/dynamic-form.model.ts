import {
  AbstractControl,
  FormControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  ECabFormProcess,
  EFieldStatus,
} from '@utilities/enum/common.enum';
import {
  ICabAnswer,
  ICabApplicationAnswerRes,
  ICabEditor,
  ICabFile,
  ICabQuestionSubQuestion,
  ICabQuestionGroup,
  ICabQuestionHideExpressionView,
  ICabQuestionValue,
  ICabRemark,
  ICabTemplateRes,
  IDynamicFromValidator,
} from '@utilities/interface/api/cab-api.interface';
import { ECab, ECabAnswerStatus } from '../enum/cab.enum';
import {
  cabQuestionFormMap,
} from '../map/cab.map';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ValidatorHelper } from '@core/validators.helper';
import { EErrorMessage, EFieldType } from '@utilities/enum/form.enum';
import { DynamicFormValidatorsService } from '@core/dynamic-form-validators.service';

export class DynamicForm {
  public question_origin?: ICabTemplateRes;
  public project_origin?: ICabApplicationAnswerRes;
  public docId?: string;
  public cabId?: string;
  public cab?: ECab;
  public projectName = '';
  public projectId?: string;
  public status?: ECabFormProcess;
  public creator?: ICabEditor;
  public editor?: ICabEditor;
  public tenantCn?: string;
  public templateId?: string;
  public questionVersion?: string;
  public projectVersion?: string;
  public hideExpressions: ICabQuestionHideExpressionView[][] = [];
  /** 傳 project 和 formBuilder 進來的話會組成 form */
  public form = new UntypedFormGroup({});
  private readonly maxOptionInLine = 3;

  constructor(
    question: ICabTemplateRes,
    public $translate: TranslateService,
    public datePipe: DatePipe,
    private $dynamicValidator: DynamicFormValidatorsService,
    project?: ICabApplicationAnswerRes,
    private fb?: UntypedFormBuilder,
  ) {
    this.docId = question?.docId;
    this.templateId = question.id;
    this.questionVersion = question?.version;
    if (project) {
      this.docId = project.docId;
      this.cab = project.cab;
      this.status = project.status;
      this.creator = project?.creator;
      this.editor = project?.editor;
      this.tenantCn = project?.tenantCn;
      this.cabId = project?.cabId;
      this.projectName = project?.projectName;
      this.projectId = project?.projectId;
      this.projectVersion = project.version;
      this.project_origin = project;
    }

    this.question_origin = question;
    if (this.fb) {
      this.form = this.initialForm(question, project, this.status);
    }
  }

  /** 如果沒傳 project 就不 patch value */
  public initialForm(
    { id: cabId, docId, groups }: ICabTemplateRes,
    project?: ICabApplicationAnswerRes,
    status?: ECabFormProcess
  ): UntypedFormGroup {
    let form = new UntypedFormGroup({});
    if (this.fb) {
      form = this.fb.group({});
      form.patchValue({ cabId, docId });
      form.addControl(
        'answers',
        this.fb.array(groups.map(group => this.getQuestionGroupForm(group)))
      );
      form.addControl(
        'attachment',
        this.fb.array([this.getEmptyFileFormGroup(this.status!)])
      );
      if (status ? +status === ECabFormProcess.RequiredForApprove : false) {
        (
          (form.get('answers') as UntypedFormArray)
            ?.controls[0] as UntypedFormGroup
        ).disable();
      };
      const answers = project?.answers;
      if (answers) {
        this.patchFormValue(form, answers, project.attachment);
      }
    }

    return form;
  }

  public patchFormValue(
    form: UntypedFormGroup,
    answers: ICabAnswer,
    attachment?: ICabFile[]
  ): void {
    Object.keys(answers).forEach(questionId => {
      const { groupId, remark, values: answerList } = answers[questionId];
      const questionGroup = (
        (form.controls['answers'] as UntypedFormArray)
          .controls as UntypedFormGroup[]
      ).find(({ controls }) => controls['id'].value === groupId);
      const question: UntypedFormGroup | undefined = questionGroup?.controls[
        questionId
      ] as UntypedFormGroup;
      if (question) {
        question.get('remark')?.patchValue(
          remark === null
            ? []
            : remark.map(item => ({
              ...item,
              fieldStatus:
                +this.status! === ECabFormProcess.Draft
                  ? EFieldStatus.Inputting
                  : EFieldStatus.Complete,
            }))
        );
        Object.keys(answerList).forEach(answerId => {
          const answer: FormControl | undefined = (
            question.controls['answers'] as UntypedFormGroup
          )?.controls[answerId] as FormControl | undefined;
          if (answer) {
            answer.patchValue(answerList[answerId]);
          };
        });
      }
    });
    if (attachment) {
      const formArray = form.get('attachment') as UntypedFormArray;
      attachment
        .sort((a, b) =>
          new Date(a.uploadDate) < new Date(b.uploadDate) ? 1 : -1
        )
        .forEach((file, index) => {
          if (
            !!formArray.controls[index] &&
            (!formArray.controls[index].get('fileName')?.value ||
              !formArray.controls[index].get('file')?.value)
          ) {
            formArray.controls[index].patchValue({
              ...file,
              fieldStatus: EFieldStatus.Complete,
            });
            formArray.controls[index].get('file')?.setValue(file.file ?? '');
            formArray.controls[index]
              .get('fileName')
              ?.setValue(decodeURI(file.fileName) ?? '');
            formArray.controls[index]
              .get('uploadDate')
              ?.setValue(file.uploadDate ?? '');
          } else if (
            !formArray.controls.some(
              control => file.file === control.get('file')?.value
            )
          ) {
            formArray.controls?.unshift(
              new UntypedFormGroup({
                file: new UntypedFormControl(
                  file.file,
                  +file.type! === ECabAnswerStatus.Draft
                    ? Validators.required
                    : null
                ),
                fileName: new UntypedFormControl(
                  decodeURI(file.fileName),
                  +file.type! === ECabAnswerStatus.Draft
                    ? Validators.required
                    : null
                ),
                url: new UntypedFormControl(''),
                userId: new UntypedFormControl(file.userId),
                department: new UntypedFormControl(file.department),
                departmentCn: new UntypedFormControl(file.departmentCn),
                departmentEn: new UntypedFormControl(file.departmentEn),
                section: new UntypedFormControl(file.section),
                sectionCn: new UntypedFormControl(file.sectionCn),
                sectionEn: new UntypedFormControl(file.sectionEn),
                uploadDate: new UntypedFormControl(file.uploadDate),
                isSizeError: new UntypedFormControl(false),
                isTypeError: new UntypedFormControl(false),
                type: new UntypedFormControl(file.type),
                fieldStatus: new UntypedFormControl(EFieldStatus.Complete),
              })
            );
          }
        });
    }
  }

  /** 將form的value轉換成APi需要的answer格式 */
  public getProjectAnswers(form: UntypedFormGroup): ICabAnswer {
    const raw = form.getRawValue();
    const Answer: ICabAnswer = {};
    raw.answers.forEach((group: any) => {
      const Questions = Object.entries(group).filter(attr => attr[0] !== 'id');
      Questions.forEach((question: [string, any]) => {
        Object.entries(question[1].answers as ICabQuestionValue).forEach(_ => {
          const remarkOrigin = question[1].remark;
          let remarkResult: ICabRemark[] = [];
          if (remarkOrigin !== null && !remarkOrigin.length) {
            Object.values(question[1].remark).forEach(item =>
              remarkResult.push(item as ICabRemark)
            );
            remarkResult = remarkResult.filter(
              (item: ICabRemark) => item.content !== ''
            );
          } else {
            remarkResult = remarkOrigin;
          }
          const remark =
            remarkResult === null || remarkResult.length === 0
              ? null
              : remarkResult;
          Answer[question[0]] = {
            remark: remark,
            values: question[1].answers,
            groupId: group.id,
            sectionId: '',
          };
        });
      });
    });
    return Answer;
  }

  public getEmptyFileFormGroup(status: ECabFormProcess) {
    return new UntypedFormGroup({
      file: new UntypedFormControl(
        '',
        +status === ECabFormProcess.Draft ? Validators.required : null
      ),
      fileName: new UntypedFormControl(
        '',
        +status === ECabFormProcess.Draft ? Validators.required : null
      ),
      url: new UntypedFormControl(''),
      department: new UntypedFormControl(''),
      departmentCn: new UntypedFormControl(''),
      departmentEn: new UntypedFormControl(''),
      section: new UntypedFormControl(''),
      sectionCn: new UntypedFormControl(''),
      sectionEn: new UntypedFormControl(''),
      userId: new UntypedFormControl(''),
      userName: new UntypedFormControl(''),
      email: new UntypedFormControl(''),
      isSizeError: new UntypedFormControl(false),
      isTypeError: new UntypedFormControl(false),
      uploadDate: new UntypedFormControl(''),
      fieldStatus: new UntypedFormControl(EFieldStatus.Inputting),
      type: new UntypedFormControl(''),
    });
  }

  private getQuestionGroupForm({
    id,
    questions,
  }: ICabQuestionGroup): UntypedFormGroup {
    if (this.fb) {
      const group: UntypedFormGroup = this.fb.group({
        id: [id, [Validators.required]],
      });
      Object.keys(questions).forEach(questionId => {
        const { disabled, SubQuestionGroup } = questions[questionId];
        group.addControl(
          questionId,
          this.fb!.group({
            remark: [
              [
                {
                  content: '',
                  fieldStatus:
                    +this.status! === ECabFormProcess.Draft
                      ? EFieldStatus.Inputting
                      : EFieldStatus.Complete,
                },
              ],
            ],
            answers: this.getSubQuestionGroup(SubQuestionGroup),
          }, { validator: ValidatorHelper.allSubQuestionsValid() })
        );
        if (disabled) {
          group.controls[questionId].disable();
        }
      });
      return group;
    }
    return new UntypedFormGroup({});
  }

  /** 得到子答案群組 formGroup */
  private getSubQuestionGroup(answers: { [key: string]: ICabQuestionSubQuestion }): UntypedFormGroup {
    if (this.fb) {
      const group: UntypedFormGroup = this.fb.group({});
      Object.keys(answers).forEach(answerId => {
        const { type, required, disabled } = answers[answerId];
        const isMulti = type === EFieldType.MultiSelect || type === EFieldType.Checkbox;
        group.addControl(
          answerId,
          this.fb!.control([], this.getValidations(answers[answerId], isMulti, required))
        );
        if (disabled) {
          group.controls[answerId].disable();
        };
      });
      return group;
    }
    return new UntypedFormGroup({});
  }

  private getValidations(answer: ICabQuestionSubQuestion, isMulti: boolean, required: boolean) {
    const dynamicValidations = answer.validation?.map(validate => this.getDynamicValidate(answer, validate));
    return [
      ...(required ? [this.DynamicRequiredValidate(isMulti)] : []),
      ...(dynamicValidations ?? [])
    ];
  }

  private getDynamicValidate(answer: ICabQuestionSubQuestion, validation: IDynamicFromValidator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = validation.value!;
      switch (validation.type) {
        case EErrorMessage.EMAIL_ERROR:
          const isValid = control.value && control.value.length > 0 ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value[0].value) : true;
          return isValid ? null : { email: validation.type };
        case EErrorMessage.EN_NUMBER_ONLY: return this.$dynamicValidator.DynamicEnNumberOnly(control); break;
        case EErrorMessage.MAX_ITEMS: return this.$dynamicValidator.DynamicMaxItems(control, +value as number); break;
        case EErrorMessage.MIN_ITEMS: return this.$dynamicValidator.DynamicMinItems(control, +value as number); break;
        case EErrorMessage.MAX_MIN_ITEMS: return this.$dynamicValidator.DynamicMaxMinItems(control, value[0], value[1]); break;
        case EErrorMessage.MAX_LENGTH: return this.$dynamicValidator.DynamicMaxLength(control, +value as number); break;
        case EErrorMessage.MIN_LENGTH: return this.$dynamicValidator.DynamicMinLength(control, +value as number); break;
        case EErrorMessage.MAX_MIN_LENGTH: return this.$dynamicValidator.DynamicMaxMinLength(control, value[0], value[1]); break;
        case EErrorMessage.NUMBER_ONLY: return this.$dynamicValidator.DynamicNumberOnly(control); break;
        default: return null;
      };
    }
  }

  private DynamicRequiredValidate(isMulti = false) {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      const isValid = isMulti ? value.length > 0 :( value[0] ? value[0].value.length > 0 : false);
      const error: any = {};
      error[`${EErrorMessage.REQUIRED}`] = this.$translate.instant(EErrorMessage.REQUIRED);
      return isValid ? null : error;
    };
  }

  /** 編輯頁題目資料 */
  public getDataForQuestion(res: ICabTemplateRes): any {
    return {
      ...res,
      fileForm: this.form.get('attachment'),
      groupsView: res.groups
        // .sort((a, b) => a.order - b.order)
        .map((group, groupIndex) => {
          return {
            ...group,
            form: this.getGroupForm(groupIndex),
            questions: Object.entries(group.questions)
              .sort((a, b) => a[1].order - b[1].order)
              .map(question => {
                cabQuestionFormMap.set(
                  question[0],
                  this.getQuestionForm(groupIndex, question[0])
                );
                return {
                  ...question[1],
                  show: true,
                  questionId: question[0],
                  form: this.getQuestionForm(groupIndex, question[0]),
                  SubQuestionGroupForm: this.getQuestionForm(
                    groupIndex,
                    question[0]
                  ).get('answers') as UntypedFormGroup,
                  SubQuestionGroup: Object.entries(question[1].SubQuestionGroup).map(
                    answer => {
                      const answerResult = {
                        ...answer[1],
                        show: true,
                        answerId: answer[0],
                        form: this.getSubQuestionValueForm(
                          groupIndex,
                          question[0],
                          answer[0]
                        ),
                        options: this.chunkArray(
                          answer[1].options,
                          this.maxOptionInLine
                        ),
                        optionsForNormal: answer[1].options?.map(option => ({
                          code: option.value,
                          name: option.label,
                          hasMemo: option.memo
                        })),
                        validationView: this.getValidationView(answer[1])
                      };
                      if (question[0] === '') {
                        this.hideExpressions.push([
                          ...answer[1].hideExpression!.map(item => ({
                            ...item,
                            selfQuestionId: question[0],
                            selfAnswerId: answer[0],
                          })),
                        ]);
                      }
                      return answerResult;
                    }
                  ),
                };
              }),
          };
        }),
    };
  }

  private getValidationView(answer: ICabQuestionSubQuestion): IDynamicFromValidator[] {
    return [
      ...(answer.required ? [{ type: EErrorMessage.REQUIRED } as IDynamicFromValidator] : []),
      ...(answer.validation ?? []).flatMap(item => item ? [item] : [])
    ]
  }

  private getGroupForm(groupIndex: number): UntypedFormGroup {
    return (this.form.get('answers') as UntypedFormArray).controls[
      groupIndex
    ] as UntypedFormGroup;
  }

  private getQuestionForm(
    groupIndex: number,
    questionId: string
  ): UntypedFormGroup {
    return (this.form.get('answers') as UntypedFormArray).controls[
      groupIndex
    ].get(questionId) as UntypedFormGroup;
  }

  private getSubQuestionValueForm(
    groupIndex: number,
    questionId: string,
    SubQuestionId: string
  ): UntypedFormGroup {
    return (
      (this.form.get('answers') as UntypedFormArray).controls[groupIndex].get(
        questionId
      ) as UntypedFormGroup
    )
      .get('answers')
      ?.get(SubQuestionId) as UntypedFormGroup;
  }

  private chunkArray(array: any[] | null, chunkSize: number): any[][] {
    const result = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i = i + chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
    }
    return result;
  }
}
