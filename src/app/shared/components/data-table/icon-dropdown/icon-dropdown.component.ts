import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-icon-dropdown',
  templateUrl: './icon-dropdown.component.html',
  styleUrls: ['./icon-dropdown.component.scss'],
})
export class TableIconDropdownComponent {
  @Input() iconCode = 'chevron-down';
  @Input() config?: IDataTableDropDownConfig;
  @ViewChild('tDropdown') tDropdown?: ElementRef;
  @ViewChild('tButton', {static: true}) tButton!: ElementRef;

  constructor() {}

  public isOpen = false;

  @HostListener('click', ['$event']) click(event: Event): void {
    if (
      !(
        this.tDropdown && this.tDropdown.nativeElement.contains(event.target)
      ) &&
      !this.tButton.nativeElement.contains(event.target)
    ) {
      this.isOpen = false;
    }
  }

  public toggle(event: Event): void {
    if (
      !(this.tDropdown && this.tDropdown.nativeElement.contains(event.target))
    ) {
      this.isOpen = !this.isOpen;
    }
  }
}

/**
 * @param hideTail 顯示對話框尾巴
 * @param positionY 顯示時固定的高度
 * @param positionStartX 顯示時對齊的位置
 */
export interface IDataTableDropDownConfig {
  hideTail?: boolean;
  borderRadius?: string;
  positionY?: 'high' | 'middle' | 'low';
  positionStartX?: 'start' | 'center' | 'end';
}
