import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {timer} from 'rxjs';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnChanges {
  @ViewChild('tContent') tContent?: ElementRef<HTMLElement>;
  @Input() callExpand = false;
  public isExpand = false;

  ngOnChanges({callExpand}: SimpleChanges): void {
    if (callExpand.currentValue) {
      this.isExpand = callExpand.currentValue;
    }
  }

  /** 展開/閉合 */
  public toggle() {
    if (this.isExpand && this.tContent) {
      const {nativeElement} = this.tContent;
      nativeElement.classList.add('accord__content--collapse');
      timer(500).subscribe(() => {
        nativeElement.classList.remove('accord__content--collapse');
        this.isExpand = false;
      });
    } else {
      this.isExpand = true;
    }
  }
}
