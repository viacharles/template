import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  IPrcProjectId,
  IStructureHistory,
  IStructureList,
  IStructureQuestionApiRes,
  IStructureUpdateReq,
} from '@utilities/interface/structure.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StructureService {
  constructor(private http: HttpClient) {}

  /** 獲得專案基本資料 */
  public getBasicStructure(projectId: string): Observable<any> {
    return this.http.get<string>(
      `/api/v2/projects/structure/architecture/project/latest/architecture/${projectId}`
    );
  }

  /** 新增專案基本資料 */
  public postNewBasicStructure(form: any): Observable<IPrcProjectId> {
    return this.http.post<IPrcProjectId>(
      '/api/v2/projects/structure/architecture/create',
      form
    );
  }

  /** 更新專案基本資料 */
  public updateBasicStructure(form: any): Observable<IPrcProjectId> {
    return this.http.put<IPrcProjectId>(
      '/api/v2/projects/structure/architecture/update',
      form
    );
  }

  /** 獲得專案架構列表
   * @param times 需求頁面id(從 0 開始)
   * @param systemName 後端視空字串為空值
   */
  public getStructureProjectList(
    times?: string,
    systemName = ' '
  ): Observable<IStructureList> {
    const query = [];
    if (times) {
      query.push(`times=${times}`);
    }
    if (systemName && systemName !== ' ') {
      query.push(`systemName=${systemName}`);
    }
    const queryString = query.length > 0 ? `/?${query.join('&')}` : '';
    return this.http.get<IStructureList>(
      `/api/v2/projects/structure/architecture/latest/all${queryString}`
    );
  }

  /** 獲得專案架構歷程 */
  public getStructureProjectHistory(
    projectId: string
  ): Observable<IStructureHistory[]> {
    return this.http.get<IStructureHistory[]>(
      `/api/v2/projects/structure/architecture/record/${projectId}`
    );
  }

  /** 獲得專案架構文字資料 */
  public getStructureProject(
    projectId: string,
    editDate: string
  ): Observable<IStructureQuestionApiRes> {
    return this.http.get<IStructureQuestionApiRes>(
      `/api/v2/projects/structure/architecture/${projectId}/${editDate}`
    );
  }

  /** 新增專案架構文字資料 */
  public postNewDecision(data: IStructureUpdateReq): Observable<string> {
    return this.http.post<string>(
      '/api/v2/projects/structure/architecture/create/text',
      data
    );
  }

  /** 更新專案架構文字資料 */
  public updateDecision(data: IStructureUpdateReq): Observable<string> {
    return this.http.put<string>(
      '/api/v2/projects/structure/architecture/update/text',
      data
    );
  }

  /** 上傳圖片 */
  public uploadStructureImg(
    imgType: string,
    order: string,
    data: any
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', data);
    return this.http.post(
      `/api/v2/projects/structure/architecture/image?imgType=${imgType}&order=${order}`,
      formData
    );
  }

  /** 下載圖片 */
  public downloadStructureImg(imgName: string): Observable<{base64: string}> {
    return this.http.get<{base64: string}>(
      `/api/v2/projects/structure/architecture/get/image/${imgName}?hideLoading=true`
    );
  }
}
