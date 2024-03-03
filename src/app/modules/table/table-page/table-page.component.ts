import {
  ITableConfig,
  ITableData,
} from '@shared/components/data-table/data-table.component';
import { EModule, ETablePages } from '@utilities/enum/router.enum';
import { Component, OnInit, DoCheck } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import {
  Observable,
  Subject,
  forkJoin,
  take,
  takeUntil,
} from 'rxjs';

import { ConsoleService } from '@core/services/console.service';
import { ProjectsService } from '@core/services/projects.service';
import { UsersService } from '@core/services/users.service';
import { EContent, ERole } from '@utilities/enum/common.enum';
import { OverlayService } from '@shared/service/overlay.service';
import { TranslateService } from '@ngx-translate/core';
import {
  IField,
  IProject,
  IQuartileCheckList,
  IQuestion,
  ISystem6Rs,
} from '@utilities/interface/api/project-api.interface';
import { slideEnter } from '@utilities/helper/animations.helper';
import { Quartile } from '@utilities/model/quartile.model';
import { EQuestionSectionId } from '@utilities/enum/question.enum';
import { ISixRName, sixRColorMap } from '@utilities/map/sixR.map';
import { BasePage } from '@utilities/base/base-page';
import { RouterService } from '@shared/service/router.service';
import { QuestionMap } from '@utilities/map/question.map';
import { IOption } from '@utilities/interface/common.interface';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ITenant } from '@utilities/interface/tenant.interface';
import { AuthenticationService } from '@core/services/authentication.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.scss'],
  animations: [slideEnter()],
})
export class TablePageComponent extends BasePage implements OnInit, DoCheck {
  projectList_orig: ITableData[] = [];
  projectList_view: ITableData[] = [];
  projectList: IProject[] = [];
  quartile?: Quartile;
  configForm: UntypedFormGroup = new FormGroup({
    topScrollBar: new FormControl(true),
    rowSelections: new FormControl(false),
    pagination: new FormControl(false),
    pageSize: new FormControl({ value: 1, disabled: true }, [Validators.pattern(/^[1-9]{1, 2}$/)])
  });
  filterForm!: UntypedFormGroup;

  showAdminTools$: Observable<boolean>;
  public tableConfigs?: ITableConfig;
  /** 沒有顯示table時顯示的提示 */
  public noTableWarn = '';
  currentItemsToShow: any;
  isSiteAdmin!: boolean;
  isReviewer!: boolean;
  private tenantId = '';
  public showResetButton = false;
  public resetFromTable = false;
  /** 搜尋事件 */
  private searchSubject = new Subject<string>();
  public search$ = this.searchSubject.asObservable();
  /** 重置表單事件 */
  public resetListSubject = new Subject<void>();
  public resetList$ = this.resetListSubject.asObservable();

  constructor(
    private router: Router,
    private consoleService: ConsoleService,
    private projectsService: ProjectsService,
    private userService: UsersService,
    private $auth: AuthenticationService,
    private storage: StorageMap,
    private fb: UntypedFormBuilder,
    private $user: UsersService,
    private $overlay: OverlayService,
    private $translate: TranslateService,
    private http: HttpClient,
    $router: RouterService
  ) {
    super($router);
    this.showAdminTools$ = consoleService.showAdminTools$;
    this.filterForm = this.fb.group({
      tenantFilter: '',
      searchFilter: '',
    });
    this.userService.getUserData().subscribe((user: any) => {
      this.tenantId = user.tenantId;
      this.isSiteAdmin = user.role.includes(ERole.SiteAdmin);
      this.isReviewer = user.role.includes(ERole.Reviewer);
    });
  }

  get searchFilterControl() {
    return this.filterForm.get('searchFilter');
  }
  public tenantOptions: IOption<string>[] = [];

  protected override onInit() {
    this.subscribeConfigForm();
    this.makeTenantListExist().then(res => this.initView(res[0], res[1]));
  }

  ngDoCheck(): void {
    this.showResetButton = this.resetFromTable;
  }

