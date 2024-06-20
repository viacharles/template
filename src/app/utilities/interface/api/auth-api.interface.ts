import { ROLE, EUserStatus } from '@utilities/enum/common.enum';
import { ITenant } from '../tenant.interface';

export interface IUser {
  createdTime: string;
  email: string;
  enabledNotifications: boolean;
  lastLogin: string | null;
  lastUpdated: string | null;
  name: string;
  role: ROLE[];
  status: EUserStatus;
  tenantId: string;
  userId: string;
  jobTitle: string;
  department: string;
  section: string;
  tenantRespDtos: ITenant[];
}

export interface ILoginApiRes {
  userLoginRespDto: {
    token: string;
  };
}

export interface IExchangeTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: string;
}

/** 不同環境的設定 */
export interface ISettingInfo {
  /** 是否測試用 saml  */
  isSamlTest: string;
  /** saml logout path  */
  samlLogoutPath: string;
  /** mock saml logout path  */
  mockSamlLogoutPath: string;
  chatEnable: string;
}
