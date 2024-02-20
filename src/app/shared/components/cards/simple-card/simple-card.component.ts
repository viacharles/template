import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IDropDownConfig} from '@shared/components/dropdown/icon-dropdown/icon-dropdown.component';
import {ELoadingStatus} from '@utilities/enum/common.enum';
import {IChartConfig} from '@utilities/interface/chart.interface';
import {IOption} from '@utilities/interface/common.interface';

@Component({
  selector: 'app-simple-card',
  templateUrl: './simple-card.component.html',
  styleUrls: ['./simple-card.component.scss'],
})
export class SimpleCardComponent<T extends IChartConfig> {
  @Input() data?: T;
  @Input() dropdownConfig?: IDropDownConfig;
  @Input() options?: IOption[];
  @Input() showMenu = false;
  @Input() title?: string = '';
  @Input() status?: ELoadingStatus;
  @Output() optionSelected = new EventEmitter();
  get loadingStatusType() {
    return ELoadingStatus;
  }
}
