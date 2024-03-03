import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewChild,
  AfterViewInit,
  HostListener,
  SimpleChanges,
  Renderer2,
} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, take, timer} from 'rxjs';
import {IColorString} from '@utilities/interface/common.interface';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {animate, style, transition, trigger} from '@angular/animations';
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('upInCompressOut', [
      transition(':enter', [
        style({opacity: 0, transform: 'translate(0%, 10%)'}),
        animate(
          '300ms ease-in-out',
          style({opacity: 1, transform: 'translate(0, 0)'})
        ),
      ]),
      transition(':leave', [
        style({opacity: 1, transform: 'scale(100%, 100%)'}),
        animate('0ms', style({opacity: 0, transform: 'scale(90%, 100%)'})),
      ]),
    ]),
  ],
})
export class DataTableComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild('tTrack') tTrack?: ElementRef<HTMLElement>;
  @ViewChild('tThumb') tThumb?: ElementRef<HTMLElement>;
  @ViewChild('tScrollContainer', {static: true})
  tScrollContainer?: ElementRef<HTMLElement>;
  @ViewChild('tTableContainer', {static: true})
  tTableContainer?: ElementRef<HTMLElement>;
  @ViewChild('tBody', {static: true}) tBody?: ElementRef<HTMLElement>;
  @ViewChild('tFrontShadow') tFrontShadow?: ElementRef<HTMLElement>;
  @ViewChildren('tFilterCheckboxes') tFilterCheckboxes?: QueryList<ElementRef>;
  @ViewChildren('tSortButtons') tSortButtons?: QueryList<ElementRef>;
  @ViewChildren('tTdTrs') tTdTrs?: QueryList<ElementRef>;
  @ViewChildren('tThs') tThs?: QueryList<ElementRef>;
  @ViewChild('tSelectAll') tSelectAll?: ElementRef<HTMLInputElement>;
  @Output() rowClick = new EventEmitter<string | number>();
  @Output() viewReady = new EventEmitter<void>();
  @Output() filterValued = new EventEmitter<boolean>();
  @Output() selectDate = new EventEmitter<IDatePickerResult>();
  @Output() cancel = new EventEmitter<void>();
  /** 所有被選取的 row 的 key */
  @Output() rowsSelect = new EventEmitter<(string | number)[]>();
  /** 此table名稱 - 分辨storage用 */
  @Input() tableName = '';
  @Input() currentPageIndex = 0;
  @Input() noDataWarn = '';
  @Input() noDataImgUrl = '';
  /** 是否維持之前的filter&sort狀態 */
  @Input() keepFilter = false;
  @Input() search$: Observable<string> = new Observable();
  @Input() resetTable$: Observable<void> = new Observable();
  @Input() resetTableData$: Observable<void> = new Observable();
  @Input() data: ITableData[] = [];
  /** 第一個是否為新資料 */
  @Input() isFirstRowNew = false;
  @Input() config?: ITableConfig;
  /** 是否隱藏內建的無資料畫面 */
  @Input() hideNoData = false;

  /** 畫面顯示的 rows */
  get getDisplayRows(): ITableRow[] {
    const displayRows = this.rowsChunk.slice(0, this.currentChunk);
  return this.config?.pageSize === undefined ? displayRows.reduce((total, chunk) => [...total, ...chunk], []) : this.rowsChunk[this.currentPageIndex];
  }
  constructor(
    private self: ElementRef,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  private rows: ITableRow[] = [];
  public rowsBeforeChunk: ITableRow[] = [];
  /** 已分區塊的rows */
  public rowsChunk: ITableRow[][] = [];
  /** 標頭欄位相關設定 */
  public headColumns: IColumnConfigView[] = [];
  /** 目前Loading區塊 */
  private currentChunk = 1;
  /** 搜尋文字 */
  public searchText = '';
  /** 選取的過濾項目集合 */
  public filterCollection: {[key: string]: IFilterCollectionOption[]} = {};
  /** 被選取的 row 的 key 集合 */
  public rowCollection: (string | number)[] = [];
  /** dataTable 內存在的 overlay 數量 */
  public overlayCount = 0;
  private noSearchSetting = false;
  public isAllRowsSelect = false;
  public sortConfig?: {sortCode: string; columnCode: string};
  public contentWidth = 0; // 内容區域的寬度
  public trackWidth = 0; // scroll軌道的寬度
  public thumbWidth = 0; // scroll bar的寬度
  public thumbTransform = `translateX(0px)`; // scroll bar的 transform 屬性值
  /** rows 更新事件 */
  public rowsResetSubject = new BehaviorSubject<{
    data: ITableData[];
    config: ITableConfig;
    searchText: string;
    filters: {[key: string]: IFilterCollectionOption[]};
  }>({
    data: [],
    config: {rowKeyName: '', columnConfigs: []},
    searchText: '',
    filters: {},
  });
  private rowsReset$ = this.rowsResetSubject.asObservable();
  private subscription = new Subscription();
  /** 不觸發lazy loading 的狀態 */
  public isLoading = false;
  private resizeObserver?: ResizeObserver;
  public showBackdrop = false;
  /** 畫面使用的文字 */
  public text = {
    sort: '排序條件',
    filter: '篩選條件',
    all: '全選',
    clear: '清除',
    null: '無資料',
    showCount: '總數量',
    noRowsWarn: '目前尚無資料',
    loading: '加載中...',
  };
  /** 翻譯庫 */
  public i18nLib = {
    en: {
      sort: 'Sort',
      filter: 'Filter',
      all: 'SelectAll',
      clear: 'Clear',
      null: 'No data',
      showCount: 'display count',
      noRowsWarn: 'Currently no data available',
      loading: 'Loading...',
    },
    zh: {
      sort: '排序條件',
      filter: '篩選條件',
      all: '全選',
      clear: '清除',
      null: '無資料',
      showCount: '總數量',
      noRowsWarn: '目前尚無資料',
      loading: '加載中...',
    },
  };

  ngOnInit(): void {
    const DataReset = this.resetTableData$.subscribe(_ => {
      this.rowsChunk = JSON.parse(JSON.stringify(this.rowsChunk));
    });
    const RowsReset = this.rowsReset$.subscribe(({config}) => {
      this.rowsChunk = this.chunkRows(
        this.getRowsSorted(
          this.getRowFiltered(
            this.getRowSearched(this.rows, this.searchText),
            this.filterCollection
          ),
          this.sortConfig
        ),
        this.config?.pageSize
      );
      const FilterValued = this.isFilterValued();
      this.filterValued.emit(FilterValued);
      this.storeOrClearFilter(!FilterValued);
      timer(1000).pipe(take(1)).subscribe(() => this.setFrontShadowHeight());
    });
    const Search = this.search$.subscribe(text => {
      this.searchText = text;
      this.isAllRowsSelect = false;
      if (this.tSelectAll) {
        this.tSelectAll.nativeElement.checked = false;
      }
      if (this.data && this.config) {
        this.initFilterCollection(
          this.data,
          this.config,
          this.filterCollection
        ); // 搜尋時過濾需重置
        this.resetSortAndFilter(this.tFilterCheckboxes);
        this.rowsResetSubject.next({
          data: this.data,
          config: this.config,
          searchText: this.searchText,
          filters: this.filterCollection,
        });
      }
    });
    const TableReset = this.resetTable$.subscribe(() => {
      this.searchText = '';
      this.isAllRowsSelect = false;
      if (this.tSelectAll) {
        this.tSelectAll.nativeElement.checked = false;
      }
      if (this.data && this.config) {
        this.initFilterCollection(
          this.data,
          this.config,
          this.filterCollection
        );
        this.resetSortAndFilter(this.tFilterCheckboxes, this.tSortButtons);
        this.rowsResetSubject.next({
          data: this.data,
          config: this.config,
          searchText: this.searchText,
          filters: this.filterCollection,
        });
      }
    });
    this.subscription.add(TableReset);
    this.subscription.add(RowsReset);
    this.subscription.add(Search);
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entires => {
      this.initScrollBar();
    });
    this.resizeObserver.observe(this.tScrollContainer!.nativeElement);
    this.initScrollBar();
    this.viewReady.emit();
    this.setFrontShadowHeight();
  }

  ngOnChanges({data, config}: SimpleChanges): void {
    if (
      (this.data || (data && data.currentValue)) ||
      (this.config || (config && config.currentValue))
    ) {
      const Data = this.data ?? (data.currentValue as ITableData[]);
      const Config = this.config ?? (config.currentValue as ITableConfig);
      this.initByConfig(Config);
      if (Config.i18n) {
        this.translateText(this.text, Config.i18n, this.i18nLib);
      }
      const StoredFilter = sessionStorage.getItem(`${this.tableName}-filter`);
      if (this.keepFilter && StoredFilter) {
        this.revertFilter(StoredFilter);
      } else {
        this.initFilterCollection(Data, Config!, this.filterCollection);
      };
      this.rows = this.getRows(Data, Config); // rows 只有 Input 資料有更新時才重新計算
      this.noSearchSetting = !this.rows.some(row =>
        row.columns.some(col => col.inSearch)
      );
      this.headColumns = this.getHeadColumns(Data, Config, StoredFilter);
      this.rowsResetSubject.next({
        data: Data,
        config: Config,
        searchText: this.searchText,
        filters: this.filterCollection,
      });
      timer(1000).pipe(take(1)).subscribe(() => this.setFrontShadowHeight());
    };
  }

  @HostListener('window:resize', ['$event']) onWindowResize(event: Event) {
    this.initScrollBar();
  }

  public onSelectDate({date, rowKey}: IDatePickerResult): void {
    this.selectDate.emit({date, rowKey});
    timer(100).pipe(take(1)).subscribe(() => {
      this.showBackdrop = false;
      // 點擊事件結束後再開啟 row click 功能
    });
  }

  public onShowCalendar(show: boolean): void {
    if (show) {
      this.showBackdrop = true;
    };
  }

  public closeOverlay(): void {
    this.showBackdrop = false;
  }

  public cancelCalendar(): void {
    this.showBackdrop = false;
    timer(100).pipe(take(1)).subscribe(() => (this.overlayCount = this.overlayCount - 1));// 點擊事件結束後再開啟 row click 功能
  }

  private initScrollBar(): void {
    timer(500).pipe(take(1)).subscribe(() => {
      if (this.tTrack && this.tThumb) {
        this.contentWidth =
          this.tTableContainer!.nativeElement.scrollWidth - 15;
        this.trackWidth =
          this.tTableContainer!.nativeElement.clientWidth - 15 ?? 0;
        this.tTrack.nativeElement.style.width = `${this.trackWidth}px`;
        this.thumbWidth = Math.max(
          this.trackWidth * (this.trackWidth / this.contentWidth),
          20
        );
        this.tThumb!.nativeElement.style.width = `${this.thumbWidth}px`;
        timer(200).pipe(take(1)).subscribe(() => {
          this.renderer.addClass(
            this.tThumb!.nativeElement,
            this.thumbWidth === this.trackWidth ? 'd-none' : 'd-flex'
          );
          this.renderer.removeClass(
            this.tThumb!.nativeElement,
            this.thumbWidth === this.trackWidth ? 'd-flex' : 'd-none'
          );
          this.renderer.addClass(
            this.tTrack!.nativeElement,
            this.thumbWidth === this.trackWidth ? 'd-none' : 'd-flex'
          );
          this.renderer.removeClass(
            this.tTrack!.nativeElement,
            this.thumbWidth === this.trackWidth ? 'd-flex' : 'd-none'
          );
          this.renderer.removeClass(this.tThumb!.nativeElement, 'opacity-0');
          this.renderer.removeClass(this.tTrack!.nativeElement, 'opacity-0');
        });
      }
    });
  }

  /** custom scroll */
  public startScroll(startEvent: MouseEvent): void {
    startEvent.preventDefault();
    if (this.tTrack) {
      const Thumb = this.tThumb!.nativeElement;
      const Track = this.tTrack.nativeElement;
      const Content = this.tTableContainer!.nativeElement;
      const StartX = startEvent.clientX - Thumb.getBoundingClientRect().left;
      const mousemoveListener = (moveEvent: MouseEvent) => {
        const scrollLeft =
          (moveEvent.clientX - Track.getBoundingClientRect().left - StartX) *
          (this.contentWidth / Track.clientWidth);
        Content.scrollLeft = scrollLeft;
        const TranslateX = scrollLeft * (Track.clientWidth / this.contentWidth);
        this.thumbTransform = `translateX(${
          TranslateX < 0
            ? 0
            : TranslateX > this.trackWidth - this.thumbWidth
              ? this.trackWidth - this.thumbWidth
              : TranslateX
        }px)`;
      };
      const mouseupListener = () => {
        document.removeEventListener('mousemove', mousemoveListener);
        document.removeEventListener('mouseup', mouseupListener);
      };
      document.addEventListener('mousemove', mousemoveListener);
      document.addEventListener('mouseup', mouseupListener);
    }
  }

  /** 顯示sort icon */
  public showSortIcon(column: IColumnConfigView): boolean {
    return !!this.sortConfig && this.sortConfig.columnCode === column.code;
  }

  /** 此欄是否有過濾選項啟用 */
  public hasOptionsModified(column: IColumnConfigView): boolean {
    return !!column.filterOptions?.find(option => !option.checked);
  }

  /** 換頁 */
  public pageChange(index: number): void {
    this.currentPageIndex = index;
  }

  /** 該欄過濾選項 全選/全不選
   * @param isCheck true 為全選; false 為全不選
   * @param column 該欄
   * @param filterNode 該欄 filter 畫面物件 */
  public checkAll(
    isCheck: boolean,
    column: IColumnConfigView,
    filterNode: HTMLElement,
    headerIndex: number
  ): void {
    this.filterCollection[column.code] = column.filterOptions?.map(option => ({
      name: option.name,
      checked: isCheck,
    }))!;
    this.headColumns[headerIndex].filterOptions = this.headColumns[
      headerIndex
    ].filterOptions?.map(({name}) => ({name, checked: isCheck}));
    this.rowsResetSubject.next({
      data: this.data,
      config: this.config!,
      searchText: this.searchText,
      filters: this.filterCollection,
    });
    (
      filterNode.querySelectorAll(
        'input[type="checkbox"]'
      ) as NodeListOf<HTMLInputElement>
    ).forEach(checkbox => (checkbox.checked = isCheck));
  }

  /** rows 全選/全不選
   * @param rows 過濾/搜尋後的 rows
   * @param keyCollection 選取的 row 的 key 的容器 */
  public selectAllRows(
    event: Event,
    TableNode: HTMLElement,
    rows: ITableRow[]
  ): void {
    const Checkboxes = TableNode.querySelector('tbody')?.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>;
    const isCheck = (event.target as HTMLInputElement).checked;
    this.isAllRowsSelect = isCheck;
    Checkboxes?.forEach(checkbox => (checkbox.checked = isCheck));
    this.rowCollection = isCheck ? rows.map(row => row.key) : [];
    this.rowsSelect.emit(this.rowCollection);
  }

  /** rows 單選/單不選
   * @param keySelected 選取的 row 的 key
   * @param keyCollection 選取的 row 的 key 的容器 */
  public selectRow(event: Event, RowSelected: ITableRow): void {
    if ((event.target as HTMLInputElement).checked) {
      this.rowCollection.push(RowSelected.key);
    } else {
      this.rowCollection = this.rowCollection.filter(
        key => RowSelected.key !== key
      );
    }
    this.rowsSelect.emit(this.rowCollection);
  }

  /** 由點擊事件蒐集過濾選項
   * @param event 點擊事件
   * @param targetName 該選項名稱
   * @param code 該欄位code
   * @param collection 蒐集的容器 */
  public collectFilterOption(
    event: Event,
    targetName: string,
    code: string,
    collection: {[key: string]: IFilterCollectionOption[]},
    headerIndex: number
  ): void {
    const IsChecked = (event.target as HTMLInputElement)?.checked;
    this.headColumns[headerIndex]!.filterOptions!.find(
      option => option.name === targetName
    )!.checked = IsChecked;
    collection[code].find(option => option.name === targetName)!.checked =
      IsChecked;
    this.rowsResetSubject.next({
      data: this.data,
      config: this.config!,
      searchText: this.searchText,
      filters: this.filterCollection,
    });
  }

  public scroll(event: Event): void {
    // table與scroll bar連動
    if (this.tTrack) {
      const Content = this.tTableContainer!.nativeElement;
      const Track = this.tTrack.nativeElement;
      this.thumbTransform = `translateX(${
        Content.scrollLeft / (this.contentWidth / Track.clientWidth)
      }px)`;
    }
    // infinity scroll
    const {scrollHeight, scrollTop, clientHeight} = event.target as HTMLElement;
    if (
      this.config?.pageSize === undefined &&
      scrollHeight - scrollTop < clientHeight + 30 &&
      this.getDisplayRows.length < this.rowsBeforeChunk.length
    ) {
      if (!this.isLoading) {
        if (scrollHeight - scrollTop - clientHeight === 0) {
          this.isLoading = true;
        }
        this.loadMore();
        timer(1000).pipe(take(1)).subscribe(() => this.setFrontShadowHeight());
      }
    } else {
      this.isLoading = false;
    }
  }

  /** 排序
   * @param columnCode 欄code
   * @param sortCode 'asc':升冪 'desc':降冪 */
  public sort(columnCode: string, sortCode: string): void {
    this.sortConfig = {columnCode, sortCode};
    this.rowsResetSubject.next({
      data: this.data,
      config: this.config!,
      searchText: this.searchText,
      filters: this.filterCollection,
    });
  }

  private loadMore() {
    this.isLoading = true;
    this.currentChunk = this.currentChunk + 1;
    this.isLoading = false;
  }

  /** 將 row 以數個基數為一組
   * @param per 基數 */
  private chunkRows(rows: ITableRow[], per = 15): ITableRow[][] {
    this.rowsBeforeChunk = rows.filter(row => row.show);
    const Chunk = [];
    for (let i = 0; i <= this.rowsBeforeChunk.length; i = i + per) {
      Chunk.push(this.rowsBeforeChunk.slice(i, i + per));
    }
    return Chunk;
  }

  /** 獲得所有 row */
  private getRows(data: ITableData[], config: ITableConfig): ITableRow[] {
    return data.map((valueObject, index) => ({
      key: valueObject[config!.rowKeyName] as string | number,
      show: true,
      columns: config.columnConfigs.map(columnConfig => {
        let tooltipObject: any = {
          tooltip: {backgroundColor: columnConfig.tooltip?.backgroundColor},
        };
        if (
          columnConfig.tooltip &&
          typeof columnConfig.tooltip.textExpression === 'function'
        ) {
          if (typeof columnConfig.tooltip.textExpression === 'function') {
            tooltipObject.tooltip!['textExpression'] =
              columnConfig.tooltip.textExpression(valueObject);
          }
          if (typeof columnConfig.tooltip.showExpression === 'function') {
            tooltipObject.tooltip!['showExpression'] =
              columnConfig.tooltip.showExpression(
                valueObject[columnConfig.code] as string | number
              );
          }
        };

        let iconTooltip: any = {iconTooltip: {}};
        if (columnConfig.iconTooltip) {
          iconTooltip.iconTooltip!['showExpression'] =
            typeof columnConfig.iconTooltip.showExpression === 'function'
              ? columnConfig.iconTooltip.showExpression(valueObject)
              : columnConfig.iconTooltip;
          iconTooltip.iconTooltip!['type'] = columnConfig.iconTooltip.type;
          iconTooltip.iconTooltip!['text'] = columnConfig.iconTooltip.text;
        }
        let font: any = {font: {}};
        if (columnConfig.font) {
          if (typeof columnConfig.font.color) {
            font.font!['color'] =
              typeof columnConfig.font.color === 'function'
                ? columnConfig.font.color(
                    valueObject[columnConfig.code] as string | number
                  )
                : columnConfig.font.color;
          }
          if (columnConfig.font?.size) {
            font.font!['size'] = columnConfig.font.size;
          }
          if (columnConfig.font?.weight) {
            font.font!['weight'] = columnConfig.font.weight;
          }
        }
        let fontMultiObject: any = {fontMulti: []};
        if (
          columnConfig.fontMulti &&
          typeof columnConfig.fontMulti === 'function'
        ) {
          fontMultiObject.fontMulti = columnConfig.fontMulti(
            valueObject[columnConfig.code] as string | number
          )!;
        }
        let customTempObject: any = {customTemplate: null};
        if (
          columnConfig.customTemplate &&
          typeof columnConfig.customTemplate === 'function'
        ) {
          customTempObject.customTemplate = columnConfig.customTemplate(
            valueObject[columnConfig.code]
          );
        };

        return {
          ...columnConfig,
          ...{
            value: valueObject[columnConfig.code],
            ...(columnConfig.desCode
              ? {valueDes: valueObject[columnConfig.desCode]}
              : {}),
            ...(columnConfig.tooltip?.textExpression ? tooltipObject : {}),
            ...(iconTooltip.iconTooltip.text ? iconTooltip : {}),
            ...(Object.values(font.font).length > 0 ? font : {}),
            ...(customTempObject.customTemplate ? customTempObject : {}),
          },
        };
      }),
    }));
  }

  /** 獲得排序後的 rows
   * @param sort 排序設定 */
  private getRowsSorted(
    rows: ITableRow[],
    sort?: {columnCode: string; sortCode: string}
  ): ITableRow[] {
    return sort
      ? rows.sort((a, b) => {
          const Current = a.columns.find(
            column => column.code === sort.columnCode
          ) as ITableColumn;
          const Next = b.columns.find(
            column => column.code === sort.columnCode
          ) as ITableColumn;
          return `${Current.value || 0}` > `${Next.value || 0}`
            ? sort.sortCode === 'asc'
              ? 1
              : -1
            : `${Current.value || 0}` < `${Next.value || 0}`
              ? sort.sortCode === 'asc'
                ? -1
                : 1
              : 0;
        })
      : rows;
  }

  /** 獲得搜尋後的 rows
   * @ 如果沒有任何欄位設定 inSearch，讓第一個欄位成為 search 對象
   * @param searchText 搜尋的文字 */
  private getRowSearched(rows: ITableRow[], searchText: string): ITableRow[] {
    let currentRows = rows;
    if (!this.noSearchSetting) {
      currentRows = currentRows.map(row => {
        const IsSearched = row.columns.some(
          col =>
            col.inSearch &&
            (col.value ? `${col.value}` : '').includes(searchText)
        );
        return IsSearched
          ? row
          : {
              ...row,
              ...{show: false},
            };
      });
    }
    return currentRows;
  }

  /** 獲得過濾後的 rows
   * @param searchText 搜尋的文字
   * @param filters 已勾選的過濾項列表 */
  private getRowFiltered(
    rows: ITableRow[],
    filters: {[key: string]: IFilterCollectionOption[]}
  ): ITableRow[] {
    rows = rows.map(row => {
      const IsRowFiltered = Object.entries(filters).every(
        ([key, options], optionsIndex) => {
          const Column = row.columns.find(column => column.code === key);
          const IsColFiltered = options
            .filter(option => option.checked)
            .some(option => {
              return Column?.filterConfig?.isFuzzyFilter
                ? `${Column?.value ?? this.text.null}`.includes(option.name)
                : option.name ===
                    `${
                      Column?.value || Column?.value === 0
                        ? Column?.value
                        : this.text.null
                    }`;
            });
          return IsColFiltered;
        }
      );
      return IsRowFiltered
        ? row
        : {
            ...row,
            ...{show: false},
          };
    });
    return rows;
  }

  /** 獲得所有標頭欄資料
   * @ 計算每個 row 的該欄統整不同的值生成過濾選項
   * @ null 的選項顯示為"無資料" */
  private getHeadColumns(
    data: ITableData[],
    config: ITableConfig,
    hasStoredFilter: any
  ): IColumnConfigView[] {
    if (this.keepFilter && hasStoredFilter) {
      return config.columnConfigs.map((columnConfig, index) => {
        return {
          ...columnConfig,
          ...{
            filterOptions: this.filterCollection[columnConfig.code],
          },
        };
      });
    } else {
      return config.columnConfigs.map(columnConfig => {
        return {
          ...columnConfig,
          ...{
            filterOptions: columnConfig.hasFilter
              ? columnConfig.filterConfig?.customFilterOptions?.map(name => ({
                  name,
                  checked: true,
                })) ||
                data
                  .reduce(
                    (
                      options: {name: string; checked: boolean}[],
                      valueObject
                    ) => {
                      const Target = `${
                        !!valueObject[columnConfig.code]
                          ? valueObject[columnConfig.code]
                          : this.text.null
                      }`;
                      if (!options.some(option => option.name === Target)) {
                        options.push({
                          name: Target,
                          checked: true,
                        });
                      }
                      return options;
                    },
                    []
                  )
                  .sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                  )
              : [],
          },
          ...(columnConfig.headerConfig
            ? {headerConfig: columnConfig.headerConfig}
            : {}),
        };
      });
    }
  }

  /** 初始化過濾選項容器
   * @ 只建立 hasMultiFilterOption === true 的欄位
   * @param data 所有 row 資料
   * @param config table 總設定
   * @param collection 過濾選項容器 */
  private initFilterCollection(
    data: ITableData[],
    config: ITableConfig,
    collection: {[key: string]: {name: string; checked: boolean}[]}
  ): void {
    config.columnConfigs.forEach(columnConfig => {
      if (columnConfig.hasFilter) {
        collection[columnConfig.code] = columnConfig.hasFilter
          ? columnConfig.filterConfig?.customFilterOptions?.map(name => ({
              name: name,
              checked: true,
            })) ||
            data
              .reduce(
                (options: {name: string; checked: boolean}[], valueObject) => {
                  const Target = `${
                    !!valueObject[columnConfig.code]
                      ? valueObject[columnConfig.code]
                      : this.text.null
                  }`;
                  if (!options.some(option => option.name === Target)) {
                    options.push({
                      name: Target,
                      checked: true,
                    });
                  }
                  return options;
                },
                []
              )
              .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
          : [];
      }
    });
  }

  /** 依照語言置換畫面文字
   * @param texts 畫面使用文字
   * @param i18nCode 語言code ex. 'en' 'zh'
   * @param i18nLib 翻譯庫 */
  private translateText(
    texts: {[key: string]: string},
    i18nCode = 'zh',
    i18nLib: {[key: string]: {[key: string]: string}}
  ): void {
    Object.keys(texts).forEach(key => {
      texts[key] = i18nLib[i18nCode][key];
    });
  }

  /** 依設定初始化 */
  private initByConfig(config: ITableConfig): void {
    if (config.themeColor) {
      this.self.nativeElement.style.setProperty(
        '--theme-color',
        config.themeColor
      );
    }
    if (config.color?.generalText) {
      this.self.nativeElement.style.setProperty(
        '--default-text',
        config.color?.generalText
      );
    }
    if (config.color?.headerText) {
      this.self.nativeElement.style.setProperty(
        '--default-header-text',
        config.color?.headerText
      );
    }
    if (config.font?.header) {
      this.self.nativeElement.style.setProperty(
        '--font-header',
        config.font?.header
      );
    }
    if (config.font?.column) {
      this.self.nativeElement.style.setProperty(
        '--font-Column',
        config.font?.column
      );
    }
    if (this.hideNoData) {
      this.renderer.setStyle(
        this.tScrollContainer?.nativeElement,
        'height',
        'auto'
      );
      this.renderer.setStyle(
        this.tScrollContainer?.nativeElement,
        'min-height',
        'unset'
      );
      this.renderer.setStyle(
        this.tTableContainer?.nativeElement,
        'height',
        'auto'
      );
      this.renderer.setStyle(
        this.tTableContainer?.nativeElement,
        'min-height',
        'unset'
      );
      this.renderer.setStyle(
        this.tTableContainer?.nativeElement,
        'overflow',
        'hidden'
      );
    }
  }

  /** 重置排序與過濾 */
  private resetSortAndFilter(
    checkboxNodes?: QueryList<ElementRef>,
    sortButtons?: QueryList<ElementRef>
  ): void {
    if (checkboxNodes) {
      checkboxNodes!.forEach(node => (node.nativeElement.checked = true));
    }
    if (sortButtons) {
      sortButtons.forEach(node => (node.nativeElement.checked = false));
    }
    this.headColumns = this.headColumns.map(col => ({
      ...col,
      ...{
        filterOptions: col.filterOptions?.map(option => ({
          name: option.name,
          checked: (option.checked = true),
        })),
      },
    }));
    this.sortConfig = undefined;
  }

  /** 消毒html */
  public getSafeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public getColor(
    value: string | number,
    color?: string | ((value: string | number) => string)
  ): IColorString {
    if (color && typeof color === 'function') {
      return color(value);
    } else {
      return color ? `${color}` : 'rgb(99, 93, 93)';
    }
  }

  /** 儲存/清除 排序跟過濾狀態 */
  private storeOrClearFilter(clear: boolean): void {
    if (clear) {
      sessionStorage.removeItem(`${this.tableName}-filter`);
    } else {
      const sortAndFilter = {
        sort: this.sortConfig,
        filter: this.filterCollection,
      };
      sessionStorage.setItem(
        `${this.tableName}-filter`,
        JSON.stringify(sortAndFilter)
      );
    }
  }

  /** 回復之前的排序跟過濾狀態 */
  private revertFilter(storedFilter: any): void {
    if (storedFilter) {
      const {sort, filter} = JSON.parse(storedFilter);
      this.filterCollection = filter;
      this.sortConfig = sort;
    }
  }

  /** filter是否有值 */
  private isFilterValued(): boolean {
    return (
      Object.values(this.filterCollection).some(options =>
        options.some(option => !option.checked)
      ) || !!this.sortConfig
    );
  }

  public showFrontShadow(container: HTMLDivElement): boolean {
    return container ? container.scrollLeft > 5 : false;
  }

  public showEndShadow(container: HTMLDivElement): boolean {
    return container?
      (container.scrollWidth - container.clientWidth) - container.scrollLeft > 5
      : false;
  }

  public setAllSameOrderColumnsStyle(index: number): void {
    // this.renderer.setStyle(this.tThs?.get(index - 1)?.nativeElement, 'background', '#ededed');
    // this.tThs?.forEach(tr => {
    //   const targetTh = tr.nativeElement.querySelector(`th:nth-child(${index + 1})`) as HTMLElement;
    //   this.renderer.setStyle(targetTh, 'background', '#ededed');
    // });
    this.tTdTrs?.forEach(tr => {
      const targetTd = tr.nativeElement.querySelector(`td:nth-child(${index + 1})`) as HTMLElement;
      const tooltip = targetTd.querySelector('.hover-tooltip');
      this.renderer.setStyle(targetTd, 'background', '#FAFAFA');
      if (tooltip) {
        this.renderer.setStyle(tooltip, 'visibility', 'visible ');
        this.renderer.setStyle(tooltip, 'opacity', '1');
      };
    } );
  }

  public removeAllSameOrderColumnsStyle(index: number): void {
    // this.renderer.removeStyle(this.tThs?.get(index - 1)?.nativeElement, 'background');
    // this.tThs?.forEach(tr => {
    //   const targetTh = tr.nativeElement.querySelector(`th:nth-child(${index + 1})`) as HTMLElement;
    //   this.renderer.removeStyle(targetTh, 'background');
    // });
    this.tTdTrs?.forEach(tr => {
      const targetTd = tr.nativeElement.querySelector(`td:nth-child(${index + 1})`);
      const tooltip = targetTd.querySelector('.hover-tooltip');
      this.renderer.removeStyle(targetTd, 'background');
      if(tooltip) {
        this.renderer.setStyle(tooltip, 'visibility', 'hide');
        this.renderer.setStyle(tooltip, 'opacity', '0');
      };
    } );
  }

  public setFrontShadowHeight(): void {
    if (this.tFrontShadow) {
      this.renderer.setStyle(
        this.tFrontShadow?.nativeElement,
        'height',
        this.tBody?.nativeElement.clientHeight + 'px'
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

//=== ** Example * ===/

// Input() data = [
//   {
//     projectKey: 'xhgdjll46hk',
//     name: '皮ＸＸ',
//     gender: '男',
//   },
//   {
//     projectKey: 'khklj4j9pohugtds',
//     name: '還ＯＯ',
//     gender: '女',
//   },
//   {
//     projectKey: '46gkl;l4j9khgff78',
//     name: '衛ＯＯ',
//     gender: '男',
//   }
// ]
//
// Input() config = {
//   rowKeyName: 'projectKey',
//   maxHeight: '450px',
//   themeColor: 'red',
//   countLabel: '系統總數',
//   hasSort: true,
//   hasMultiFilterOption: true,
//   columnConfigs: [
//      {
//       code: 'name',
//       label: '姓名',
//       hasMultiFilterOption: true,
//      },
//      {
//       code: 'gender',
//       label: '性別',
//       hasMultiFilterOption: true,
//       fontColor: 'red',
//      },
//   ]
// }

//=== ** Interface * ===/

/** 總控制設定
 * @param rowKeyName 指定每筆資料的統一 key 名稱
 * @param {IColumnConfig[]} columnConfigs 每欄的設定
 * @param maxHeight (option) table最高高度
 * @param themeColor (option) 主題色
 * @param color (option) 自訂顏色 { headerText(option): 標頭字顏色; generalText(option): 一般字顏色}
 * @param countLabel (option) 總數文字描述
 * @param i18n (option) 目前語言
 * @param hasRowSelection (option) 是否開放 row 選擇欄位
 * @param hasSort (option) 是否開放排序功能
 * @param hasMultiFilterOption (option) 是否開放多選項過濾功能
 * @param font (option) 字型 { header(option): 標頭; column(option): 欄}
 * */
export interface ITableConfig {
  rowKeyName: string;
  columnConfigs: IColumnConfigView[];
  dataApi?: Observable<any[]>;
   /** 一頁最多幾個項目: undefined 為無分頁(無限滾動) */
  pageSize?: number;
  hideTopScrollBar?: boolean;
  maxHeight?: string;
  themeColor?: string;
  fontColor?: string;
  countLabel?: string;
  i18n?: string;
  hasRowSelection?: boolean;
  hasSort?: boolean;
  hasMultiFilterOption?: boolean;
  font?: {
    header?: string;
    column?: string;
  };
  color?: {
    headerText?: string;
    generalText?: string;
  };
}

export interface ITable {
  data: ITableData[];
  config: ITableConfig;
}

/** data物件
 * @key 該欄 key */
export interface ITableData {
  [key: string]: string | number | null | string[] | number[] | any;
}

/** 該欄控制設定
 * @param label 標頭欄位名稱
 * @param code 該欄對值的 key: 同 ITableData 裡屬於該欄的 key
 * @param desCode (option) 該欄第二行對值的 key: 同 ITableData 裡屬於該欄的 key
 * @param inSearch (option) 在搜尋範圍內 (default) true
 * @param hasFilter (option) 有多選項過濾功能 (default) true
 * @param filterConfig-customFilterOptions (option) 自訂過濾選項列表
 * @param filterConfig-isFuzzyFilter (option) 是否為模糊過濾
 * @param inform (option) 顯示(i)icon，hover時顯示一行說明
 * @param customFilterOptions (option) 自訂過濾選項列表
 * @param hasSort (option) 有排序功能 (default) true
 * @param customClass (option) customize classes ex. 'title1, text-red'
 * @param style (option) customize style string ex. 'color: red; width: 300px; font-size: 20px'
 * @param colorArray (option) 字顏色列表
 * @param fixedWidth (option) 固定寬度 ex. '30px' '20%'
 * @param fontColor (option) 字顏色
 * @param fontSize (option) 字尺寸 ex. '12px' '3rem'
 * @param customTemplate (option) 自訂模板
 * */
export interface IColumnConfig {
  label: string;
  code: string;
  desCode?: string;
  inSearch?: boolean;
  hasFilter?: boolean;
  formElement?: {
    type: 'datepicker';
    position?: 'right' | 'default' | 'left';
  };
  headerConfig?: {
    titleAlign: 'start' | 'center' | 'end';
  };
  filterConfig?: {
    customFilterOptions?: string[];
    showTransform?:
      | ((value: string | number, row: ITableRow) => string)
      | string;
    isFuzzyFilter?: boolean;
  };
  tooltip?: {
    textExpression: ((row: ITableData) => string) | string;
    showExpression: ((value: string | number) => boolean) | boolean;
    backgroundColor?: string;
  };
  iconTooltip?: {
    text: string;
    showExpression: ((row: ITableData) => boolean) | boolean;
    backgroundColor?: string;
    type?: 'info' | 'warn';
  };
  hasSort?: boolean;
  customClass?: string;
  style?: string;
  fixedWidth?: string;
  font?: {
    color?: ((value: string | number) => string) | string;
    size?: string;
    weight?: IFontWeight;
  };
  fontMulti?: (value: string | number | null) => {
    value: string;
    color?: string;
    size?: string;
    weight?: IFontWeight;
  }[];
  fontMultiDisplay?: {
    value: string;
    color?: string;
    size?: string;
    weight?: IFontWeight;
  }[];
  customTemplate?: ((value: any) => string) | string;
}
/** 該欄控制設定
 * @param filterOptions (option) 過濾選項列表 */
export interface IColumnConfigView extends IColumnConfig {
  filterOptions?: {
    name: string;
    checked: boolean;
  }[];
}

/** 該欄
 * @param value 該欄顯示內容 - 第一行
 * @param valueDes (option)該欄顯示內容 - 第二行 */
export interface ITableColumn extends IColumnConfig {
  value: number | string | null;
  valueDes?: number | string | null;
}

/** 該行  */
export interface ITableRow {
  key: string | number;
  show: boolean;
  columns: ITableColumn[];
}

/** scroll方式 */
export interface IScrollType {
  type: 'overflow-x' | 'overflow-y' | 'overflow';
  value: 'hidden' | 'auto';
}

export interface IFilterCollectionOption {
  name: string;
  checked: boolean;
}

type IFontWeight = 200 | 300 | 400 | 500 | 600 | 700 | 800;

export interface IDatePickerResult {
  date: string;
  rowKey: string | number;
}
