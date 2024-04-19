import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CabService } from '@core/services/cab-api.service';
import { ITab } from '@shared/components/tab/tabs.component';
import { LayoutService } from '@shared/service/layout.service';
import { OverlayService } from '@shared/service/overlay.service';
import { UnSubOnDestroy } from '@utilities/abstract/unSubOnDestroy.abstract';
import {
  ECabFormProcess,
  EContent,
  EFieldStatus,
  EFileType,
  EFormMode,
  ELang,
  ERole,
} from '@utilities/enum/common.enum';
import {
  ICabApplicationAnswerRes,
  ICabFile,
  ICabQuestionHideExpressionView,
  ICabRemark,
  ICabSupplementReq,
  ICabTemplateRes,
} from '@utilities/interface/api/cab-api.interface';
import { Subscription, catchError, forkJoin, takeUntil, throwError } from 'rxjs';
import {
  ICabQuestionGroupView,
  ICabRecordInfo,
} from './shared/interface/dynamic-form.interface';
import { TranslateService } from '@ngx-translate/core';
import {
  ECab,
  ECabAnswerStatus,
  ECabFormSubmitType,
  ECabPageFormStyleType,
} from './shared/enum/cab.enum';
import { WindowService } from '@shared/service/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cabProcessLabelMap, cabQuestionFormMap } from './shared/map/cab.map';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { saveAs } from 'file-saver';
import { UsersService } from '@core/services/users.service';
import { DatePipe } from '@angular/common';
import { CabRecordDialogComponent } from './components/cab-record-dialog/cab-record-dialog.component';
import { IAccordionListCard } from '@shared/components/accordion/accordion-list-card/accordion-list-card.component';
import { IUser } from '@utilities/interface/api/auth-api.interface';
import { ILabel } from '@utilities/interface/common.interface';
import { WarnDialogComponent } from '@shared/components/overlay/warn-dialog/warn-dialog.component';
import { DynamicForm } from './shared/model/dynamic-form.model';
import { ICabFormPage } from './shared/interface/dynamic-form.interface';
import { HttpClient } from '@angular/common/http';
import { EFieldType } from '@utilities/enum/form.enum';
import { DynamicFormValidatorsService } from '@core/dynamic-form-validators.service';

