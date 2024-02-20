import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LoaderService} from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  private _showLoader = new BehaviorSubject<boolean>(false);
  public readonly showLoader$ = this._showLoader.asObservable();

  private _showMiniLoader = new BehaviorSubject<boolean>(false);
  public readonly showMiniLoader$ = this._showMiniLoader.asObservable();

  private _showAdminTools = new BehaviorSubject<boolean>(false);
  public readonly showAdminTools$ = this._showAdminTools.asObservable();

  private _useLocalDefaultQuestionsTemplate = new BehaviorSubject<boolean>(
    false
  );
  public readonly useLocalDefaultQuestionsTemplate$ =
    this._useLocalDefaultQuestionsTemplate.asObservable();

  constructor(private loaderService: LoaderService) {
    // console.log('console.service ctor');
  }

  showLoader() {
    this._showLoader.next(true);
    this.loaderService.show();
    console.log('Loader enabled');
  }

  hideLoader() {
    this._showLoader.next(false);
    this.loaderService.hide();
    console.log('Loader disabled');
  }

  showMiniLoader() {
    this._showMiniLoader.next(true);
    this.loaderService.showMini();
    console.log('Mini-Loader enabled');
  }

  hideMiniLoader() {
    this._showMiniLoader.next(false);
    this.loaderService.hideMini();
    console.log('Mini-Loader disabled');
  }

  enableAdminTools() {
    this._showAdminTools.next(true);
    console.log('Admin-Tools enabled');
  }

  disableAdminTools() {
    this._showAdminTools.next(false);
    console.log('Admin-Tools disabled');
  }

  enableLocalDefaultQuestionsTemplate() {
    this._useLocalDefaultQuestionsTemplate.next(true);
  }

  disableLocalDefaultQuestionsTemplate() {
    this._useLocalDefaultQuestionsTemplate.next(false);
  }
}
