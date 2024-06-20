import { CoreModule } from '@core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import { ToastComponent } from './toast/toast.component';
import { AssistantChatComponent } from './assistant-chat/assistant-chat.component';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { WarnDialogComponent } from './warn-dialog/warn-dialog.component';
import { FullScreenImgOverlayComponent } from './full-screen-img-overlay/full-screen-img-overlay.component';
import { PipeModule } from '@shared/pipes/pipe.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { SelectDropdownContainerComponent } from './dropdown/select-dropdown-container/select-dropdown-container.component';
import { SelectDropdownComponent } from './dropdown/select-dropdown/select-dropdown.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OverlayComponent,
    DialogContainerComponent,
    ToastComponent,
    AssistantChatComponent,
    WarnDialogComponent,
    FullScreenImgOverlayComponent,
    SelectDropdownContainerComponent,
    SelectDropdownComponent,
  ],
  exports: [
    OverlayComponent,
    DialogContainerComponent,
    ToastComponent,
    AssistantChatComponent,
    WarnDialogComponent,
    FullScreenImgOverlayComponent,
    SelectDropdownContainerComponent,
    SelectDropdownComponent,
  ],
  imports: [CommonModule, CoreModule, PipeModule, SharedModule, TranslateModule, ReactiveFormsModule],
})
export class OverlayModule {}
