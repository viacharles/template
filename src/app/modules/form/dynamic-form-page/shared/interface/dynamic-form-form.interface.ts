import { EErrorMessage, EFieldType } from "@utilities/enum/form.enum";

export interface IEditDynamicForm {
  required: boolean;
  title: string;
  des: string;
  placeholder: string;
  fieldType: EFieldType;
  validation: {
    type: EErrorMessage,
    value?: number[] | null
  }[] | null;
  options: {
    hasMemo: boolean,
    content: (string | number)
  }[] | null;
}