  private initView(tenantId: string, tenantList: ITenant[]): void {
    this.tenantOptions = tenantList.map(tenant => ({
      code: tenant.tenantId,
      name: tenant.tenantNameCn,
    })) as IOption<string>[];
    this.projectsService.getProjectsV2()

    forkJoin({
      projects: this.http.get<IProject[]>('assets/mock-data/project-list.json'),
      questionTemplate: this.http.get<IQuestion>('assets/mock-data/questions.json'),
      quartile: this.http.get<IQuartileCheckList>('assets/mock-data/quartile.json'),
    }).pipe(take(1)).subscribe(
      (val: {
        projects: IProject[];
        questionTemplate: IQuestion;
        quartile: IQuartileCheckList;
      }) => {
        if (!environment.production) {
          console.log('Project-list', val);
        }
        this.noTableWarn = 'common.no-data';
        this.projectList = val.projects;
        if (val.quartile) {
          this.quartile = new Quartile(val.quartile);
        };
        if (val.projects.length > 0) {
          this.projectList_orig = this.getProjectsForTable(
            val.projects,
            val.questionTemplate,
            val.quartile
          );
          this.projectList_view = this.projectList_orig;
          this.setDataTableConfig(
            val.questionTemplate,
            val.projects,
            val.quartile
          );
        };
      },
      err => {
        this.noTableWarn = 'common.api-error-no-data';
        this.$overlay.addToast(EContent.Error, { title: 'common.get-fail' });
      }
    );
  }

  private makeTenantListExist(): Promise<[string, ITenant[]]> {
    return new Promise(resolve => {
      forkJoin([this.storage.get('tenantList'), this.userService.getUserData()])
        .pipe(take(1))
        .subscribe({
          next: ([tenantList, userData]) => {
            const list = tenantList as ITenant[];
            this.tenantId = userData.tenantId;
            if (list && !!list.length) {
              resolve([this.tenantId, list]);
            } else {
              this.$user
                .getUserInfoAndReviewerInfoAndStore()
                .subscribe(user => {
                  const tenantList = user.tenantRespDtos as ITenant[];
                  resolve([this.tenantId, tenantList]);
                });
            }
          },
        });
    });
  }

  public dataChange() {
    this.projectList_view = this.projectList_view.length === 1 ? this.projectList_orig : [this.projectList_view[0]];
  }

  /** 前往project頁面 */
  public toProject(projectId?: string | number): void {
    const TempId = this.projectList?.find(
      project => project.projectId === projectId
    )?.questionTemplateId;
    const TenantId = this.projectList?.find(
      project => project.projectId === projectId
    )?.tenantId;

    const IsTenant =
      this.projectList.find(project => project.projectId === projectId)
        ?.tenantId === this.tenantId;
    this.router.navigateByUrl(
      `${EModule.Table}/${projectId
        ? (IsTenant || this.isSiteAdmin ? 'edit/' : 'view/') +
        projectId +
        '/' +
        TempId +
        '/' +
        TenantId
        : ETablePages.New
      }`
    );
  }

  public onTenantSelect(option: IOption): void {
    let projectList_copy = this.projectList_orig;
    this.projectList_view = projectList_copy.filter(project =>
      !option ? true : project['tenantId'] === option.code
    );
  }

