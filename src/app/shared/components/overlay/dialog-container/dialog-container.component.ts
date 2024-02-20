import {Component, EventEmitter, Injector, Input, Output} from '@angular/core';
import {fadeSlideInAndHideSlideOut} from '@utilities/helper/animations.helper';
import {IDialogParams} from '@utilities/interface/overlay.interface';
import {IDialog} from '@utilities/interface/overlay.interface';

@Component({
  selector: 'app-dialog-container',
  templateUrl: './dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss'],
  animations: [fadeSlideInAndHideSlideOut()],
})
export class DialogContainerComponent<T = any> implements IDialog<T> {
  @Input() noDefaultStyle?: boolean;
  @Input() padding = '';
  @Output() closed = new EventEmitter<boolean>();

  public component: any;
  public id: any;
  public options!: IDialogParams;
  public params!: IDialogParams;
  public injector!: Injector;
  public data!: T;
}
