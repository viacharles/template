import {Directive, SimpleChanges} from '@angular/core';
import {RouterService} from '@shared/service/router.service';
import {IRouterHistory} from '@utilities/interface/common.interface';
import {takeUntil} from 'rxjs';
import { Base } from './base';

@Directive()
export abstract class BasePage extends Base {
  constructor(public $router: RouterService) {
    super();
  }
  /** 是否回復filter & sort */
  public revertFilter = false;

  protected override onInitBase(): void {
    this.$router.history$
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(histories => this.handleHistory(histories));
    this.onInit();
  }

  protected override onChangeBase(changes: SimpleChanges): void {
    this.onChange(changes)
  }

  private handleHistory(histories: IRouterHistory[]): void {
    if (histories[0] && histories[0].revertFilter) {
      this.revertFilter = histories[0].revertFilter;
    }
  }

  protected onInit(): void {}
  protected onChange(changes: SimpleChanges): void {}
}
