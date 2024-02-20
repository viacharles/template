import {Injectable} from '@angular/core';
import {StorageMap} from '@ngx-pwa/local-storage';
import {TranslateService as TS} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  public selectedLang = 'zh';

  constructor(
    private storage: StorageMap,
    private translate: TS
  ) {
    this.checkLang();
  }

  setLang(val: string) {
    this.storage.set('lang', val).subscribe(() => {
      this.selectedLang = val;
      this.translate.use(val).subscribe();
    });
  }

  checkLang() {
    this.storage.get('lang').subscribe((val: any) => {
      if (!!val) {
        this.selectedLang = val;
      } else {
        this.selectedLang = 'zh';
        this.storage.set('lang', 'zh').subscribe();
      }

      this.translate.use(this.selectedLang).subscribe();
    });
  }

  toggleLang() {
    this.storage.get('lang').subscribe(val => {
      let targetLang = 'zh';
      switch (val) {
        case 'zh':
          targetLang = 'en';
          break;
        case 'en':
          targetLang = 'zh';
          break;
      }
      this.setLang(targetLang);
    });
  }
}
