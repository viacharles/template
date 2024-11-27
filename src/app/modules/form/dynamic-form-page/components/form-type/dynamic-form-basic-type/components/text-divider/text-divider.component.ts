import { Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsModule } from '@shared/components/buttons/buttons.module';
import { EColorType, ESize } from '@utilities/enum/common.enum';
import { IDFQuestionView } from 'src/app/modules/form/dynamic-form-page/shared/interface/dynamic-form.interface';

@Component({
  selector: 'app-text-divider',
  standalone: true,
  imports: [TranslateModule, ButtonsModule],
  templateUrl: './text-divider.component.html',
  styleUrl: './text-divider.component.scss'
})
export class TextDividerComponent implements OnChanges {
  @Input() iconName = '';
  @Input() position: 'top' | 'bottom' = 'top';
  @Input() groupIndex?: number;
  @Input() questionIndex?: number;
  @Input() question?: IDFQuestionView;

  constructor(
    private readonly renderer: Renderer2,
    private readonly self: ElementRef
    ) { }

  public colorType = EColorType;
  public sizeType = ESize;

  ngOnChanges({position}: SimpleChanges): void {
    if (position && position.currentValue) {
      this.setPosition(position.currentValue);
    }
  }

  private setPosition(position: string): void {
    const self = this.self.nativeElement
    if (position === 'top') {
      this.renderer.setStyle(self, 'bottom', 'unset');
      this.renderer.setStyle(self, 'top', '-13px');
    } else {
      this.renderer.setStyle(self, 'top', 'unset');
      this.renderer.setStyle(self, 'bottom', '-13px');
    };
  }
}
