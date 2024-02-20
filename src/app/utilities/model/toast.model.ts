import {EContent} from '@utilities/enum/common.enum';
import {IToast} from '../interface/overlay.interface';
import {IArticle} from '@utilities/interface/common.interface';
import {OverlayService} from '@shared/service/overlay.service';
import {timer} from 'rxjs';
export class Toast implements IToast {
  public id = '';
  public type?: EContent;
  public article?: IArticle;
  /** 是否顯示消失動畫 */
  public isHideAnim = false;
  constructor(
    toast: IToast,
    private overlayService: OverlayService
  ) {
    Object.assign(this, toast);

    if (this.type === EContent.Error || this.type === EContent.Warn) {
      timer(5000).subscribe(() => {
        this.isHideAnim = true;
        timer(500).subscribe(() => {
          this.overlayService.deleteToast(toast);
        });
      });
    } else {
      timer(2000).subscribe(() => {
        this.isHideAnim = true;
        timer(500).subscribe(() => {
          this.overlayService.deleteToast(toast);
        });
      });
    }
  }
}
