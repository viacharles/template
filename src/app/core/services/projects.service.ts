import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin, map, take, tap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {
  IAnswer,
  IConsultAdvice,
  IProject,
  IQuartileCheckList,
  IQuestion,
  IWaveCount,
} from '@utilities/interface/api/project-api.interface';
import {IApiRes} from '@utilities/interface/common.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) {}

  private base = '/api/v2/projects/';

  private getUrl(path: string): string {
    return this.base + path;
  }

  /** 獲得國泰所有專案 */
  getProjectsV2(): Observable<{
    projects: IProject[];
    questionTemplate: IQuestion;
    quartile: IQuartileCheckList;
  }> {
    return this.http.get<{
      projects: IProject[];
      questionTemplate: IQuestion;
      quartile: IQuartileCheckList;
    }>(this.getUrl(`list`));
  }

  /** 獲得某專案 */
  public getProjectV2(
    projectId: string,
    questionTemplateId: string,
    tenantId: string
  ): Observable<{
    project: IProject;
    questionTemplate: IQuestion;
    latestQuestionTemplate: IQuestion;
    waveCount: IWaveCount;
    consultAdvice: IConsultAdvice | '';
  }> {
    return forkJoin({
      project: this.http.get<IProject>('assets/mock-data/project.json'),
      questionTemplate: this.http.get<IQuestion>('assets/mock-data/questions.json'),
      latestQuestionTemplate: this.http.get<IQuestion>('assets/mock-data/questions.json'),
      consultAdvice: this.http.get<IConsultAdvice | ''>('assets/mock-data/questions.json'),
      waveCount: this.http.get<IWaveCount>('assets/mock-data/questions.json')
    });
  }

  /** 新增專案 */
  postProjectV2(answer: IAnswer): Observable<{projectId: string}> {
    return this.http
      .post<IApiRes>(this.getUrl('create'), answer)
      .pipe(map(val => val.data));
  }

  /** 更新專案 */
  public updateProjectV2(
    answer: IAnswer,
    projectId: string
  ): Observable<{projectId: string}> {
    return this.http.put<{projectId: string}>(
      this.getUrl(`${projectId}`),
      answer
    );
  }

  /** 獲得 四分位資料 */
  public getQuartile(): Observable<IQuartileCheckList> {
    return this.http.get<IQuartileCheckList>(this.getUrl('quartile'));
  }

  /** 送出 顧問建議 */
  public postConsultAdvice(
    advice: string,
    projectId: string
  ): Observable<string> {
    const Body = {advice, projectId};
    return this.http.post<string>(this.getUrl('consult/advice'), Body);
  }

  // get the response / questionnaire-result for specified projectId
  getProject(projectId: any) {
    return this.http.get(`/api/projects/${projectId}`).pipe(
      map(d => {
        const data = d as any;
        const answer = data.answers[Math.floor(Math.random() * (data as any).answers.length)];
        data.answers.arr[0] = answer;
        return data;
      })
    );
  }

  // get a list of available projects - availability dependant on request-header userId and tenantId
  getProjects(): Observable<{median: any[]; projects: IProject[]}> {
    return this.http.get<{median: any[]; projects: IProject[]}>(
      '/api/projects/info'
    );
  }

  createProject(data: any) {
    return this.http.post('/api/projects', data).pipe(
      map((val: any) => {
        if (!environment.production) console.log(val);
        return `/projects/${val.data?.projectId}`;
      })
    );
  }

  // post question-responses or response-meta (sharing, comments, etc)
  editProject(projectId: any, data: any) {
    // return this.http.post(`/api/projects/${tenantId}/${projectId}`, data);
    // TODO:
    return this.http.put(`/api/projects/${projectId}`, data);
  }

  editProject6R(projectId: any, data: any) {
    return this.http.put(`/api/projects/6r/${projectId}`, data);
  }

  editProjectWave(projectId: any, data: any) {
    return this.http.put(`/api/projects/${projectId}/wave`, data);
  }

  get6rHistory(projectId: any) {
    return this.http.get(`/api/projects/6r/${projectId}`);
  }

  deleteProject(projectId: any) {
    // this function should only be used in very-extreme cases
    return this.http.delete(`/api/projects/${projectId}`);
  }

  uploadPermittedTemplate(file: any, userId: string, tenantId: string) {
    // TODO: implement
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', tenantId);
    formData.append('createdId', userId);
    return this.http.post('/api/projects/access/batch', formData);
  }

  /* GET
  [
    {
      "tenantId": "fe08d4b2b7dca7e0873f5479ec4901d7e917225e03beb3ccfc154803db7154ea",
      "projectId": "5b488f0df24559f0a8e68254bfe8785069126abd",
      "apID": "NA_9",
      "apName": "Jira專案",
      "apOwner": "example@cathayholdings.com.tw",
      "userId": "c947eb5485b8080414b7d178d4e6d806291aacfdb34ae57a1689a643046b2e24",
      "createdId": "c947eb5485b8080414b7d178d4e6d806291aacfdb34ae57a1689a643046b2e24",
      "createdTime": "2022-04-29T08:33:42.153000000Z",
      "lastUpdated": "2022-04-29T08:33:42.234000000Z"
    },
  ]
  */
  getPermitted(tenantId: any) {
    return this.http.get(`/api/projects/access/${tenantId}`);
  }

  setPermitted(tenantId: any, projectId: any, data: any) {
    return this.http.put(`/api/projects/access/${tenantId}/${projectId}`, data);
  }

  newPermitted(data: any) {
    return this.http.post('/api/projects/access/single', data);
  }

  assignedProjects(email: any) {
    return this.http.get(`/api/projects/assign-projects/${email}`);
  }

  uploadProjectImg(file: any, projectId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    return this.http.post('/api/projects/upload', formData);
  }
}
