import {Component, Input} from '@angular/core';
import {ELoadingStatus} from '@utilities/enum/common.enum';

@Component({
  selector: 'app-loading-overlay-section',
  templateUrl: './loading-overlay-section.component.html',
  styleUrls: ['./loading-overlay-section.component.scss'],
})
export class LoadingOverlaySectionComponent {
  @Input() status = ELoadingStatus.Loading;
  @Input() showText = true;
  get statusType() {
    return ELoadingStatus;
  }
  get des(): string {
    return this.status === this.statusType.Loading
      ? 'common.loading'
      : this.status === this.statusType.Error
        ? 'common.api-error-no-data'
        : this.status === this.statusType.Empty
          ? 'common.no-data'
          : '';
  }
}
