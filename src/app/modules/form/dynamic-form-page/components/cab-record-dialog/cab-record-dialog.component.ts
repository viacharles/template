import {Component, Input, OnChanges} from '@angular/core';
import {IAccordionListCard} from '@shared/components/accordion/accordion-list-card/accordion-list-card.component';
import {ICabRecordInfo} from '../../shared/interface/dynamic-form.interface';
import {BaseDialog} from '@utilities/base/base-dialog';
import {DialogContainerComponent} from '@shared/components/overlay/dialog-container/dialog-container.component';

@Component({
  selector: 'app-cab-record-dialog',
  templateUrl: './cab-record-dialog.component.html',
  styleUrls: ['./cab-record-dialog.component.scss'],
})
export class CabRecordDialogComponent extends BaseDialog<{
  card: IAccordionListCard<ICabRecordInfo>;
}> {
  constructor(dialog: DialogContainerComponent) {
    super(dialog);
  }

  get card() {
    return this.data.card;
  }
}
