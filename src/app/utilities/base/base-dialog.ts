import {DialogContainerComponent} from '@shared/components/overlay/dialog-container/dialog-container.component';
import {OverlayService} from '@shared/service/overlay.service';
import {UnSubOnDestroy} from '@utilities/abstract/unSubOnDestroy.abstract';
import {IDialogParams} from '@utilities/interface/overlay.interface';
import {AppModule} from 'src/app/app.module';

export class BaseDialog<T = any> extends UnSubOnDestroy {
  constructor(public dialog: DialogContainerComponent<T>) {
    super();
    this.inject();
  }

  public $overlay!: OverlayService;

  get params(): IDialogParams {
    return this.dialog.params;
  }
  get data(): T {
    return this.dialog.data;
  }

  public confirm(params?: any, close = true): void {
    if (this.params.callback?.confirm) {
      this.params.callback.confirm(params);
    }
    if (close) {
      this.$overlay.closeDialog(this.dialog);
    }
  }

  public cancel(param?: any): void {
    if (this.params.callback?.cancel) {
      this.params.callback?.cancel(param);
    }
    this.$overlay.closeDialog(this.dialog);
  }

  public close(): void {
    this.$overlay.closeDialog(this.dialog);
  }

  private inject(): void {
    this.$overlay = AppModule.injector.get(OverlayService);
  }
}
