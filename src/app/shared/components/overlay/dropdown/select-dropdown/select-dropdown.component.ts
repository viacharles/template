import { Component, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { BaseDialog } from '@utilities/base/base-dialog';
import { DialogContainerComponent } from '../../dialog-container/dialog-container.component';
import { ISelectDropdownData } from '@utilities/interface/overlay.interface';
import { SELECT_CONTAINER_TAG } from '../select-dropdown-container/select-dropdown-container.component';
import { WindowService } from '@shared/service/window.service';
import { IOption } from '@utilities/interface/common.interface';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss'
})
export class SelectDropdownComponent extends BaseDialog<ISelectDropdownData> {
  @HostBinding('style.width') get hostWidth() {
    return this.width + 'px';
  }

  constructor(
    dialog: DialogContainerComponent,
    private readonly self: ElementRef<HTMLElement>,
    private readonly $window: WindowService,
    private readonly renderer: Renderer2,
  ) {
    super(dialog);
  }

  private selfRect?: DOMRect;
  private dropdownRect?: DOMRect;

  get options() { return this.data.options; };
  get width() { return this.data.width; };
  get height() { return this.data.height; };
  get alignTo() { return this.data.alignTo };

  protected override afterViewInitBase(): void {
    this.selfRect = this.self.nativeElement.getElementsByTagName(SELECT_CONTAINER_TAG)[0].getBoundingClientRect() as DOMRect;
    this.dropdownRect = this.self.nativeElement.getElementsByTagName('ul')[0].getBoundingClientRect();

    this.updatePosition();
    this.$window.windowResize$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.updatePosition();
    });
  }

  public selectOption(option?: IOption): void {
    this.confirm(option, true);
  }

  private updatePosition(): void {
    const ul = this.self.nativeElement.getElementsByTagName('ul')[0];

    // 超出螢幕下緣，貼齊螢幕下緣
    const exceedWindowHeight = window.innerHeight < ((this.alignTo.y.diff ?? 0) + (this.dropdownRect?.height ?? 0));
    if (exceedWindowHeight) {
      console.log('aa-超出螢幕下緣')
      this.renderer.setStyle(this.self.nativeElement, 'top',
        (window.innerHeight - (this.dropdownRect?.height ?? 0)) + 'px'
      );
      // 本身高度超出螢幕高度，高度變為螢幕高度
      if (window.innerHeight < (this.dropdownRect?.height ?? 0)) {
        console.log('aa-本身高度超出螢幕高度')
        this.renderer.setStyle(this.self.nativeElement, 'top', 0);
        this.renderer.setStyle(ul, 'height', '100%');
      } else {
        this.renderer.setStyle(ul, 'height', 'unset');
      };
    } else {
      this.renderer.setStyle(this.self.nativeElement, 'top',
        ((this.alignTo.y.diff ?? 0) + (this.height ?? 0) + 3) + 'px'
      );
    };
    // 超出螢幕右緣，貼齊螢幕右緣
    const exceedWindowWidth = window.innerWidth < ((this.alignTo.x.diff ?? 0));
    if (exceedWindowWidth) {
      console.log('aa-超出螢幕右緣', window.innerWidth, this.alignTo.x.diff, this.dropdownRect?.width)
      this.renderer.setStyle(this.self.nativeElement, 'left',
        (window.innerWidth - (this.dropdownRect?.width ?? 0) ) + 'px'
      );
      // 本身寬度超出螢幕寬度，寬度變為螢幕寬度
      if (window.innerWidth < (this.dropdownRect?.width ?? 0)) {
        console.log('aa-本身寬度超出螢幕寬度')
        this.renderer.setStyle(this.self.nativeElement, 'left', 0);
        this.renderer.setStyle(this.self.nativeElement, 'width', '100%');
      } else {
        this.renderer.setStyle(this.self.nativeElement, 'width', this.width + 'px');
      };
    } else {
      if (getComputedStyle(this.self.nativeElement).width === '100%') {

      };
      this.renderer.setStyle(this.self.nativeElement, 'width', this.width + 'px');
      this.renderer.setStyle(this.self.nativeElement, 'left',
        ((this.alignTo.x.diff ?? 0) - (this.width ?? 0)) + 'px'
      );
    };
  }
}
