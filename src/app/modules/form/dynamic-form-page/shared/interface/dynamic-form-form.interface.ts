import { EErrorMessage, EFieldType } from "@utilities/enum/form.enum";
import { IDynamicOption } from "@utilities/interface/form.interface";

export interface IEditDynamicForm {
  required?: boolean;
  title: string;
  des?: string;
  placeholder?: string;
  fieldType: EFieldType;
  validation?: {
    type: EErrorMessage,
    value?: (number | string)[] | null
  }[] | null;
  options?: IDynamicOption<string>[] | null;
}
