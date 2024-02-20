import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from './safe-html.pipe';
import {TruncatePipe} from './truncate.pipe';

@NgModule({
  declarations: [SafeHtmlPipe, TruncatePipe],
  exports: [SafeHtmlPipe, TruncatePipe],
  imports: [CommonModule],
})
export class PipeModule {}
