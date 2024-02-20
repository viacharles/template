import {Injector} from '@angular/core';
import {DialogContainerComponent} from '@shared/components/overlay/dialog-container/dialog-container.component';
import {IDialog, IDialogParams} from '@utilities/interface/overlay.interface';

export class Dialog<T = any> implements IDialog<T> {
  public component: any;
  public id!: string;
  public params!: IDialogParams;
  public data!: T;
  public injector!: Injector;
  constructor(
    public dialog: IDialog,
    injector: Injector
  ) {
    this.component = dialog.component;
    this.id = dialog.id;
    this.params = dialog.params;
    this.data = dialog.data;
    this.injector = Injector.create({
      providers: [
        {
          provide: DialogContainerComponent,
          useValue: dialog,
        },
      ],
      parent: injector,
    });
  }
}
