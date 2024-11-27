import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [getFormProvider(SearchInputComponent)],
})
export class SearchInputComponent extends CustomForm<string> {
  @Output() search = new EventEmitter<string>();
  @Input() placeholder = '請輸入';
  constructor() {
    super();
  }

  public override model = '';
  public override disabled = false;

  public input(event: KeyboardEvent, value: string): void {
    this.notifyValueChange(value);
    if (event.code === 'Enter' && !event.isComposing) {
      this.search.emit(value);
    }
  }

  public clear(): void {
    this.notifyValueChange('');
  }
}
