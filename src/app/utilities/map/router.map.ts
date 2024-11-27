import { IMenuParams } from '../interface/router.interface';
import {
  Modules,
  IndividualPages,
  LoginPages,
  SettingPages,
  MenuItemFunctionMark,
  FormPages,
} from './../enum/router.enum';

/** 主Menu：設定 */
export const SettingMenuMap = new Map<SettingPages, IMenuParams>([
  [
    SettingPages.Logout,
    {
      title: 'nav.logout',
      icon: 'icon-logout',
      functionMark: MenuItemFunctionMark.Logout,
    },
  ],
]);

/** 主Menu：表單元件組 */
export const FormMenuMap = new Map<FormPages, IMenuParams>([
  [
    FormPages.CustomComponent,
    {
      title: 'nav.custom-component',
      icon: 'icon-input',
      path: `${Modules.Form}/${FormPages.CustomComponent}`,
    },
  ],
  // [
  //   FormPages.Button,
  //   {
  //     title: 'nav.button',
  //     icon: 'icon-inpu t',
  //     path: `${Modules.Form}/${FormPages.Button}`,
  //   },
  // ],
  // [
  //   FormPages.Input,
  //   {
  //     title: 'nav.input',
  //     icon: 'icon-input',
  //     path: `${Modules.Form}/${FormPages.Input}`,
  //   },
  // ],
  // [
  //   FormPages.File,
  //   {
  //     title: 'nav.file',
  //     icon: 'icon-upload',
  //     path: `${Modules.Form}/${FormPages.File}`,
  //   },
  // ],
  [
    FormPages.DynamicForm,
    {
      title: 'nav.data-driven-form',
      icon: 'icon-questionnaire',
      path: `${Modules.Form}/${FormPages.DynamicForm}`,
    },
  ],
]);

/** 主Menu */
export const MenuMap = new Map<Modules, IMenuParams>([
  [
    Modules.Form,
    {
      title: 'nav.form',
      isExpand: false,
      subMenu: FormMenuMap
    },
  ],
  [
    Modules.Table,
    {
      title: 'nav.data-table',
      isExpand: false,
      path: `${Modules.Table}`
    },
  ],
  [
    Modules.Setting,
    {
      title: 'nav.settings',
      isExpand: false,
      subMenu: SettingMenuMap,
    },
  ],
]);

/** login menu */
export const LoginMap = new Map<LoginPages, IMenuParams>([
  [
    LoginPages.Login,
    {
      title: 'nav.login',
      icon: 'icon-login',
      isExpand: false,
      path: LoginPages.Login,
    },
  ],
  [
    LoginPages.Register,
    {
      title: 'nav.register',
      icon: 'fa fa-registered',
      isExpand: false,
      path: LoginPages.Register,
    },
  ],
]);

export const IndividualPageMap = new Map<IndividualPages, IMenuParams>([
  [
    IndividualPages.Home,
    {
      title: 'nav.home',
      icon: '',
      isExpand: false,
      path: IndividualPages.Home,
    },
  ],
]);
