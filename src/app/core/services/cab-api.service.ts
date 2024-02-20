import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  ICabApplicationAnswerReq,
  ICabApplicationAnswerRes,
  ICabBasicInfoReq,
  ICabBasicInfoRes,
  ICabCommentReq,
  ICabCommentRes,
  ICabSchedule,
  ICabTemplateRes,
  ICabFile,
  ICabRoleReq,
  ICabUserRoleRes,
  ICabReviewerPosition,
  ICabSupplementReq,
} from '@utilities/interface/api/cab-api.interface';
import {Observable} from 'rxjs';
import {ECab} from 'src/app/modules/cab/shared/enum/cab.enum';
import {ERole} from '@utilities/enum/common.enum';

@Injectable({
  providedIn: 'root',
})
export class CabService {
  constructor(private http: HttpClient) {}

  private readonly cabBaseUrl = '/api/cab';

  /** 新增 申請表基本資料 */
  public postNewBasicInfo(
    form: ICabBasicInfoReq
  ): Observable<ICabBasicInfoRes> {
    return this.http.post<ICabBasicInfoRes>(this.cabBaseUrl + '/basic', form);
  }

  /** 查詢申請表題目*/
  public getApplicationQuestion(
    cab: ECab,
    version?: string
  ): Observable<ICabTemplateRes> {
    const queryParams = [];
    queryParams.push(`cab=${cab}`);
    if (version) {
      queryParams.push(`version=${version}`);
    }
    return this.http.get<ICabTemplateRes>(
      this.cabBaseUrl +
        `/template${queryParams.length > 0 ? `?${queryParams.join('&')}` : ''}`
    );
  }

  /** 查詢 單個 申請表答案 */
  public getApplicationForm(
    projectId: string,
    cabId: string
  ): Observable<ICabApplicationAnswerRes[] | ICabApplicationAnswerRes> {
    return this.http.get<ICabApplicationAnswerRes[] | ICabApplicationAnswerRes>(
      this.cabBaseUrl + `/answer/${projectId}/${cabId}`
    );
  }

  /** 查詢 全部申請表列表(依照權限過濾) */
  public getApplicationList(): Observable<ICabApplicationAnswerRes[]> {
    return this.http.get<ICabApplicationAnswerRes[]>(
      this.cabBaseUrl + `/answer/list`
    );
  }

  /** 新增 申請表答案草稿 */
  public postApplicationFormDraft(
    body: ICabApplicationAnswerReq
  ): Observable<ICabApplicationAnswerRes> {
    return this.http.post<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/draft',
      body
    );
  }

  /** 更新 申請表答案草稿 */
  public putApplicationFormDraft(
    body: ICabApplicationAnswerReq
  ): Observable<ICabApplicationAnswerRes> {
    return this.http.put<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/draft',
      body
    );
  }

  /** 新增 申請表答案 */
  public postApplicationForm(
    body: ICabApplicationAnswerReq
  ): Observable<ICabApplicationAnswerRes> {
    return this.http.post<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/answer',
      body
    );
  }

  /** 更新 申請表答案 */
  public putApplicationForm(
    body: ICabApplicationAnswerReq
  ): Observable<ICabApplicationAnswerRes> {
    return this.http.put<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/answer',
      body
    );
  }

  /** 上傳檔案 */
  public upload(file: File): Observable<ICabFile> {
    const File = new FormData();
    File.append('file', file);
    return this.http.post<ICabFile>(this.cabBaseUrl + '/upload', File);
  }

  /** 下載檔案 */
  public download(id: string): Observable<any> {
    return this.http.get<any>(this.cabBaseUrl + `/download/file/${id}`, {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
  }

  /** 下載範本檔案 */
  public downloadTemp(): Observable<any> {
    return this.http.get<any>(this.cabBaseUrl + '/download/temp', {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
  }

  /** 暫存補件 */
  public putSupplementDraft(
    body: ICabSupplementReq
  ): Observable<ICabApplicationAnswerRes> {
    return this.http.post<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/supplement/draft',
      body
    );
  }

  /** 送出補件 */
  public completeSupplement(
    projectId: string,
    cabId: string
  ): Observable<ICabApplicationAnswerRes> {
    const body = {projectId, cabId};
    return this.http.post<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/supplement',
      body
    );
  }

  /** 查詢 審查委員建議 */
  public getReviewerAdvice(cadId?: string): Observable<ICabCommentRes> {
    return this.http.get<ICabCommentRes>(this.cabBaseUrl + `/comment/${cadId}`);
  }

  /** 更新 審查委員建議 */
  public updateReviewerAdvice(
    cadId: string,
    body: ICabCommentReq
  ): Observable<ICabCommentRes> {
    return this.http.put<ICabCommentRes>(
      this.cabBaseUrl + `/comment/${cadId}`,
      body
    );
  }

  /** 新增 審查委員建議 */
  public postReviewerAdvice(
    cadId: string,
    body: ICabCommentReq
  ): Observable<ICabCommentRes> {
    return this.http.post<ICabCommentRes>(
      this.cabBaseUrl + `/comment/${cadId}`,
      body
    );
  }

  /** 新增 專案排程 */
  public postCabSchedule(
    schedule: ICabSchedule[]
  ): Observable<ICabApplicationAnswerRes> {
    return this.http.post<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/schedule',
      schedule
    );
  }

  /** 更新 專案排程 */
  public putCabSchedule(
    schedule: ICabSchedule[]
  ): Observable<ICabApplicationAnswerRes> {
    return this.http.put<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/schedule',
      schedule
    );
  }

  /** 取消 專案排程 */
  public deleteCabSchedule(schedule: {cabId: string}[]) {
    return this.http.put<ICabApplicationAnswerRes>(
      this.cabBaseUrl + '/schedule/cancel',
      schedule
    );
  }

  /** 查詢 歷史專案進度 */
  public getCabRecords(projectId: string) {
    return this.http.get<ICabApplicationAnswerRes[]>(
      this.cabBaseUrl + `/records/${projectId}`
    );
  }

  /** 查詢 Cab審核單位 */
  public getReviewerPosition() {
    return this.http.get<ICabReviewerPosition[]>(this.cabBaseUrl + `/reviewer`);
  }

  /** 查詢 使用者Cab角色 */
  public getCabRoles() {
    return this.http.get<ERole[]>(this.cabBaseUrl + `/roles`);
  }

  /** 更新 使用者Cab角色 */
  public putCabRoles(body: ICabRoleReq) {
    return this.http.put<ICabUserRoleRes>(this.cabBaseUrl + `/roles`, body);
  }
}
