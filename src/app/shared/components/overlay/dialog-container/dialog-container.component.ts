import {Component, ElementRef, EventEmitter, Injector, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {scaleInShortenOut} from '@utilities/helper/animations.helper';
import {IDialogParams} from '@utilities/interface/overlay.interface';
import {IDialog} from '@utilities/interface/overlay.interface';

@Component({
  selector: 'app-dialog-container',
  templateUrl: './dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss'],
  animations: [scaleInShortenOut()],
})
export class DialogContainerComponent<T = any> implements IDialog<T> {
  @Input() noDefaultStyle?: boolean;
  @Input() hasCancelButton = true;
  @Input() padding = '';
  @Input() width = '';
  @Input() maxWidth = '';
  @Input() minWidth = '';
  @Output() closed = new EventEmitter<boolean>();

  public component: any;
  public id: any;
  public options!: IDialogParams;
  public params!: IDialogParams;
  public injector!: Injector;
  public data!: T;

  public isClose = false;

  public onClose(): void {
    this.isClose = true;
    let closeTimer = setTimeout(() => {
      this.closed.emit(true);
      clearTimeout(closeTimer);
    }, 300);
  }
}
