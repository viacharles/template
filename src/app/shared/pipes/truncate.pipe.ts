import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  /** 固定字數之後的內容變成"..."
   * @param length 最大顯示字數
   */
  transform(text: string, length: number): string {
    return text.length > length ? text.slice(0, length + 1) + '...' : text;
  }
}
