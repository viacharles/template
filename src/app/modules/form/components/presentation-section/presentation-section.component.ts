import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-presentation-section',
  templateUrl: './presentation-section.component.html',
  styleUrls: ['./presentation-section.component.scss']
})
export class PresentationSectionComponent {
  @Input() title = '';
  @Input() tabName = '';
  @Input() des = '';

}
