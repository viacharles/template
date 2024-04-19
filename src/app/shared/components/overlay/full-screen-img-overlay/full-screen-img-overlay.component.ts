import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {BaseDialog} from '@utilities/base/base-dialog';
import {fadeEnterAndHideOut} from '@utilities/helper/animations.helper';
import {DialogContainerComponent} from '../dialog-container/dialog-container.component';

@Component({
  selector: 'app-full-screen-img-overlay',
  templateUrl: './full-screen-img-overlay.component.html',
  styleUrls: ['./full-screen-img-overlay.component.scss'],
  animations: [fadeEnterAndHideOut()],
})
export class FullScreenImgOverlayComponent
  extends BaseDialog<{url: string}>
  implements AfterViewInit
{
  @ViewChild('tImg') tImg?: ElementRef<HTMLImageElement>;
  @ViewChild('tCancelButton') tCancelButton?: ElementRef<HTMLImageElement>;
  constructor(
    private renderer: Renderer2,
    dialog: DialogContainerComponent
  ) {
    super(dialog);
  }

  protected override afterViewInitBase(): void {
    const ImgRect = this.tImg?.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(
      this.tCancelButton?.nativeElement,
      'top',
      `${ImgRect!.top - 20}px`
    );
    this.renderer.setStyle(
      this.tCancelButton?.nativeElement,
      'left',
      `calc(${ImgRect!.right}px - 4%)`
    );
  }
}
