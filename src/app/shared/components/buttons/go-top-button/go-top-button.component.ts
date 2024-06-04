import {Component, Renderer2} from '@angular/core';

@Component({
  selector: 'app-go-top-button',
  templateUrl: './go-top-button.component.html',
  styleUrls: ['./go-top-button.component.scss'],
})
export class GoTopButtonComponent {
  constructor(
    private renderer: Renderer2
  ) {}

  public click(button: HTMLButtonElement): void {
    this.renderer.addClass(button, 'clicked');
    setTimeout(() => {
      this.renderer.removeClass(button, 'clicked');
    }, 300);
  }
}
