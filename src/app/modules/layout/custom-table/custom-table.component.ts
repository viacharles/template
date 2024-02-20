import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {environment} from 'src/environments/environment';
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit {
  @Input() displayedLabels!: any;
  @Input() displayedColumns!: any;
  @Input() filterUserList: any;
  @Output() selectedUser: EventEmitter<any> = new EventEmitter<any>();

  check_list!: any[];
  masterSelected!: boolean;

  constructor() {
    this.masterSelected = false;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterUserList']['currentValue'] !== undefined) {
      this.check_list = [];
      this.filterUserList.forEach((user: any) => {
        this.check_list.push(false);
      });
    }
  }

  selectUpdate() {
    const temp_list: any[] = [];
    this.check_list.forEach((value, index) => {
      if (value) {
        temp_list.push(this.filterUserList[index]);
      }
    });
    this.selectedUser.emit(temp_list);
  }

  checkUncheckAll() {
    this.check_list.forEach(
      (each, i) => (this.check_list[i] = this.masterSelected)
    );
    if (!environment.production) console.log(this.check_list);
  }

  clearMasterSelected() {
    this.masterSelected = false;
    return;
  }
}
