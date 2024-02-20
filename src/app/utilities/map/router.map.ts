import {IMenuParams} from '../interface/router.interface';
import {
  EModule,
  EIndividualPages,
  ELogin,
  ESettingPages,
  EMenuItemFunctionMark,
  EFormPages,
} from './../enum/router.enum';

/** 主Menu：設定 */
export const SettingMenuMap = new Map<ESettingPages, IMenuParams>([
  [
    ESettingPages.Logout,
    {
      title: 'nav.logout',
      icon: 'icon-logout',
      functionMark: EMenuItemFunctionMark.Logout,
    },
  ],
]);

/** 主Menu：表單元件組 */
export const FormMenuMap = new Map<EFormPages, IMenuParams>([
  [
    EFormPages.Select,
    {
      title: 'nav.select',
      icon: 'icon-input',
      path: `${EModule.Form}/${EFormPages.Select}`,
    },
  ],
  [
    EFormPages.Button,
    {
      title: 'nav.button',
      icon: 'icon-input',
      path: `${EModule.Form}/${EFormPages.Button}`,
    },
  ],
  [
    EFormPages.Input,
    {
      title: 'nav.input',
      icon: 'icon-input',
      path: `${EModule.Form}/${EFormPages.Input}`,
    },
  ],
  [
    EFormPages.Calendar,
    {
      title: 'nav.calendar',
      icon: 'icon-calendar',
      path: `${EModule.Form}/${EFormPages.Calendar}`,
    },
  ],
  [
    EFormPages.File,
    {
      title: 'nav.file',
      icon: 'icon-upload',
      path: `${EModule.Form}/${EFormPages.File}`,
    },
  ],
  [
    EFormPages.DataDrivenForm,
    {
      title: 'nav.data-driven-form',
      icon: 'icon-questionnaire',
      path: `${EModule.Form}/${EFormPages.DataDrivenForm}`,
    },
  ],
]);

/** 主Menu */
export const MenuMap = new Map<EModule, IMenuParams>([
  [
    EModule.Form,
    {
      title: 'nav.portfolio',
      isExpand: false,
      subMenu: FormMenuMap
    },
  ],
  [
    EModule.Table,
    {
      title: 'nav.cloud-assessment',
      isExpand: false,
      path: `${EModule.Table}`
    },
  ],
  [
    EModule.Setting,
    {
      title: 'nav.settings',
      isExpand: false,
      subMenu: SettingMenuMap,
    },
  ],
]);

/** login menu */
export const LoginMap = new Map<ELogin, IMenuParams>([
  [
    ELogin.Login,
    {
      title: 'nav.login',
      icon: 'icon-login',
      isExpand: false,
      path: ELogin.Login,
    },
  ],
  [
    ELogin.Register,
    {
      title: 'nav.register',
      icon: 'fa fa-registered',
      isExpand: false,
      path: ELogin.Register,
    },
  ],
]);

export const IndividualPageMap = new Map<EIndividualPages, IMenuParams>([
  [
    EIndividualPages.Home,
    {
      title: 'nav.home',
      icon: '',
      isExpand: false,
      path: EIndividualPages.Home,
    },
  ],
]);
