import {Directive, OnInit} from '@angular/core';
import {RouterService} from '@shared/service/router.service';
import {UnSubOnDestroy} from '@utilities/abstract/unSubOnDestroy.abstract';
import {IRouterHistory} from '@utilities/interface/common.interface';
import {takeUntil} from 'rxjs';

@Directive()
export abstract class BasePage extends UnSubOnDestroy implements OnInit {
  constructor(public $router: RouterService) {
    super();
  }
  /** 是否回復filter & sort */
  public revertFilter = false;

  ngOnInit(): void {
    this.$router.history$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(histories => this.handleHistory(histories));
    this.onInit();
  }

  private handleHistory(histories: IRouterHistory[]): void {
    if (histories[0] && histories[0].revertFilter) {
      this.revertFilter = histories[0].revertFilter;
    }
  }

  protected onInit(): void {}
}
