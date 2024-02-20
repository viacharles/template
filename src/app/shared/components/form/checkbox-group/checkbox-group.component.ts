import {Component, Input, OnInit} from '@angular/core';
import {IOption} from '@utilities/interface/common.interface';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent implements OnInit {
  @Input() options: IOption[] = [];
  /** 是否為多選 */
  @Input() isMulti = true;

  constructor() {}

  ngOnInit(): void {}
}
