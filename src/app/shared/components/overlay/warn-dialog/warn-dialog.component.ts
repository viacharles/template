import {Component, OnInit} from '@angular/core';
import {BaseDialog} from '@utilities/base/base-dialog';
import {EContent} from '@utilities/enum/common.enum';
import {IWarnDialogData} from '@utilities/interface/overlay.interface';
import {DialogContainerComponent} from '../dialog-container/dialog-container.component';
import {IIcon} from '@utilities/interface/common.interface';

@Component({
  selector: 'app-warn-dialog',
  templateUrl: './warn-dialog.component.html',
  styleUrls: ['./warn-dialog.component.scss'],
})
export class WarnDialogComponent
  extends BaseDialog<IWarnDialogData>
  implements OnInit
{
  constructor(dialog: DialogContainerComponent) {
    super(dialog);
  }

  get contentType() {
    return EContent;
  }
  get icon(): IIcon {
    switch (this.dialog.data.type) {
      case EContent.Info:
        return {iconCode: 'exclamation text-warn', color: '#EFAD49'};
      default:
        return {iconCode: '', color: ''};
    }
  }

  protected override onInit(): void {
    if (!this.dialog.data.buttons) {
      this.dialog.data.buttons = {
        confirm: {
          bgColor: 'green-middle',
          text: 'common.confirm',
        },
        cancel: {
          text: 'common.cancel',
        },
      };
    }
  }
}
