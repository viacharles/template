import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { WindowService } from '@shared/service/window.service';
import { Base } from '@utilities/base/base';
import { takeUntil } from 'rxjs';

export const SELECT_CONTAINER_TAG = 'app-select-dropdown-container';

@Component({
  selector: SELECT_CONTAINER_TAG,
  templateUrl: './select-dropdown-container.component.html',
  styleUrl: './select-dropdown-container.component.scss'
})
export class SelectDropdownContainerComponent extends Base  {
  @Output() closed = new EventEmitter<boolean>();
  public isClose = false;

  constructor(
    private readonly $window: WindowService,
    private readonly selfElem: ElementRef,
  ) { super() }

  protected override afterViewInitBase(): void {
    console.log('aa-afterViewInitBase',)
    this.$window.click$.pipe(takeUntil(this.onDestroy$)).subscribe(click => {
      console.log("🚀 aa-~ SelectDropdownContainerComponent ~ this.$window.click$.pipe ~ click:", click)
      if (!this.selfElem.nativeElement.contains(click.target as HTMLElement)) {
        // this.onClose();
      }
    });
  }

  public onClose(): void {
    this.isClose = true;
    let closeTimer = setTimeout(() => {
      console.log('aa-onClose', )
      this.closed.emit(true);
      clearTimeout(closeTimer);
    }, 300);
  }
}
