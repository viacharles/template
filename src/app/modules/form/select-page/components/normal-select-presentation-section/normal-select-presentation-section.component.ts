import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IOption } from '@utilities/interface/common.interface';

@Component({
  selector: 'app-normal-select-presentation-section',
  templateUrl: './normal-select-presentation-section.component.html',
  styleUrls: ['./normal-select-presentation-section.component.scss']
})
export class NormalSelectPresentationSectionComponent {
  @Input() options: IOption[] = [];
  
  public configForm = new FormGroup({
    disable: new FormControl(false)
  })
}
