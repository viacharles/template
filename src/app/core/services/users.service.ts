import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StorageMap} from '@ngx-pwa/local-storage';
import {ERole} from '@utilities/enum/common.enum';
import {IUser} from '@utilities/interface/api/auth-api.interface';
import {Observable, forkJoin, map, take, tap} from 'rxjs';
import {INewUserInfo} from '@utilities/interface/api/user-api.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private storage: StorageMap
  ) {}

  getUserId() {
    return this.storage.get('userData').pipe(map((val: any) => val?.userId));
  }

  getUserRoles(): Observable<ERole[]> {
    return this.storage.get('userData').pipe(map((val: any) => val?.role));
  }

  /**
   * Returns the current user-data info stored in local-storage
   */
  getUserSession() {
    return this.storage.get('session');
  }

  getUserData(): Observable<IUser> {
    return this.storage.get('userData') as Observable<IUser>;
  }

  setUserData(val: any) {
    return this.storage.set('userData', val);
  }

  getUserEmail() {
    return this.storage.get('userData').pipe(map((val: any) => val?.email));
  }

  getUserName() {
    return this.storage.get('userData').pipe(map((val: any) => val?.name));
  }

  /** 獲得 部門人員表 */
  public getTenantUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('/api/users/role');
  }

  /** 更新使用者角色 */
  public updateUserRoles(userId: string, roles: string[]): Observable<any> {
    return this.http.put<any>(`api/users/role/${userId}`, roles).pipe(
      take(1),
      tap(user => {
        this.storage.set('userData', user).pipe(take(1)).subscribe();
      })
    );
  }

  /** 新增 使用者 */
  public postRoleUser(userId: string, roles: string[]) {
    return this.http.post(`api/users/role`, roles);
  }

  /** 獲得 角色列表 */
  public getRoleList(): Observable<ERole[]> {
    return this.http.get<ERole[]>(`api/users/role/list`);
  }

  /**  used by admins to get a list of all available users */
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('/api/users');
  }

  /** used by admins to update users info */
  updateUsers(user: IUser) {
    return this.http.put('api/users', user);
  }

  // used by admins to invite a list of new users into the system
  inviteUsers(emailList: string[]) {
    return this.http.post('/api/users/admin-invite', emailList);
  }

  // used by authenticated users to reset own password
  resetOwnPassword(userId: string, oldPassword: string, newPassword: string) {
    return this.http.put('/api/users/change-password', {
      userId,
      oldPassword,
      newPassword,
    });
  }

  // used by authenticated users to reset own password when users' password haven't changed for three months
  resetOwnPasswordThreeMonth(
    oldPassword: string,
    newPassword: string,
    token: string
  ) {
    return this.http.put('/api/users/change-password/three-months', {
      oldPassword,
      newPassword,
      token,
    });
  }

  // used by unauthenticated users to change password - after having invoked forget-password
  resetPasswordOTP(userId: string, newPassword: string, otp: string) {
    return this.http.put('/api/auth/change-password', {
      userId,
      newPassword,
      otp,
    });
  }

  // used by unauthenticated users to invoke a forget-password otp-request
  triggerForgetPassword(email: string) {
    return this.http.post(`/api/auth/forget-password/${email}`, null);
  }

  public addNewUserInfo(userInfo: INewUserInfo): Observable<IUser> {
    return this.http.post<IUser>(`/api/users/new`, userInfo);
  }

  public getUserInfoAndReviewerInfoAndStore(): Observable<IUser> {
    return this.http.get<IUser>('assets/mock-data/user-data.json').pipe(
      tap(user => {
        forkJoin([
          this.storage.set('userData', user),
          this.storage.set('tenantList', user.tenantRespDtos),
        ])
          .pipe(take(1))
          .subscribe();
      })
    );
  }

  createUser(name: string, email: string, password: string, otp?: string) {
    if (!!otp) return this.http.post(`/api/auth`, {name, email, password, otp});
    else return this.http.post(`/api/auth`, {name, email, password});
  }

  editUser(data: {}) {
    return this.http.put('/api/users', data);
  }

  getUserInfo(userId: string): Observable<IUser> {
    return this.http.get<IUser>(`/api/users/${userId}`);
  }

  uploadProfileImg(file: any) {
    const formData = new FormData();
    formData.append('img', file);

    return this.http.post('/api/users/profile/upload', formData);
  }

  editUserProfile(data: {}) {
    return this.http.post('/api/users/profile', data);
  }

  setProjectVersion(val: any) {
    return this.storage.set('questionnaire', val);
  }

  getProjectVersion() {
    return this.storage.get('questionnaire');
  }

  /** 查詢 tenant列表 */
  public getTenantList(tenantId: string) {
    return this.http.get(`/api/users/tenants/${tenantId}`);
  }
}
