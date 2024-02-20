import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {WindowService} from '@shared/service/window.service';
import {UnSubOnDestroy} from '@utilities/abstract/unSubOnDestroy.abstract';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-icon-dropdown',
  templateUrl: './icon-dropdown.component.html',
  styleUrls: ['./icon-dropdown.component.scss'],
})
export class IconDropdownComponent extends UnSubOnDestroy implements OnInit {
  @Input() iconCode = 'chevron-down';
  @Input() config?: IDropDownConfig;

  constructor(
    private self: ElementRef,
    private $window: WindowService
  ) {
    super();
  }

  public isOpen = false;

  ngOnInit(): void {
    this.$window.click$.pipe(takeUntil(this.onDestroy$)).subscribe(click => {
      if (!this.self.nativeElement.contains(click.target)) {
        this.isOpen = false;
      }
    });
  }
}

/**
 * @param hideTail 顯示對話框尾巴
 * @param positionY 顯示時固定的高度
 * @param positionStartX 顯示時對齊的位置
 */
export interface IDropDownConfig {
  hideTail: boolean;
  borderRadius: string;
  positionY: 'high' | 'middle' | 'low';
  positionStartX: 'start' | 'center' | 'end';
}
