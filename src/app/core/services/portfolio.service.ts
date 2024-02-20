import {Observable, map} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  IChartCreateOptionGroup,
  IChartQuestionRes,
  IChartsForUpdateQuestionRequest,
  IChartsForUpdateRequest,
  ICreateChartRes,
} from '@utilities/interface/api/portfolio-api.interface';
import {IApiRes} from '@utilities/interface/common.interface';
import {IQuartileCheckList} from '@utilities/interface/api/project-api.interface';
import {IDashboards} from '@utilities/interface/chart.interface';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  /** [ Overview ] page init data */
  public getOverviewPageInitData(
    userId: string,
    tenantId: string,
    hideLoading = true
  ): Observable<{
    dashboard: IDashboards;
    quartile: IQuartileCheckList;
    options: IChartCreateOptionGroup;
  }> {
    return this.http.get<{
      dashboard: IDashboards;
      quartile: IQuartileCheckList;
      options: IChartCreateOptionGroup;
    }>(
      `/api/portfolio/overview/${userId}/${tenantId}?hideLoading=${hideLoading}`
    );
  }

  /** 更新 dashboard 某圖表 */
  public updateDashboardChart(
    dashboardId: string,
    customCharts: IChartsForUpdateRequest
  ): Observable<null> {
    return this.http
      .put<IApiRes<null>>(
        `/api/portfolio/dashboard/${dashboardId}`,
        customCharts
      )
      .pipe(map(res => res.data));
  }

  /** 更新 dashboard 某圖表問題 */
  public updateChartQuestion(
    dashboardId: string,
    chartId: string,
    customCharts: IChartsForUpdateQuestionRequest,
    tenantId: string
  ): Observable<IChartQuestionRes> {
    return this.http
      .put<IChartQuestionRes>(
        `/api/portfolio/dashboard/${dashboardId}/${chartId}/${tenantId}`,
        customCharts
      )
      .pipe(map(res => res));
  }

  /** 新增 dashboard 某圖表 */
  public createDashboardChart(
    dashboardId: string,
    body: IChartsForUpdateQuestionRequest,
    tenantId: string
  ): Observable<ICreateChartRes> {
    return this.http
      .post<ICreateChartRes>(
        `/api/portfolio/dashboard/${dashboardId}/${tenantId}`,
        body
      )
      .pipe(map(res => res));
  }

  /** 刪除 dashboard 某圖表 */
  public deleteDashboardChart(
    dashboardId: string,
    chartTemplateId: string
  ): Observable<null> {
    return this.http.delete<null>(
      `/api/portfolio/dashboard/${dashboardId}/${chartTemplateId}`
    );
  }

  /** 獲得 新增customCart時用的選項組 */
  public getChartCreateOptions(): Observable<IChartCreateOptionGroup> {
    return this.http
      .get<IApiRes<IChartCreateOptionGroup>>(
        `/api/portfolio/dashboard/chartTemplate/option-list`
      )
      .pipe(map(res => res.data));
  }

  /** 獲得 部門的 dashboard */
  public getOverviewByTenant(
    userId: string,
    tenantId: string
  ): Observable<IDashboards> {
    return this.http.get<IDashboards>(
      `/api/portfolio/dashboard/${userId}/${tenantId}`
    );
  }

  getOverview(tenantList: [string]) {
    return this.http.get(`/api/portfolio/overview`, {params: {tenantList}});
  }

  getAnalytic(tenantList: [string]) {
    return this.http.get('/api/portfolio/analytic', {params: {tenantList}});
  }

  getAnalyticDetails(tenantList: [string]) {
    return this.http.get('/api/portfolio/details', {params: {tenantList}});
  }

  postGroupData(data: any) {
    return this.http.post('/api/portfolio/group', data);
  }

  getWave(projectId: string) {
    return this.http.get('/api/portfolio/wave/' + projectId);
  }

  setWave(projectId: string, tenantId: string, wave: number) {
    const data = {projectId, tenantId, wave};
    return this.http.post('/api/portfolio/wave', data);
  }
}
