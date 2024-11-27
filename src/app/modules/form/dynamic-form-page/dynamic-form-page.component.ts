import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DFService } from '@core/services/df-api.service';
import { ITab } from '@shared/components/tab/tabs.component';
import { LayoutService } from '@shared/service/layout.service';
import { OverlayService } from '@shared/service/overlay.service';
import { UnSubOnDestroy } from '@utilities/abstract/unSubOnDestroy.abstract';
import {
  EFDProcess,
  EContent,
  EFieldStatus,
  EFileType,
  FORM_MODE,
  ELang,
  ROLE,
} from '@utilities/enum/common.enum';
import {
  IDFApplicationAnswerRes,
  IDFFile,
  IDFQuestionHideExpressionView,
  IDFRemark,
  IDFSupplementReq,
  IDFTemplateRes,
} from '@utilities/interface/api/df-api.interface';
import { Subscription, catchError, forkJoin, takeUntil, throwError } from 'rxjs';
import {
  IDFQuestionGroupView,
  IDFRecordInfo,
} from './shared/interface/dynamic-form.interface';
import { TranslateService } from '@ngx-translate/core';
import {
  EDFAnswerStatus, EDFPageFormStyleType
} from './shared/enum/df.enum';
import { WindowService } from '@shared/service/window.service';
import { ActivatedRoute } from '@angular/router';
import { dfQuestionFormMap } from './shared/map/df.map';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { IAccordionListCard } from '@shared/components/accordion/accordion-list-card/accordion-list-card.component';
import { IUser } from '@utilities/interface/api/auth-api.interface';
import { DynamicForm } from './shared/model/dynamic-form.model';
import { IDFFormPage } from './shared/interface/dynamic-form.interface';
import { HttpClient } from '@angular/common/http';
import { EFieldType } from '@utilities/enum/form.enum';
import { DynamicFormValidatorsService } from '@core/dynamic-form-validators.service';
import { slideEnter } from '@utilities/helper/animations.helper';

