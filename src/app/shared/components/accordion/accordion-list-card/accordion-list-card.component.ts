import {Component, EventEmitter, Input, Output} from '@angular/core';
import {downFadeInAndCompressOut} from '@utilities/helper/animations.helper';

export interface IAccordionListCard<T> {
  data: T;
  header: {
    title?: string;
    innerHTML?: string;
    button?: {
      iconCode: string;
      color: string;
      hoverColor: string;
      text: string;
    };
  };
  list: {
    content?: string;
    innerHTML?: string;
  }[];
}

@Component({
  selector: 'app-accordion-list-card',
  templateUrl: './accordion-list-card.component.html',
  styleUrls: ['./accordion-list-card.component.scss'],
  animations: [downFadeInAndCompressOut()],
})
export class AccordionListCardComponent<T = any> {
  @Input() card?: IAccordionListCard<T>;
  @Output() functionClick = new EventEmitter<IAccordionListCard<T>>();

  constructor() {}

  public open = false;

  public function(event: Event) {
    event.stopPropagation();
    this.functionClick.emit(this.card);
  }
}
