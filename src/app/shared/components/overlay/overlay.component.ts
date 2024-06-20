import { Component, Injector, OnInit } from '@angular/core';
import { OverlayService } from '@shared/service/overlay.service';
import { IDialog } from '@utilities/interface/overlay.interface';
import { UnSubOnDestroy } from '@utilities/abstract/unSubOnDestroy.abstract';
import { takeUntil } from 'rxjs';
import {
  fadeEnterAndHideOut,
  fadeSlideInAndHideSlideOut,
  scaleInShortenOut,
  fadeOut,
} from '@utilities/helper/animations.helper';
import { Dialog } from '@utilities/model/dialog.model';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  animations: [fadeEnterAndHideOut(), fadeSlideInAndHideSlideOut(), fadeOut(), scaleInShortenOut()],
})
export class OverlayComponent extends UnSubOnDestroy implements OnInit {
  constructor(
    public $overlay: OverlayService,
    private injector: Injector
  ) {
    super();
  }

  public currentDialogs: IDialog[] = [];

  ngOnInit(): void {
    this.$overlay.dialogQueue$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(dialogs => this.afterDialogsChanged(dialogs));
  }

  /** dialog 序列來源發生改變後 */
  private afterDialogsChanged(srcDialogs: IDialog[]): void {
    srcDialogs.forEach(srcDialog => {
      if (!this.currentDialogs.some(({id}) => srcDialog.id === id)) {
        this.currentDialogs.push(new Dialog(srcDialog, this.injector));
      };
    });
    this.currentDialogs = this.currentDialogs.filter(dialog =>
      srcDialogs.some(srcDialog => srcDialog.id === dialog.id)
    );
  }
}