@Component({
  selector: 'app-dynamic-form-page',
  templateUrl: './dynamic-form-page.component.html',
  styleUrls: ['./dynamic-form-page.component.scss'],
  animations: [slideEnter()]
})
export class DynamicFormPageComponent extends UnSubOnDestroy
  implements OnInit {
  constructor(
    public $window: WindowService,
    private $layout: LayoutService,
    private $overlay: OverlayService,
    private $df: DFService,
    private fb: FormBuilder,
    private activateRouter: ActivatedRoute,
    private $translate: TranslateService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private http: HttpClient,
    private $dynamicValidator: DynamicFormValidatorsService,
  ) {
    super();
  }

  /** 補件資料 Supplementary Documents */
  public supplementaryData: IDFSupplementReq = {
    projectId: '',
    dfId: '',
    remark: null,
    attachment: null,
  };
  public dynamic?: DynamicForm;
  public record?: IAccordionListCard<IDFRecordInfo>;
  public user?: IUser;
  public formValueForCompare: any;
  public question_pages?: IDFFormPage[];
  public tabs: ITab[] = [];
  public tabForm = new FormControl(0);
  public fileTemp?: IDFFile;
  public formMode?: FORM_MODE;
  public infoTooltipHtml?: string;
  public isCreator?: boolean;
  public isFileSavedLocal = false;
  public isCompleteClicked = false;
  /** 未完成欄位數量 */
  public unfinishedFieldCount = 0;
  public totalFieldCount = 0;
  public subscription = new Subscription();
  private hideExpressions: IDFQuestionHideExpressionView[][] = [];
  public isFileReEditMode = false;
  private preReServeFileControl = new FormGroup({});
  private readonly fileSizeLimitMb = 30;
  private readonly iconClass = {
    valid: 'icon-confirmed-round text-green-middle ml-12 fs-lgxx',
    invalid:
      'page-icon d-flex align-items-center justify-content-center text-white ml-11 fw-9 fs-lgxx',
  };
  private readonly warningBeforeNavigate = 'common.cancel-edit-no-save-draft';

  get isChairman(): boolean {
    return !!this.user?.role.includes(ROLE.CHAIRMAN);
  }
  get isCommittee(): boolean {
    return !!this.user?.role.includes(ROLE.COMMITTEE);
  }
  get isLastPage(): boolean {
    const tabValue =
      this.tabForm && this.tabForm.value ? +this.tabForm.value : 0;
    return !!this.question_pages && tabValue === this.question_pages.length - 1;
  }
  get isReviewPage(): boolean {
    return this.tabForm.value === this.tabs.length;
  }
  get isLastFileError(): boolean {
    return (
      this.latestFile.value.isSizeError || this.latestFile.value.isTypeError
    );
  }
  get isSupplementStatus(): boolean {
    return this.dynamic?.status
      ? +this.dynamic.status === EFDProcess.RequiredForApprove
      : false;
  }
  get isFileInputting(): boolean {
    return this.latestFile.get('fieldStatus')?.value === EFieldStatus.Inputting;
  }

  get fileControl() {
    return this.dynamic?.form.get('attachment') as FormArray;
  }
  get latestFile() {
    return this.fileControl.controls[this.fileControl.controls.length - 1];
  }
  get mode() {
    return FORM_MODE;
  }
  get fieldType() {
    return EFieldType;
  }
  get fieldStatusType() {
    return EFieldStatus;
  }
  get pagType() {
    return EDFPageFormStyleType;
  }
  get progressStatus() {
    return EFDProcess;
  }
  get answerStatus() {
    return EDFAnswerStatus;
  }
  get fieldStatus() {
    return EFieldStatus;
  }

  ngOnInit(): void {
    this.$layout.warningBeforeNavigateSubject.next(this.warningBeforeNavigate);
    this.init();
  }

  /** @param noApi 不需要打api */
  private init(noApi?: boolean): void {
    this.formMode = this.activateRouter.snapshot.params[
      'formMode'
    ] as FORM_MODE;
    const status = this.activateRouter.snapshot.params[
      'status'
    ] as EFDProcess;
    if (!noApi) {
      forkJoin([
        this.http.get<IDFApplicationAnswerRes[] | IDFApplicationAnswerRes | undefined>('assets/mock-data/df-answer.json')
          .pipe(
            catchError(err => {
              this.handleApiError(err, 'common.get-fail');
              return throwError(() => err);
            })
          ),
        this.http.get<IDFTemplateRes>('assets/mock-data/df-template.json'),
        this.http.get<IUser>('assets/mock-data/user-data.json'),
      ]).subscribe({
        next: ([resProject, question, user]: [
          IDFApplicationAnswerRes[] | IDFApplicationAnswerRes | undefined,
          IDFTemplateRes,
          IUser,
        ]) => {
          this.subscription.unsubscribe();
          const project = resProject as IDFApplicationAnswerRes;
          this.$overlay.addToast(EContent.Success, { title: 'common.welcome' });
          this.formMode =
            project.answers && project.attachment
              ? this.formMode
              : FORM_MODE.ADD;
          this.dynamic = new DynamicForm(
            question,
            this.$translate,
            this.datePipe,
            this.$dynamicValidator,
            this.$overlay,
            project,
            this.fb
          );
          if (+this.dynamic.status! === EFDProcess.RequiredForApprove) {
            this.supplementaryData = this.getSupplementaryData(
              resProject as IDFApplicationAnswerRes
            );
          };
          this.user = user;
          this.isCreator =
            user.userId === (project as IDFApplicationAnswerRes).creator.id;
          this.formValueForCompare = JSON.parse(
            JSON.stringify(
              +this.dynamic.status! === EFDProcess.RequiredForApprove
                ? this.supplementaryData
                : this.dynamic?.form.getRawValue()
            )
          );
          this.question_pages = this.chunkByPage(
            this.dynamic.getDataForQuestion(question).groupsView,
            10
          );
          if (this.question_pages) {
            this.tabs = this.question_pages.map((page, index) => {
              const groups = page.groups;
              return {
                titleI18n:
                  index === 0
                    ? this.$translate.instant('df.basic-info')
                    : this.$translate.instant('df.group-type'),
                iconClasses: '',
                value: index,
              };
            });
          }
          this.subscribeForm();
          this.subscribeTab();
          this.onFormValeChange(this.dynamic.form);
        },
        error: err =>
          this.$overlay.addToast(EContent.Error, { title: 'common.get-fail' }),
      });
    }
  }

  public onTempSave(): void {
    if (!this.isChanged()) {
      this.$overlay.addToast(EContent.Info, { title: 'common.no-update' });
      return;
    } else {
      this.$overlay.addToast(EContent.Success, {
        title: 'common.update-success',
      });
      this.formValueForCompare = JSON.parse(
        JSON.stringify(
          +this.dynamic!.status! === EFDProcess.RequiredForApprove
            ? this.supplementaryData
            : this.dynamic?.form.getRawValue()
        )
      );
      if (this.formMode === FORM_MODE.ADD) {
        this.init(true);
      }
      if (+this.dynamic!.status! === EFDProcess.RequiredForApprove) {
        this.init();
      }
    }
  }

  /** 此答案所屬階段與目前階段相同 */
  public isOnProgressAnswer(type: EDFAnswerStatus) {
    return +this.progressStatus! === EFDProcess.Draft
      ? +type === EDFAnswerStatus.Draft
      : +type === EDFAnswerStatus.RequiredForApprove;
  }

  public getEditorInfo(file: IDFFile): string {
    return `${file?.uploadDate ?? ''} ${(this.$translate.currentLang === ELang.Cn
      ? file?.departmentCn
      : file?.departmentEn) ?? ''
      } ${(this.$translate.currentLang === ELang.Cn
        ? file?.sectionCn
        : file.sectionEn) ?? ''
      } ${file?.userName ?? ''}`;
  }

  public reEdit(file: IDFFile) {
    this.isFileReEditMode = true;
    file.fieldStatus = EFieldStatus.Inputting;
    this.preReServeFileControl = this.latestFile as FormGroup;
  }

  /** 頁面中的題目是不是都valid */
  public isPageValid(pageIndex: number): boolean {
    return !this.question_pages![pageIndex].groups.some(
      group => group.form.invalid
    );
  }

  public onRemarkValueChange({
    remark,
    questionId,
  }: {
    remark: IDFRemark;
    questionId: string;
  }): void {
    if (+this.dynamic!.status! === EFDProcess.RequiredForApprove) {
      if (
        this.supplementaryData.remark === null ||
        this.supplementaryData.remark.findIndex(
          item => Object.keys(item)[0] === questionId
        ) === -1
      ) {
        if (this.supplementaryData.remark === null) {
          this.supplementaryData.remark = [];
        }
        const newRemark: { [key: string]: IDFRemark } = {};
        newRemark[questionId] = {
          type:
            +this.dynamic!.status! === EFDProcess.Draft
              ? EDFAnswerStatus.Draft
              : EDFAnswerStatus.RequiredForApprove,
          fieldStatus: EFieldStatus.Inputting,
          content: null,
          department: '',
          departmentCn: '',
          departmentEn: '',
          section: '',
          sectionCn: '',
          sectionEn: '',
        };
        this.supplementaryData.remark.push(newRemark);
      }
      const targetIndex = this.supplementaryData.remark.findIndex(
        item => Object.keys(item)[0] === questionId
      );
      const targetRemark: { [key: string]: IDFRemark } = {};
      targetRemark[questionId] = {
        ...remark,
        type: remark.type,
        content: remark.content === '' ? null : remark.content,
      };
      this.supplementaryData.remark[targetIndex] = targetRemark;
    }
  }

  public submit(): void {
    console.log('submit', this.dynamic?.form)
    if (this.dynamic?.form.invalid) {
      this.isCompleteClicked = true;
      this.dynamic?.form.markAllAsTouched();
      this.showPageIcon();
      this.toErrorTab();
      this.$overlay.addToast(EContent.Error, {
        title: '請檢查紅色區塊',
      });
    } else {
      this.$overlay.addToast(EContent.Success, {
        title: 'common.update-success',
      });
    }
  }

  private getSupplementaryData(
    projectRes: IDFApplicationAnswerRes
  ): IDFSupplementReq {
    const remarkCollection: { [questionId: string]: IDFRemark }[] = [];
    Object.entries(projectRes.answers).forEach(answer => {
      const remarks = answer[1].remark;
      if (remarks !== null) {
        const targetIndex = remarks.findIndex(
          item => +item.type === EDFAnswerStatus.RequiredForApprove
        );
        if (targetIndex !== -1) {
          const newRemark: { [key: string]: IDFRemark } = {};
          newRemark[answer[0]] = remarks[targetIndex];
          remarkCollection.push(newRemark);
        }
      }
    });
    const targetFile = projectRes.attachment.find(
      file => +file.type === EDFAnswerStatus.RequiredForApprove
    );
    return {
      projectId: '',
      dfId: '',
      remark: remarkCollection.length === 0 ? null : remarkCollection,
      attachment: targetFile ?? null,
    };
  }

  private handleSubmitError(err: any) {
    if (err.error.message) {
      this.$overlay.addToast(EContent.Error, { title: err.error.message });
    } else {
      this.$overlay.addToast(EContent.Error, { title: 'common.update-fail' });
    }
  }

  public clearFile(): void {
    this.supplementaryData.attachment = null;
    const latestFile =
      this.fileControl.controls[this.fileControl.controls.length - 1];
    latestFile?.get('fileName')?.setValue('');
    latestFile?.get('file')?.setValue('');
    latestFile?.get('url')?.setValue('');
    latestFile?.get('isSizeError')?.setValue(false);
    latestFile?.get('isTypeError')?.setValue(false);
    latestFile?.get('type')?.setValue('');
    latestFile?.get('fieldStatus')?.setValue(EFieldStatus.Inputting);
    this.fileControl.updateValueAndValidity();
    this.onFormValeChange(this.dynamic!.form);
  }

  public onFormValeChange(from: FormGroup): void {
    this.setHideExpressions(this.hideExpressions);
    this.showInvalidMark();
    this.$layout.warningBeforeNavigateSubject.next(
      this.isChanged() ? this.warningBeforeNavigate : ''
    );
  }

  private showInvalidMark(): void {
    this.showPageIcon();
    this.unfinishedFieldCount = this.getUnfinishedRequiredFieldCount();
  }

  public upload(event: Event): void {
    const File = (event.target as HTMLInputElement).files!;
    if (File && File.length > 0) {
      if (this.preUploadErrorHandle(File)) {
        return;
      }
      this.$df.upload(File[0]).subscribe({
        next: file => {
          this.isFileSavedLocal = true;
          const trustedUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(File[0])
          );
          this.supplementaryData.attachment = {
            ...file,
            type: EDFAnswerStatus.RequiredForApprove,
          };
          this.setFileControlValue(file, trustedUrl);
          this.$overlay.addToast(EContent.Success, {
            title: 'common.file-save-temporarily',
          });
          (event.target as HTMLInputElement).value = '';
          this.onFormValeChange(this.dynamic!.form);
        },
        error: () => {
          (event.target as HTMLInputElement).value = '';
          this.fileControl.controls[0].get('isError')?.setValue(true);
          this.$overlay.addToast(EContent.Error, {
            title: 'common.file-upload-failed',
          });
        },
      });
      this.showPageIcon();
    }
  }

  private preUploadErrorHandle(file: FileList): boolean {
    const type = file[0].type.split('/')[1].toLocaleLowerCase();
    const isSizeError = file[0].size > this.fileSizeLimitMb * 1024 * 1024;
    const isTypeError =
      type !== EFileType.PDF &&
      type !== EFileType.PPT &&
      type !== EFileType.PPTX &&
      type !== EFileType.PPT_MSPOWERPOINT &&
      type !== EFileType.PPT_POWERPOINT &&
      type !== EFileType.PPT_VND_POWERPOINT &&
      type !== EFileType.PPT_X_MSPOWERPOINT;
    this.fileControl.controls[0].get('isSizeError')?.setValue(isSizeError);
    this.fileControl.controls[0].get('isTypeError')?.setValue(isTypeError);
    if (this.isLastFileError) {
      if (isTypeError) {
        this.$overlay.addToast(EContent.Error, {
          title: 'common.upload-type-wrong',
        });
      }
      if (isSizeError) {
        this.$overlay.addToast(EContent.Error, {
          title: 'common.upload-size-wrong',
        });
      }
    }
    return this.isLastFileError;
  }

  private setFileControlValue(file: IDFFile, fileUrl: SafeUrl): void {
    this.latestFile?.patchValue(file);
    this.latestFile?.get('fileName')?.setValue(decodeURI(file.fileName));
    this.latestFile
      ?.get('type')
      ?.setValue(
        +this.dynamic!.status! === EFDProcess.Draft
          ? EDFAnswerStatus.Draft
          : EDFAnswerStatus.RequiredForApprove
      );
    this.latestFile?.get('file')?.setValue(file.file);
    this.latestFile?.get('uploadDate')?.setValue(file.uploadDate);
    this.latestFile?.get('isSizeError')?.setValue(false);
    this.latestFile?.get('isTypeError')?.setValue(false);
    this.latestFile?.get('url')?.setValue(fileUrl);
  }

  private getUnfinishedRequiredFieldCount(): number {
    this.totalFieldCount = 0;
    let count = this.question_pages
      ? this.question_pages?.reduce((count, page) => {
        let errorQuestionNumber = 0;
        page.groups.forEach(group => {
          group.questions
            .filter(question => question.show)
            .forEach(question => {
              question.SubQuestionGroup
                .filter(answer => answer.show && answer.required)
                .forEach(answer => {
                  this.totalFieldCount = this.totalFieldCount + 1;
                  if (answer.form.invalid) {
                    errorQuestionNumber = errorQuestionNumber + 1;
                  }
                });
            });
        });
        count = count + errorQuestionNumber;
        return count;
      }, 0)
      : 0;
    if (!this.fileControl.controls.every(control => control.value.fileName)) {
      count = count + 1;
    }
    return count;
  }

  private subscribeTab(): void {
    this.tabForm.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_ => this.$window.scrollToTopSubject.next());
  }

  private subscribeForm(): void {
    this.dynamic?.form.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_ => this.onFormValeChange(this.dynamic!.form));
  }

  /** @param file 檔案id*/
  public downloadFile(res: { event: Event; file: string }): void {
    if (this.isFileSavedLocal) {
      res.event.preventDefault();
    } else {
      this.$df
        .download(res.file)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: file => this.save(file),
          error: err =>
            this.$overlay.addToast(EContent.Error, {
              title: 'common.get-file-fail',
            }),
        });
    }
  }

  public downloadFileTemp(): void {
    this.$df
      .downloadTemp()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: file => this.save(file),
        error: err =>
          this.$overlay.addToast(EContent.Error, {
            title: 'common.get-file-fail',
          }),
      });
  }

  private save(file: any): void {
    const disposition = file.headers.headers.get('content-disposition')[0];
    const downloadFileName = decodeURI(
      disposition.substring(
        disposition.indexOf('filename=') + 9,
        disposition.length
      )
    ).replace(/"/g, '');
    // saveAs(file.body, downloadFileName);
  }

  private setHideExpressions(
    hideExpression: IDFQuestionHideExpressionView[][]
  ): void {
    hideExpression.forEach(expressions => {
      const show =
        expressions[0].questionId !== ''
          ? expressions.some(expression => {
            const targetValue = dfQuestionFormMap
              .get(expression.questionId)
              ?.get('answers')
              ?.get(expression.answerId)?.value.value;
            const isMulti =
              typeof targetValue !== 'string' &&
              typeof targetValue !== 'number';
            return isMulti
              ? targetValue.some(
                (item: string) =>
                  (item === '' ? 0 : item) === +expression.value
              )
              : (targetValue === '' ? 0 : targetValue) === +expression.value;
          })
          : true;
      this.question_pages!.forEach(page =>
        page.groups.forEach(group =>
          group.questions.forEach(question => {
            question.SubQuestionGroup.forEach(answer => {
              if (
                question.questionId === expressions[0].selfQuestionId &&
                answer.answerId === expressions[0].selfAnswerId
              ) {
                answer.show = show;
                answer.form
                  .get('value')
                  ?.setValidators(show ? [Validators.required] : null);
                answer.form.get('value')?.updateValueAndValidity();
              }
              if (question.questionId === expressions[0].selfQuestionId) {
                question.show = question.SubQuestionGroup.some(
                  answer => answer.show
                );
              }
            });
          })
        )
      );
    });
  }

  private showPageIcon(): void {
    this.question_pages?.forEach((page, pageIndex) => {
      const isPageValid =
        page.groups.every(
          group => group.form.valid || group.form.status === 'DISABLED'
        ) &&
        (pageIndex === this.question_pages!.length - 1
          ? this.dynamic?.form.get('attachment')?.valid
          : true);
      this.tabs[pageIndex] = {
        ...this.tabs[pageIndex],
        iconClasses: isPageValid
          ? this.iconClass.valid
          : this.dynamic?.form.touched && this.isCompleteClicked
            ? this.iconClass.invalid
            : '',
      };
    });
  }

  /**
   * @param chunkCount 多少題一頁
   */
  private chunkByPage(
    groups: IDFQuestionGroupView[],
    chunkSize: number
  ): IDFFormPage[] {
    const pages: IDFQuestionGroupView[][] = [];
    let currentPageQuestionLength = 0;
    groups.forEach(group => {
      const Questions = group.questions;
      if (!pages[pages.length === 0 ? 0 : pages.length - 1]) {
        pages.push([]);
      }
      const CurrentPage = pages[pages.length === 0 ? 0 : pages.length - 1];
      const BelongCurrentPage =
        CurrentPage.length === 0 ||
        currentPageQuestionLength + Questions.length < chunkSize;
      if (BelongCurrentPage) {
        CurrentPage.push(group);
        currentPageQuestionLength =
          currentPageQuestionLength + Questions.length;
      } else {
        pages.push([]);
        pages[pages.length - 1].push(group);
        currentPageQuestionLength = 0;
      }
    });
    return pages.map((page, index) => ({
      styleType:
        index === 0
          ? EDFPageFormStyleType.BasicInfo
          : EDFPageFormStyleType.Default,
      groups: page,
    }));
  }

  private toErrorTab(): void {
    const firstErrorPageIndex = this.question_pages!.findIndex(page =>
      page.groups.some(group => group.form.invalid)
    );
    if (firstErrorPageIndex !== -1) {
      this.tabForm.setValue(firstErrorPageIndex);
      this.$window.scrollToTopSubject.next();
    }
  }

  private isChanged(): boolean {
    if (this.dynamic) {
      return +this.dynamic!.status! === EFDProcess.Draft
        ? !this.deepEqual(this.dynamic.form.getRawValue(), this.formValueForCompare)
        : !this.deepEqual(this.supplementaryData, this.formValueForCompare);
    } else {
      return false;
    }
  }

  private deepEqual(obj1: any, obj2: any): boolean {
    if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
    ) {
      return obj1 === obj2;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }

  private handleApiError(err: any, customTitle: string) {
    if (err.error && err.error.message) {
      this.$overlay.addToast(EContent.Error, { title: err.error.message });
    } else {
      this.$overlay.addToast(EContent.Error, { title: customTitle });
    }
  }
}
