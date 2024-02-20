import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StorageMap} from '@ngx-pwa/local-storage';
import {ITenant} from '@utilities/interface/tenant.interface';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  constructor(
    private http: HttpClient,
    private storage: StorageMap
  ) {}

  getCurrentTenantId() {
    return this.storage.get('tenantData').pipe(
      map((val: any) => {
        return val?.tenantId;
      })
    );
  }

  getCurrentTenantData() {
    return this.storage.get('tenantData');
  }

  getTenantList(): Observable<ITenant[]> {
    return this.http.get<ITenant[]>('/api/tenants');
  }

  createTenant(data: any) {
    return this.http.post('/api/tenants', data);
  }

  editTenant(data: any) {
    return this.http.put('/api/tenants', data);
  }

  getRegisterInfo() {
    return this.http.get('/api/auth/registerInfo');
  }
}
