import { DialogContainerComponent } from '@shared/components/overlay/dialog-container/dialog-container.component';
import { OverlayService } from '@shared/service/overlay.service';
import { IDialogParams } from '@utilities/interface/overlay.interface';
import { AppModule } from 'src/app/app.module';
import { Base } from './base';

export class BaseDialog<T = any, V = any> extends Base {
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

  public emit(param?: V): void {
    if (this.params.callback?.emit) {
      this.params.callback?.emit(param);
    }
  }

  private inject(): void {
    this.$overlay = AppModule.injector.get(OverlayService);
  }

  protected override onInitBase(): void {
    this.onInit();
  }

  protected onInit(): void {}
}
