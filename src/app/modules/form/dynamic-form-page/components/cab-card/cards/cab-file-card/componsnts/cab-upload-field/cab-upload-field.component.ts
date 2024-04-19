import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormArray, FormGroup} from '@angular/forms';
import { ICabFormPage } from 'src/app/modules/form/dynamic-form-page/shared/interface/dynamic-form.interface';

@Component({
  selector: 'app-cab-upload-field',
  templateUrl: './cab-upload-field.component.html',
  styleUrls: ['./cab-upload-field.component.scss'],
})
export class CabUploadFieldComponent implements OnInit {
  @Output() onDownloadFile = new EventEmitter<{event: Event; file: string}>();
  @Output() onDownloadTempFile = new EventEmitter();
  @Output() onUpload = new EventEmitter<Event>();
  @Output() onClearFile = new EventEmitter();
  @Input() question_pages?: ICabFormPage[];
  @Input() pageIndex = 0;
  @Input() fileControl = new UntypedFormArray([]);
  @Input() isCompleteClicked = false;
  @Input() isLastFileError = false;
  /** 目前顯示的上傳檔案是在本地 */
  @Input() isFileSavedLocal = false;
  @Input() cabForm = new FormGroup({});
  constructor() {}

  get latestFile() {
    return this.fileControl.controls[this.fileControl.controls.length - 1];
  }

  ngOnInit(): void {}
}
