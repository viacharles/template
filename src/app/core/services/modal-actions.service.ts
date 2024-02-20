import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalActionsService {
  constructor() {}

  modalAction(modalData: any) {
    // switch (modalData.name) {
    //   case 'forget-password':
    //     this.sendResetPasswordEmail(modalData);
    //     break;
    //   default:
    //     break;
    // }
  }
}

// TODO: Peter, please double-check... is this class / service really necessary? is it a placeholder for something else? if yes, please leave a comment to avoid being deprecated
// KL: 4/13 - service/file will be deprecated
