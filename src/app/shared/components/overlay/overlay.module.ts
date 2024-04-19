import {CoreModule} from '@core/core.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayComponent} from './overlay.component';
import {ToastComponent} from './toast/toast.component';
import {AssistantChatComponent} from './assistant-chat/assistant-chat.component';
import {DialogContainerComponent} from './dialog-container/dialog-container.component';
import {WarnDialogComponent} from './warn-dialog/warn-dialog.component';
import {FullScreenImgOverlayComponent} from './full-screen-img-overlay/full-screen-img-overlay.component';
import {PipeModule} from '@shared/pipes/pipe.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    OverlayComponent,
    DialogContainerComponent,
    ToastComponent,
    AssistantChatComponent,
    WarnDialogComponent,
    FullScreenImgOverlayComponent,
  ],
  exports: [
    OverlayComponent,
    DialogContainerComponent,
    ToastComponent,
    AssistantChatComponent,
    WarnDialogComponent,
    FullScreenImgOverlayComponent,
  ],
  imports: [CommonModule, CoreModule, PipeModule, SharedModule],
})
export class OverlayModule {}
