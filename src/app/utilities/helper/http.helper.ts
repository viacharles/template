import {Router} from '@angular/router';

export class HttpHelper {
  public static replaceUrlByNewVersion(
    currentUrl: string,
    router: Router,
    version: string
  ): string {
    let urlModified: string = currentUrl;
    if (currentUrl) {
      const NewUrlParamVersion = `v=${version}`;
      const UrlParams: string = urlModified.substring(
        urlModified.indexOf('?') + 1
      );
      const OriginVersion = UrlParams.split('&').find(param =>
        param.includes('v=')
      );
      if (!currentUrl.includes(NewUrlParamVersion)) {
        if (!urlModified.includes('?')) {
          urlModified = urlModified + '?' + NewUrlParamVersion;
        } else if (!UrlParams.includes('v=')) {
          urlModified = urlModified + '&' + NewUrlParamVersion;
        } else if (OriginVersion && OriginVersion !== NewUrlParamVersion) {
          urlModified = urlModified.replace(/v=.*?(&|$)/, NewUrlParamVersion);
        }
      }
    }
    return urlModified;
  }
}
