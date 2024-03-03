import { AfterViewInit, Directive, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UnSubOnDestroy } from '@utilities/abstract/unSubOnDestroy.abstract';
import { EColorType, ESize } from '@utilities/enum/common.enum';

@Directive()
export abstract class Base extends UnSubOnDestroy implements OnInit, OnChanges, AfterViewInit {
  constructor() {
    super();
  }
  /** 樣式種類 */
  get colorType() { return EColorType };
  /** 尺寸種類 */
  get sizeType() { return ESize };

  ngOnInit(): void {
    this.onInitBase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChangeBase(changes);
  }

  ngAfterViewInit(): void {
    this.afterViewInitBase();
  }

  protected onInitBase(): void { }
  protected onChangeBase(changes: SimpleChanges): void { }
  protected afterViewInitBase(): void { }
}