  /** 獲得 data-table 所需格式的answer
   * @param projects 專案資料(含答案) from api source
   * @param questionTem 題目資料 from api source  */
  private getProjectsForTable(
    projects: IProject[],
    questionTem: IQuestion,
    quartile: IQuartileCheckList
  ): ITableData[] {
    questionTem.groups.forEach(group => {
      Object.entries(group.questions).forEach(([key, question]) =>
        QuestionMap.set(key, question)
      );
    });
    return projects
      .map((project: IProject) => {
        let answer: { [key: string]: (string | number)[] } = {};
        mappingValueDisplay(answer, project);
        const ApName = this.getClassNameField('ap-name', questionTem);
        const ApId = this.getClassNameField('ap-id', questionTem);
        const SixR =
          project.isComplete && project.result && project.result.system6r
            ? this.sort6R(project.result.system6r).reduce(
              (result, r, index) =>
                `${index === 0 ? r.result6r : result + ' ' + r.result6r}`,
              ''
            )
            : '--';
        return {
          ...answer,
          ...{
            projectId: project.projectId,
            apName: ApName
              ? project.answers[ApName.key]
                ? project.answers[ApName.key].value !== null
                  ? project.answers[ApName.key].value![0]
                  : null
                : ''
              : '',
            apId: ApId
              ? project.answers[ApId.key]
                ? project.answers[ApId.key].value !== null
                  ? project.answers[ApId.key].value![0]
                  : null
                : ''
              : '',
            '6r':
              project.isComplete && project.result && project.result.system6r
                ? this.sort6R(project.result.system6r).reduce(
                  (result, r, index) =>
                    `${index === 0
                      ? r.result6r === 'TBD'
                        ? '--'
                        : r.result6r
                      : result + ' ' + r.result6r
                    }`,
                  ''
                )
                : '--',
            // "6rValue"儲存6r原始資料
            '6rValue': SixR,
            risk: !project.isComplete
              ? '--'
              : project.scores && quartile
                ? this.$translate.instant(
                  this.quartile?.getColorAndI18nAndLevels(
                    project.scores,
                    EQuestionSectionId.RISK
                  ).levelI18n as string
                )
                : '--',
            // "riskValue"儲存risk規格化分數
            riskValue:
              project.scores?.find(
                score => score.sectionId === EQuestionSectionId.RISK
              )?.originalRegular ?? '',
            business: !project.isComplete
              ? '--'
              : project.scores && quartile
                ? this.$translate.instant(
                  this.quartile?.getColorAndI18nAndLevels(
                    project.scores,
                    EQuestionSectionId.BUSINESS
                  ).levelI18n as string
                )
                : '--',
            // "businessValue"儲存business規格化分數
            businessValue:
              project.scores?.find(
                score => score.sectionId === EQuestionSectionId.BUSINESS
              )?.originalRegular ?? '',
            technical: !project.isComplete
              ? '--'
              : project.scores && quartile
                ? this.$translate.instant(
                  this.quartile?.getColorAndI18nAndLevels(
                    project.scores,
                    EQuestionSectionId.TECH
                  ).levelI18n as string
                )
                : '--',
            // "technicalValue"儲存technical規格化分數
            technicalValue:
              project.scores?.find(
                score => score.sectionId === EQuestionSectionId.TECH
              )?.originalRegular ?? '',
            wave: project.result ? project.result.waveLevel : '',
            waveScore: project.result ? project.result.waveScore : '',
            lastEditor: project.editor ? project.editor.userName : '',
            lastEditTime: project.editor.editDate,
            tenantCn: project.tenantCn,
            tenantId: project.tenantId,
          },
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastEditTime).getTime() -
          new Date(a.lastEditTime).getTime()
      );
    /**
     * 如果該欄項是選單，用值 mapping options中的字串 */
    function mappingValueDisplay(
      answerContainer: {
        [key: string]: string | number | null | (string | number | null)[];
      },
      project: IProject
    ) {
      QuestionMap.forEach((question, key) => {
        if (project.answers[key]) {
          const Options =
            question.type === 'multiselect' || question.type === 'select'
              ? QuestionMap.get(key)!.options
              : undefined;
          const AnswerValue =
            question.type === 'multiselect'
              ? project.answers[key].value
              : project.answers[key].value !== null
                ? project.answers[key].value![0]
                : null;
          answerContainer[key] = Options
            ? question.type === 'multiselect'
              ? Options.filter(
                option =>
                  (AnswerValue as number[])?.some(
                    value => value === option.value
                  )
              )
                .map(option => option.label)
                .join('，')
              : (Options.find(option => option.value === AnswerValue)
                ?.label as string)
            : AnswerValue;
        }
      });
    }
  }

  /** 獲得 相同className的最後一個欄位 */
  private getClassNameField(
    className: string,
    questionTem: IQuestion
  ): { key: string; field: IField } | undefined {
    let result: { key: string; field: IField } | undefined;
    questionTem.groups.forEach(group =>
      Object.entries(group.questions).forEach(([key, field]) => {
        if (field.className === className) {
          result = { key, field };
        }
      })
    );
    return result;
  }

  /** 搜尋事件 */
  public filter(keyword: string) {
    this.searchSubject.next(keyword);
  }

  /** 套用設定 */
  public applyTableSetting(): void {
    if (this.tableConfigs) {
      const topScrollBar = this.configForm.get('topScrollBar')?.value
      const pageSize = this.configForm.get('pageSize')?.value;
      const pagination = this.configForm.get('pagination')?.value;
      this.tableConfigs = {
        ...this.tableConfigs,
        hideTopScrollBar: !topScrollBar,
        hasRowSelection: !!(this.configForm.get('rowSelections')?.value),
        pageSize: pagination ? pageSize : undefined
      };
    };
  }

  /** 設置 dataTable */
  private setDataTableConfig(
    Template: IQuestion,
    projectList: IProject[],
    quartile: IQuartileCheckList
  ): void {
    Template.groups = Template.groups.sort(
      (a, b) => a.groupOrder - b.groupOrder
    );
    const CurrentLang = this.$translate.currentLang;
    this.tableConfigs = {
      rowKeyName: 'projectId',
      countLabel: this.$translate.instant('project.table-count-label'),
      i18n: CurrentLang,
      // hasRowSelection: true,
      // pageSize: 9,
      columnConfigs: [
        {
          code: 'apName',
          desCode: 'apId',
          label: this.$translate.instant('project.table-app-name'),
          inSearch: true,
          fixedWidth: '240px',
          font: {
            size: '1rem',
            weight: 500,
          },
        },
        {
          code: '6r',
          label: this.$translate.instant('project.table-6r'),
          hasFilter: true,
          fontMulti: source => {
            const Values = `${source}`.split(' ');
            return Values.map(value => ({
              value: value,
              size: '1rem',
              color: sixRColorMap.get(value as ISixRName),
              weight: 500,
            }));
          },
          filterConfig: {
            isFuzzyFilter: true,
            customFilterOptions: projectList.reduce(
              (options: string[], project: IProject) => {
                let system6r = project.result?.system6r ?? [{ result6r: '--' }];
                system6r = system6r.map(r => ({
                  result6r: r.result6r === 'TBD' ? '--' : r.result6r,
                }));
                return [
                  ...options,
                  ...system6r
                    .filter(r => !options.some(option => r.result6r === option))
                    .map(r => r.result6r),
                ];
              },
              []
            ),
          },
          iconTooltip: {
            type: 'warn',
            text: this.$translate.instant('project.6r-no-value'),
            showExpression: (row: ITableData) => {
              return row['6rValue'] === 'TBD';
            },
          },
        },
        {
          code: 'wave',
          label: this.$translate.instant('project.table-wave'),
          hasFilter: true,
          font: {
            size: '1rem',
            weight: 700,
          },
          tooltip: {
            textExpression: (row: ITableData) => {
              return (
                `${Math.floor((row['waveScore'] as number) * 10000)}` ?? ''
              );
            },
            showExpression: (value: string | number) => {
              return !!value;
            },
          },
        },
        // {
        //   code: 'business',
        //   label: this.$translate.instant('project.table-biz-impact'),
        //   hasFilter: true,
        //   font: {
        //     size: '1rem',
        //     color: (value: string | number) =>
        //       quartile
        //         ? value === this.$translate.instant('questions.high')
        //           ? quartile.riskLevelQuartile[0].color
        //           : value === this.$translate.instant('questions.high-medium')
        //             ? quartile.riskLevelQuartile[1].color
        //             : value === this.$translate.instant('questions.low-medium')
        //               ? quartile.riskLevelQuartile[2].color
        //               : value === this.$translate.instant('questions.low')
        //                 ? quartile.riskLevelQuartile[3].color
        //                 : ''
        //         : '',
        //     weight: 700,
        //   },
        //   tooltip: {
        //     textExpression: (row: ITableData) => {
        //       return `${row['businessValue']}`;
        //     },
        //     showExpression: (value: string | number) => {
        //       return value !== '--' && !!value;
        //     },
        //   },
        // },
        {
          code: 'technical',
          label: this.$translate.instant('project.table-tech-cost'),
          hasFilter: true,
          font: {
            size: '1rem',
            color: (value: string | number) =>
              quartile
                ? value === this.$translate.instant('questions.high')
                  ? quartile.riskLevelQuartile[3].color
                  : value === this.$translate.instant('questions.high-medium')
                    ? quartile.riskLevelQuartile[2].color
                    : value === this.$translate.instant('questions.low-medium')
                      ? quartile.riskLevelQuartile[1].color
                      : value === this.$translate.instant('questions.low')
                        ? quartile.riskLevelQuartile[0].color
                        : ''
                : '',
            weight: 700,
          },
          tooltip: {
            textExpression: (row: ITableData) => {
              return `${row['technicalValue']}`;
            },
            showExpression: (value: string | number) => {
              return value !== '--' && !!value;
            },
          },
        },
        {
          code: 'risk',
          label: this.$translate.instant('project.table-risk-level'),
          hasFilter: true,
          font: {
            size: '1rem',
            color: (value: string | number) =>
              quartile
                ? value === this.$translate.instant('questions.high')
                  ? quartile.riskLevelQuartile[3].color
                  : value === this.$translate.instant('questions.high-medium')
                    ? quartile.riskLevelQuartile[2].color
                    : value === this.$translate.instant('questions.low-medium')
                      ? quartile.riskLevelQuartile[1].color
                      : value === this.$translate.instant('questions.low')
                        ? quartile.riskLevelQuartile[0].color
                        : ''
                : '',
            weight: 700,
          },
          tooltip: {
            textExpression: (row: ITableData) => {
              return `${row['riskValue']}` ?? '';
            },
            showExpression: (value: string | number) => {
              return value !== '--' && !!value;
            },
          },
        },
        ...(this.tenantOptions.length > 1
          ? [
            {
              code: 'tenantCn',
              label: this.$translate.instant('project.table-tenant-name'),
              hasFilter: true,
            },
          ]
          : []),
      ],
    };
    Object.entries(Template.groups[0].questions).forEach(([key, value]) => {
      if (value.className === 'ap-name') {
        // apName移除，因為已經在上面設定了
        delete Template.groups[0].questions[key];
      }
      if (value.className === 'ap-id') {
        // apId移除，因為不需要顯示這個欄位
        delete Template.groups[0].questions[key];
      }
    });
    /** 由 questionTemplate 生成 columnConfigs */
    Template.groups
      .sort((a, b) => a.groupOrder - b.groupOrder)
      .forEach(group =>
        Object.entries(group.questions)
          .sort((a, b) => a[1].questionOrder - b[1].questionOrder)
          .forEach(([key, field], index) => {
            if (field.config?.list?.enable) {
              this.tableConfigs?.columnConfigs.push({
                ...{
                  code: key,
                  label:
                    CurrentLang === 'en'
                      ? field.shortTitleEN
                      : field.shortTitleCN,
                  filterConfig:
                    field.type === 'multiselect'
                      ? this.getFilterConfig(key, projectList, field)
                      : undefined,
                },
                ...this.removeNullUndefinedProps(field.config.list),
              });
            }
          })
      );

    // 在最後一欄插入 最後編輯者 欄位
    [
      {
        code: 'lastEditor',
        label: this.$translate.instant('project.table-last-editor'),
        hasFilter: true,
      },
      {
        code: 'lastEditTime',
        label: this.$translate.instant('project.table-last-edit-time'),
      },
    ].forEach(column => {
      this.tableConfigs?.columnConfigs.push(column);
    });
  }

  /** 移除物件中值為null或undefined的屬性 */
  private removeNullUndefinedProps(obj: Object): Object {
    return Object.entries(obj).reduce((result, [key, value]) => {
      if (value !== null && value !== undefined) {
        (result as any)[key] = value;
      }
      return result;
    }, {});
  }

  /** 獲得 屬性filterConfig的值
   * @param key 欄位key  */
  private getFilterConfig(
    key: string,
    projectList: IProject[],
    field: IField
  ): {
    customFilterOptions: any;
    isFuzzyFilter: boolean;
  } {
    let result = {
      customFilterOptions: projectList.reduce(
        (filterOptions: string[], project: IProject, index) => {
          return [
            ...filterOptions,
            ...(project.answers[key]
              ? (project.answers[key].value as number[])
                .filter(
                  answerValue =>
                    !filterOptions.some(
                      filterOption =>
                        filterOption ===
                        field.options!.find(
                          option => option.value === answerValue
                        )?.label
                    )
                )
                .map(
                  answer =>
                    field.options!.find(option => option.value === answer)
                      ?.label ?? ''
                )
              : [`${this.$translate.instant('project.column-no-value')}`]),
          ];
        },
        []
      ),
      isFuzzyFilter: true,
    };
    result.customFilterOptions = this.getUniArray(result.customFilterOptions);
    return result;
  }

  /** 獲得 每個項不重複的字串Array */
  private getUniArray(array: string[]): string[] {
    return array.reduce((accumulator: string[], currentValue) => {
      if (!accumulator.includes(currentValue)) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
  }

  /** 6r排序 */
  private sort6R(dataGroup: ISystem6Rs[]): ISystem6Rs[] {
    const container: ISystem6Rs[] = [];
    let all = sixRColorMap.keys();
    for (const r of all) {
      dataGroup.forEach(data => {
        if (data.result6r === r) {
          container.push(data);
        }
      });
    }
    return container;
  }

  private subscribeConfigForm(): void {
    this.configForm.get('pagination')?.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      if (!!value) {
        this.configForm.get('pageSize')?.enable();
      } else {
        this.configForm.get('pageSize')?.disable();
      };
    });
  }
}
