import {Component, Input, OnInit} from '@angular/core';
import {EFormMode} from '@utilities/enum/common.enum';

@Component({
  selector: 'app-side-tab-popup-dialog',
  templateUrl: './side-tab-popup-dialog.component.html',
  styleUrls: ['./side-tab-popup-dialog.component.scss'],
})
export class SideTabPopupDialogComponent implements OnInit {
  @Input() width = '';
  @Input() isExpand = false;

  constructor() {}

  public formMode?: EFormMode;

  get mode() {
    return EFormMode;
  }

  ngOnInit(): void {}
}