@Component({
  selector: 'app-dynamic-form-page',
  templateUrl: './dynamic-form-page.component.html',
  styleUrls: ['./dynamic-form-page.component.scss']
})
export class DynamicFormPageComponent extends UnSubOnDestroy
  implements OnInit {
  constructor(
    public $window: WindowService,
    private $layout: LayoutService,
    private $overlay: OverlayService,
    private $cab: CabService,
    private $user: UsersService,
    private fb: FormBuilder,
    private router: Router,
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
  public supplementaryData: ICabSupplementReq = {
    projectId: '',
    cabId: '',
    remark: null,
    attachment: null,
  };
  public cab?: DynamicForm;
  public record?: IAccordionListCard<ICabRecordInfo>;
  public user?: IUser;
  public formValueForCompare: any;
  public question_pages?: ICabFormPage[];
  public tabs: ITab[] = [];
  public tabForm = new FormControl(0);
  public fileTemp?: ICabFile;
  public formMode?: EFormMode;
  public infoTooltipHtml?: string;
  public isCreator?: boolean;
  public isFileSavedLocal = false;
  public isCompleteClicked = false;
  /** 未完成欄位數量 */
  public unfinishedFieldCount = 0;
  public subscription = new Subscription();
  private hideExpressions: ICabQuestionHideExpressionView[][] = [];
  private projectId = '';
  private cabType?: ECab;
  public progressLabel?: ILabel;
  private questionVersion = '';
  public cabId = '';
  private docId = '';
  public isFileReEditMode = false;
  private preReServeFileControl = new FormGroup({});
  private readonly fileSizeLimitMb = 30;
  private readonly iconClass = {
    valid: 'icon-confirmed-round text-green-middle ml-12 fs-lgx',
    invalid:
      'page-icon icon-exclamation d-flex align-items-center justify-content-center text-white ml-11 fw-9 fs-lg',
  };
  private readonly warningBeforeNavigate = 'common.cancel-edit-no-save-draft';

  get isChairman(): boolean {
    return !!this.user?.role.includes(ERole.Chairman);
  }
  get isCommittee(): boolean {
    return !!this.user?.role.includes(ERole.Committee);
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
    return this.cab?.status
      ? +this.cab.status === ECabFormProcess.RequiredForApprove
      : false;
  }
  get isFileInputting(): boolean {
    return this.latestFile.get('fieldStatus')?.value === EFieldStatus.Inputting;
  }
  get getBody() {
    return {
      ...this.cab?.form.getRawValue(),
      answers: this.cab?.getProjectAnswers(this.cab?.form),
      projectId: this.projectId,
      docId: this.docId,
      cabId: this.cabId,
      cab: this.cabType,
      questionVersion: this.questionVersion,
      attachment: this.fileControl
        ?.getRawValue()
        .map((file: ICabFile) => {
          return {
            ...file,
            type:
              !!file.type || file.type === 0
                ? file.type
                : +this.cab!.status! === ECabFormProcess.Draft
                  ? ECabAnswerStatus.Draft
                  : ECabAnswerStatus.RequiredForApprove,
            fileName: encodeURI(file.fileName),
          };
        })
        .filter(file => file.fileName),
    };
  }

  get fileControl() {
    return this.cab?.form.get('attachment') as FormArray;
  }
  get latestFile() {
    return this.fileControl.controls[this.fileControl.controls.length - 1];
  }
  get mode() {
    return EFormMode;
  }
  get fieldType() {
    return EFieldType;
  }
  get fieldStatusType() {
    return EFieldStatus;
  }
  get pagType() {
    return ECabPageFormStyleType;
  }
  get progressStatus() {
    return ECabFormProcess;
  }
  get answerStatus() {
    return ECabAnswerStatus;
  }
  get fieldStatus() {
    return EFieldStatus;
  }

  ngOnInit(): void {
    this.http.get('../../../../assets/mock-data/aarc-list.json').subscribe(v => console.log('aa-v', v))
    this.$layout.doSidebarExpandSubject.next(false);
    this.$layout.warningBeforeNavigateSubject.next(this.warningBeforeNavigate);
    this.init();
  }

  /** @param noApi 不需要打api */
  private init(noApi?: boolean): void {
    this.projectId = this.activateRouter.snapshot.params['projectId'];
    this.cabId = this.activateRouter.snapshot.params['cabId'];
    this.questionVersion =
      this.activateRouter.snapshot.params['questionVersion'];
    this.cabType = this.activateRouter.snapshot.params['cab'] as ECab;
    this.docId = this.activateRouter.snapshot.params['docId'];
    this.formMode = this.activateRouter.snapshot.params[
      'formMode'
    ] as EFormMode;
    const status = this.activateRouter.snapshot.params[
      'status'
    ] as ECabFormProcess;
    if (!noApi) {
      forkJoin([
        this.http.get<ICabApplicationAnswerRes[] | ICabApplicationAnswerRes | undefined>('../../../../assets/mock-data/cab-answer.json')
          .pipe(
            catchError(err => {
              this.handleApiError(err, 'common.get-fail');
              return throwError(() => err);
            })
          ),
        this.http.get<ICabTemplateRes>('../../../../assets/mock-data/cab-template.json'),
        this.http.get<IUser>('../../../../assets/mock-data/user-data.json'),
        this.http.get<ICabApplicationAnswerRes[]>('../../../../assets/mock-data/cab-records.json'),
      ]).subscribe({
        next: ([resProject, question, user, records]: [
          ICabApplicationAnswerRes[] | ICabApplicationAnswerRes | undefined,
          ICabTemplateRes,
          IUser,
          ICabApplicationAnswerRes[],
        ]) => {
          this.subscription.unsubscribe();
          const project = resProject as ICabApplicationAnswerRes;
          if (
            user.userId !== project.creator.id
              ? true
              : +status !== ECabFormProcess.Draft &&
              +status !== ECabFormProcess.RequiredForApprove
          ) {
            this.$overlay.addToast(EContent.Info, {
              title: 'common.no-edit-permission',
            });
            this.toReview();
          }
          this.progressLabel = cabProcessLabelMap.get(+project.status);
          this.formMode =
            project.answers && project.attachment
              ? this.formMode
              : EFormMode.Add;
          this.cab = new DynamicForm(
            question,
            this.$translate,
            this.datePipe,
            this.$dynamicValidator,
            project,
            this.fb
          );
          if (+this.cab.status! === ECabFormProcess.RequiredForApprove) {
            this.supplementaryData = this.getSupplementaryData(
              resProject as ICabApplicationAnswerRes
            );
          }
          this.user = user;
          this.isCreator =
            user.userId === (project as ICabApplicationAnswerRes).creator.id;
          this.formValueForCompare = JSON.parse(
            JSON.stringify(
              +this.cab.status! === ECabFormProcess.RequiredForApprove
                ? this.supplementaryData
                : this.cab?.form.getRawValue()
            )
          );
          this.question_pages = this.chunkByPage(
            this.cab.getDataForQuestion(question).groupsView,
            10
          );
          if (this.question_pages) {
            this.tabs = this.question_pages.map((page, index) => {
              const groups = page.groups;
              return {
                titleI18n:
                  index === 0
                    ? this.$translate.instant('cab.basic-info')
                    : this.$translate.instant('cab.group-type'),
                iconClasses: '',
                value: index,
              };
            });
          }
          this.subscribeForm();
          this.subscribeTab();
          this.onFormValeChange(this.cab.form);
        },
        error: err =>
          this.$overlay.addToast(EContent.Error, { title: 'common.get-fail' }),
      });
    }
  }

  public showRecord(): void {
    this.$overlay.addDialog(CabRecordDialogComponent, { card: this.record });
  }

  public onTempSave(): void {
    if (!this.isChanged()) {
      this.$overlay.addToast(EContent.Info, { title: 'common.no-update' });
      return;
    } else {
      const draftBody = { ...this.getBody, type: ECabFormSubmitType.Draft };
      const supplementBody = {
        ...this.supplementaryData,
        projectId: this.cab!.projectId!,
        cabId: this.cab!.cabId!,
      };
      (+this.cab!.status! === ECabFormProcess.RequiredForApprove
        ? this.$cab.putSupplementDraft(supplementBody)
        : this.formMode === EFormMode.Add
          ? this.$cab.postApplicationFormDraft(draftBody)
          : this.$cab.putApplicationFormDraft(draftBody)
      ).subscribe({
        next: project => {
          this.$overlay.addToast(EContent.Success, {
            title: 'common.update-success',
          });
          this.formValueForCompare = JSON.parse(
            JSON.stringify(
              +this.cab!.status! === ECabFormProcess.RequiredForApprove
                ? this.supplementaryData
                : this.cab?.form.getRawValue()
            )
          );
          if (this.formMode === EFormMode.Add) {
            // this.router.navigateByUrl(
            //   `${EModule.Cab}/${ECabPages.Detail}/${EFormMode.Edit}/${project.projectId}/${project.cab}/${project.cabId}/${project.questionVersion}/${project.docId}/${project.status}`
            // );
            this.init(true);
          }
          if (+this.cab!.status! === ECabFormProcess.RequiredForApprove) {
            this.init();
          }
        },
        error: err => {
          this.handleSubmitError(err);
        },
      });
    }
  }

  /** 此答案所屬階段與目前階段相同 */
  public isOnProgressAnswer(type: ECabAnswerStatus) {
    return +this.progressStatus! === ECabFormProcess.Draft
      ? +type === ECabAnswerStatus.Draft
      : +type === ECabAnswerStatus.RequiredForApprove;
  }

  public getEditorInfo(file: ICabFile): string {
    return `${file?.uploadDate ?? ''} ${(this.$translate.currentLang === ELang.Cn
      ? file?.departmentCn
      : file?.departmentEn) ?? ''
      } ${(this.$translate.currentLang === ELang.Cn
        ? file?.sectionCn
        : file.sectionEn) ?? ''
      } ${file?.userName ?? ''}`;
  }

  public reEdit(file: ICabFile) {
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

  public toRecords(): void {
    if (this.isChanged()) {
      this.$overlay.addDialog(
        WarnDialogComponent,
        { title: this.warningBeforeNavigate },
        {
          callback: {
            confirm: () => this.toRecordsPage(),
          },
        }
      );
      return;
    } else {
      this.toRecordsPage();
    }
  }

  public onRemarkValueChange({
    remark,
    questionId,
  }: {
    remark: ICabRemark;
    questionId: string;
  }): void {
    if (+this.cab!.status! === ECabFormProcess.RequiredForApprove) {
      if (
        this.supplementaryData.remark === null ||
        this.supplementaryData.remark.findIndex(
          item => Object.keys(item)[0] === questionId
        ) === -1
      ) {
        if (this.supplementaryData.remark === null) {
          this.supplementaryData.remark = [];
        }
        const newRemark: { [key: string]: ICabRemark } = {};
        newRemark[questionId] = {
          type:
            +this.cab!.status! === ECabFormProcess.Draft
              ? ECabAnswerStatus.Draft
              : ECabAnswerStatus.RequiredForApprove,
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
      const targetRemark: { [key: string]: ICabRemark } = {};
      targetRemark[questionId] = {
        ...remark,
        type: remark.type,
        content: remark.content === '' ? null : remark.content,
      };
      this.supplementaryData.remark[targetIndex] = targetRemark;
    }
  }

  private toRecordsPage(): void {
    // this.router.navigateByUrl(
    //   `${EModule.Cab}/${ECabPages.Record}/${this.cab?.projectId}/${this.cab?.docId}`
    // );
  }

  public toReview(project?: ICabApplicationAnswerRes): void {
    if (this.cab?.form.invalid) {
      this.cab?.form.markAllAsTouched();
      this.isCompleteClicked = true;
      this.showPageIcon();
      this.toErrorTab();
      this.$overlay.addToast(EContent.Warn, {
        title: 'validators.form-invalid',
      });
    } else {
      if (project) {
        // this.router.navigateByUrl(
        //   `${EModule.Cab}/${ECabPages.Review}/${project.projectId}/${project.cab}/${project.cabId}/${project.questionVersion}/${project.docId}/${project.status}`
        // );
      } else {
        // this.router.navigateByUrl(
        //   `${EModule.Cab}/${ECabPages.Review}/${this.projectId}/${this.cabType}/${this.cabId}/${this.questionVersion}/${this.docId}/${this.cab?.status}`
        // );
      }
    }
  }

  public isAlreadyHasFile(file: ICabFile) {
    return (
      file.type &&
      this.cab &&
      ((+file.type === ECabAnswerStatus.Draft &&
        +this.cab.status! === ECabFormProcess.Draft) ||
        (+file.type === ECabAnswerStatus.RequiredForApprove &&
          +this.cab.status! === ECabFormProcess.RequiredForApprove))
    );
  }

  public openSupplementUpload() {
    if (this.cab?.getEmptyFileFormGroup(this.cab.status!)) {
      this.fileControl.push(
        new FormGroup({
          file: new FormControl(''),
          fileName: new FormControl(''),
          url: new FormControl(''),
          department: new FormControl(''),
          departmentCn: new FormControl(''),
          departmentEn: new FormControl(''),
          section: new FormControl(''),
          sectionCn: new FormControl(''),
          sectionEn: new FormControl(''),
          userId: new FormControl(''),
          userName: new FormControl(''),
          email: new FormControl(''),
          isSizeError: new FormControl(false),
          isTypeError: new FormControl(false),
          uploadDate: new FormControl(''),
          type: new FormControl(''),
          fieldStatus: new FormControl(EFieldStatus.Inputting),
        })
      );
    }
  }

  public cancel() {
    this.latestFile.get('fieldStatus')?.setValue(EFieldStatus.Complete);
    if (!this.isFileReEditMode) {
      this.fileControl.controls.pop();
    } else {
      this.latestFile.patchValue(this.preReServeFileControl);
    }
  }

  public putFileWithProject() {
    this.$cab.putApplicationForm(this.getBody).subscribe({
      next: () => {
        this.$overlay.addToast(EContent.Success, {
          title: 'common.post-success',
        });
        this.formValueForCompare = JSON.parse(
          JSON.stringify(
            +this.cab!.status! === ECabFormProcess.RequiredForApprove
              ? this.supplementaryData
              : this.cab?.form.getRawValue()
          )
        );
        this.latestFile.get('fieldStatus')?.setValue(EFieldStatus.Complete);
        this.latestFile
          .get('type')
          ?.setValue(`${ECabAnswerStatus.RequiredForApprove}`);
      },
      error: err => {
        this.handleSubmitError(err);
      },
    });
  }

  public submit(): void {
    if (!this.isChanged()) {
      this.toReview(this.cab!.project_origin!);
      return;
    }
    if (
      +this.cab!.status! === ECabFormProcess.RequiredForApprove &&
      this.supplementaryData.attachment === null &&
      (this.supplementaryData.remark === null
        ? true
        : this.supplementaryData.remark?.filter(
          item => Object.values(item)[0].content
        ).length === 0)
    ) {
      this.$overlay.addToast(EContent.Info, {
        title: 'cab.no-supplement-provide',
      });
      return;
    }
    if (this.cab?.form.invalid) {
      this.isCompleteClicked = true;
      this.cab?.form.markAllAsTouched();
      this.showPageIcon();
      this.toErrorTab();
    } else {
      const draftBody = { ...this.getBody, type: ECabFormSubmitType.Complete };
      const supplementBody = {
        ...this.supplementaryData,
        projectId: this.cab!.projectId!,
        cabId: this.cab!.cabId!,
      };
      (+this.cab!.status! === ECabFormProcess.RequiredForApprove
        ? this.$cab.putSupplementDraft(supplementBody)
        : this.formMode === EFormMode.Add
          ? this.$cab.postApplicationFormDraft(draftBody)
          : this.$cab.putApplicationFormDraft(draftBody)
      ).subscribe({
        next: project => {
          this.$overlay.addToast(EContent.Success, {
            title: 'common.update-success',
          });
          this.toReview(project);
        },
        error: err => {
          this.handleSubmitError(err);
        },
      });
    }
  }

  private getSupplementaryData(
    projectRes: ICabApplicationAnswerRes
  ): ICabSupplementReq {
    const remarkCollection: { [questionId: string]: ICabRemark }[] = [];
    Object.entries(projectRes.answers).forEach(answer => {
      const remarks = answer[1].remark;
      if (remarks !== null) {
        const targetIndex = remarks.findIndex(
          item => +item.type === ECabAnswerStatus.RequiredForApprove
        );
        if (targetIndex !== -1) {
          const newRemark: { [key: string]: ICabRemark } = {};
          newRemark[answer[0]] = remarks[targetIndex];
          remarkCollection.push(newRemark);
        }
      }
    });
    const targetFile = projectRes.attachment.find(
      file => +file.type === ECabAnswerStatus.RequiredForApprove
    );
    return {
      projectId: '',
      cabId: '',
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
    this.onFormValeChange(this.cab!.form);
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
      this.$cab.upload(File[0]).subscribe({
        next: file => {
          this.isFileSavedLocal = true;
          const trustedUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(File[0])
          );
          this.supplementaryData.attachment = {
            ...file,
            type: ECabAnswerStatus.RequiredForApprove,
          };
          this.setFileControlValue(file, trustedUrl);
          this.$overlay.addToast(EContent.Success, {
            title: 'common.file-save-temporarily',
          });
          (event.target as HTMLInputElement).value = '';
          this.onFormValeChange(this.cab!.form);
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

  private setFileControlValue(file: ICabFile, fileUrl: SafeUrl): void {
    this.latestFile?.patchValue(file);
    this.latestFile?.get('fileName')?.setValue(decodeURI(file.fileName));
    this.latestFile
      ?.get('type')
      ?.setValue(
        +this.cab!.status! === ECabFormProcess.Draft
          ? ECabAnswerStatus.Draft
          : ECabAnswerStatus.RequiredForApprove
      );
    this.latestFile?.get('file')?.setValue(file.file);
    this.latestFile?.get('uploadDate')?.setValue(file.uploadDate);
    this.latestFile?.get('isSizeError')?.setValue(false);
    this.latestFile?.get('isTypeError')?.setValue(false);
    this.latestFile?.get('url')?.setValue(fileUrl);
  }

  private getUnfinishedRequiredFieldCount(): number {
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
    this.cab?.form.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_ => this.onFormValeChange(this.cab!.form));
  }

  /** @param file 檔案id*/
  public downloadFile(res: { event: Event; file: string }): void {
    if (this.isFileSavedLocal) {
      res.event.preventDefault();
    } else {
      this.$cab
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
    this.$cab
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
    hideExpression: ICabQuestionHideExpressionView[][]
  ): void {
    hideExpression.forEach(expressions => {
      const show =
        expressions[0].questionId !== ''
          ? expressions.some(expression => {
            const targetValue = cabQuestionFormMap
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
          ? this.cab?.form.get('attachment')?.valid
          : true);
      this.tabs[pageIndex] = {
        ...this.tabs[pageIndex],
        iconClasses: isPageValid
          ? this.iconClass.valid
          : this.cab?.form.touched && this.isCompleteClicked
            ? this.iconClass.invalid
            : '',
      };
    });
  }

  /**
   * @param chunkCount 多少題一頁
   */
  private chunkByPage(
    groups: ICabQuestionGroupView[],
    chunkSize: number
  ): ICabFormPage[] {
    const pages: ICabQuestionGroupView[][] = [];
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
          ? ECabPageFormStyleType.BasicInfo
          : ECabPageFormStyleType.Default,
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
    if (this.cab) {
      return +this.cab!.status! === ECabFormProcess.Draft
        ? !this.deepEqual(this.cab.form.getRawValue(), this.formValueForCompare)
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
