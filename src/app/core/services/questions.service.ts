import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {IQuestion} from '@utilities/interface/api/project-api.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private http: HttpClient) {}

  private base = '/api/v2/questions/';

  private getUrl(path: string): string {
    return this.base + path;
  }

  /** 獲得最新版本題目 */
  public getLatestQuestionV2(): Observable<IQuestion> {
    return this.http.get<IQuestion>(this.getUrl(''));
  }

  /** 獲得某版本題目 */
  public getQuestionV2(questionTemplateId: string): Observable<IQuestion> {
    return this.http.get<IQuestion>(this.getUrl(`${questionTemplateId}`));
  }

  /** post changes to questions-info (tenantId inside header)
  // postQustionnaire(data: any) {
  //   return this.http.post('/api/questions', data);
  // }
  */

  /**
   * @example
   * {
   *   tenantId: ...
   *   version: ...
   *   fieldGroup: [
   *     ...
   *   ]
   * }
   * @param {object} data - the updated questions-template
   */
  postQuestions(data: any) {
    // TODO: currently template?tenantId=... is not yet implemented, therefore only SITE_ADMIN can modify questions-template; see BFF questions.js for details
    return this.http.post('/api/questions/asdf', data);
  }
}
