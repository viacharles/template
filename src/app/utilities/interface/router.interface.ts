import {EMenuItemFunctionMark} from '@utilities/enum/router.enum';
import {ERole} from '../enum/common.enum';

export interface IMenuParams {
  title: string;
  icon?: string;
  path?: string;
  isExpand?: boolean;
  roles?: ERole[];
  subMenu?: Map<string, IMenuParams>;
  functionMark?: EMenuItemFunctionMark;
}
