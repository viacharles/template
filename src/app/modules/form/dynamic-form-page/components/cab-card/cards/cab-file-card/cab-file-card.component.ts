import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { ICabFormPage } from '../../../../shared/interface/cab.interface';

@Component({
  selector: 'app-cab-file-card',
  templateUrl: './cab-file-card.component.html',
  styleUrls: ['./cab-file-card.component.scss'],
})
export class CabFileCardComponent implements OnInit {
  @Output() onDownloadFile = new EventEmitter<{event: Event; file: string}>();
  @Output() onDownloadTempFile = new EventEmitter();
  @Output() onUpload = new EventEmitter<Event>();
  @Input() question_pages?: ICabFormPage[];
  @Input() pageIndex = 0;
  @Input() fileControl = new FormGroup({});
  @Input() isCompleteClicked = false;
  @Input() cabForm = new FormGroup({});
  constructor() {}

  ngOnInit(): void {}
}
