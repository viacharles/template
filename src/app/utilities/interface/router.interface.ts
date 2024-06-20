import { EMenuItemFunctionMark } from '@utilities/enum/router.enum';
import { ROLE } from '../enum/common.enum';

export interface IMenuParams {
  title: string;
  icon?: string;
  path?: string;
  isExpand?: boolean;
  roles?: ROLE[];
  subMenu?: Map<string, IMenuParams>;
  functionMark?: EMenuItemFunctionMark;
}
