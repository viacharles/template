import { Component, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() bgColor = 'primary';
  @Input() height = '2.25rem'
  @Input() icon = '';
  @Input() classes = '';

  constructor(
    private renderer: Renderer2
  ) { }

  public click(button: HTMLElement): void {
    this.renderer.addClass(button, 'clicked');
    setTimeout(() => {
      this.renderer.removeClass(button, 'clicked');
    }, 300);
  }

}
