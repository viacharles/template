import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IDFApplicationAnswerReq,
  IDFApplicationAnswerRes,
  IDFBasicInfoReq,
  IDFBasicInfoRes,
  IDFCommentReq,
  IDFCommentRes,
  IDFSchedule,
  IDFFile,
  IDFRoleReq,
  IDFUserRoleRes,
  IDFReviewerPosition,
  IDFSupplementReq,
} from '@utilities/interface/api/df-api.interface';
import { Observable } from 'rxjs';
import { ERole } from '@utilities/enum/common.enum';

@Injectable({
  providedIn: 'root',
})
export class DFService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = '/api/df';

  /** 新增 申請表基本資料 */
  public postNewBasicInfo(
    form: IDFBasicInfoReq
  ): Observable<IDFBasicInfoRes> {
    return this.http.post<IDFBasicInfoRes>(this.baseUrl + '/basic', form);
  }

  /** 查詢 單個 申請表答案 */
  public getApplicationForm(
    projectId: string,
    dfId: string
  ): Observable<IDFApplicationAnswerRes[] | IDFApplicationAnswerRes> {
    return this.http.get<IDFApplicationAnswerRes[] | IDFApplicationAnswerRes>(
      this.baseUrl + `/answer/${projectId}/${dfId}`
    );
  }

  /** 查詢 全部申請表列表(依照權限過濾) */
  public getApplicationList(): Observable<IDFApplicationAnswerRes[]> {
    return this.http.get<IDFApplicationAnswerRes[]>(
      this.baseUrl + `/answer/list`
    );
  }

  /** 新增 申請表答案草稿 */
  public postApplicationFormDraft(
    body: IDFApplicationAnswerReq
  ): Observable<IDFApplicationAnswerRes> {
    return this.http.post<IDFApplicationAnswerRes>(
      this.baseUrl + '/draft',
      body
    );
  }

  /** 更新 申請表答案草稿 */
  public putApplicationFormDraft(
    body: IDFApplicationAnswerReq
  ): Observable<IDFApplicationAnswerRes> {
    return this.http.put<IDFApplicationAnswerRes>(
      this.baseUrl + '/draft',
      body
    );
  }

  /** 新增 申請表答案 */
  public postApplicationForm(
    body: IDFApplicationAnswerReq
  ): Observable<IDFApplicationAnswerRes> {
    return this.http.post<IDFApplicationAnswerRes>(
      this.baseUrl + '/answer',
      body
    );
  }

  /** 更新 申請表答案 */
  public putApplicationForm(
    body: IDFApplicationAnswerReq
  ): Observable<IDFApplicationAnswerRes> {
    return this.http.put<IDFApplicationAnswerRes>(
      this.baseUrl + '/answer',
      body
    );
  }

  /** 上傳檔案 */
  public upload(file: File): Observable<IDFFile> {
    const File = new FormData();
    File.append('file', file);
    return this.http.post<IDFFile>(this.baseUrl + '/upload', File);
  }

  /** 下載檔案 */
  public download(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/download/file/${id}`, {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
  }

  /** 下載範本檔案 */
  public downloadTemp(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/download/temp', {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
  }

  /** 暫存補件 */
  public putSupplementDraft(
    body: IDFSupplementReq
  ): Observable<IDFApplicationAnswerRes> {
    return this.http.post<IDFApplicationAnswerRes>(
      this.baseUrl + '/supplement/draft',
      body
    );
  }

  /** 送出補件 */
  public completeSupplement(
    projectId: string,
    Id: string
  ): Observable<IDFApplicationAnswerRes> {
    const body = {projectId, Id};
    return this.http.post<IDFApplicationAnswerRes>(
      this.baseUrl + '/supplement',
      body
    );
  }

  /** 查詢 審查委員建議 */
  public getReviewerAdvice(cadId?: string): Observable<IDFCommentRes> {
    return this.http.get<IDFCommentRes>(this.baseUrl + `/comment/${cadId}`);
  }

  /** 更新 審查委員建議 */
  public updateReviewerAdvice(
    cadId: string,
    body: IDFCommentReq
  ): Observable<IDFCommentRes> {
    return this.http.put<IDFCommentRes>(
      this.baseUrl + `/comment/${cadId}`,
      body
    );
  }

  /** 新增 審查委員建議 */
  public postReviewerAdvice(
    cadId: string,
    body: IDFCommentReq
  ): Observable<IDFCommentRes> {
    return this.http.post<IDFCommentRes>(
      this.baseUrl + `/comment/${cadId}`,
      body
    );
  }

  /** 新增 專案排程 */
  public postDFSchedule(
    schedule: IDFSchedule[]
  ): Observable<IDFApplicationAnswerRes> {
    return this.http.post<IDFApplicationAnswerRes>(
      this.baseUrl + '/schedule',
      schedule
    );
  }

  /** 更新 專案排程 */
  public putDFSchedule(
    schedule: IDFSchedule[]
  ): Observable<IDFApplicationAnswerRes> {
    return this.http.put<IDFApplicationAnswerRes>(
      this.baseUrl + '/schedule',
      schedule
    );
  }

  /** 取消 專案排程 */
  public deleteDFSchedule(schedule: {dfId: string}[]) {
    return this.http.put<IDFApplicationAnswerRes>(
      this.baseUrl + '/schedule/cancel',
      schedule
    );
  }

  /** 查詢 歷史專案進度 */
  public getDFRecords(projectId: string) {
    return this.http.get<IDFApplicationAnswerRes[]>(
      this.baseUrl + `/records/${projectId}`
    );
  }

  /** 查詢 DF審核單位 */
  public getReviewerPosition() {
    return this.http.get<IDFReviewerPosition[]>(this.baseUrl + `/reviewer`);
  }

  /** 查詢 使用者DF角色 */
  public getDFRoles() {
    return this.http.get<ERole[]>(this.baseUrl + `/roles`);
  }

  /** 更新 使用者DF角色 */
  public putDFRoles(body: IDFRoleReq) {
    return this.http.put<IDFUserRoleRes>(this.baseUrl + `/roles`, body);
  }
}
