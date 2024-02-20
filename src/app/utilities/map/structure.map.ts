import {
  EDemandType,
  EStructureScope,
  EStructureScopeForEnd,
  EStructureScopeForEndUpdate,
  EStructureStatus,
} from '@utilities/enum/structure.enum';
import {IIcon} from '@utilities/interface/common.interface';
import {IStructureTabMapParam} from '@utilities/interface/structure.interface';

/** 標題i18n -> 後端tab名稱 */
export const StructureTabMap = new Map<EStructureScope, IStructureTabMapParam>([
  [
    EStructureScope.Decision,
    {
      forUpdate: EStructureScopeForEndUpdate.Decision,
    },
  ],
  [
    EStructureScope.Business,
    {
      forRes: EStructureScopeForEnd.Business,
      forUpdate: EStructureScopeForEndUpdate.Business,
    },
  ],
  [
    EStructureScope.Info,
    {
      forRes: EStructureScopeForEnd.Info,
      forUpdate: EStructureScopeForEndUpdate.Info,
    },
  ],
  [
    EStructureScope.Tech,
    {
      forRes: EStructureScopeForEnd.Tech,
      forUpdate: EStructureScopeForEndUpdate.Tech,
    },
  ],
  [
    EStructureScope.Infra,
    {
      forRes: EStructureScopeForEnd.Infra,
      forUpdate: EStructureScopeForEndUpdate.Infra,
    },
  ],
  // [ EStructureScope.Spec, {
  //   forRes: EStructureScopeForEnd.Spec,
  //   forUpdate: EStructureScopeForEndUpdate.Spec
  // }],
]);

/** 需求類型 -> icon樣式 */
export const StructureDemandTypeMap = new Map<EDemandType, IIcon>([
  [
    EDemandType.New,
    {
      color: 'blue-middle',
      iconCode: '',
      title: 'structure.demand-type-new',
    },
  ],
  [
    EDemandType.Optimize,
    {
      color: 'green-middle',
      iconCode: '',
      title: 'structure.demand-type-optimize',
    },
  ],
  [
    EDemandType.Emergency,
    {
      color: 'red-middle',
      iconCode: '',
      title: 'structure.demand-type-emergency',
    },
  ],
]);

/** tab編號 -> icon樣式 */
export const StructureScopeMap = new Map<EStructureScope, IIcon>([
  [
    EStructureScope.Decision,
    {
      color: 'purple',
      iconCode: EStructureScope.Decision,
      title: 'structure.tab-decision',
    },
  ],
  [
    EStructureScope.Business,
    {
      color: 'red',
      iconCode: EStructureScope.Business,
      title: 'structure.tab-business',
    },
  ],
  [
    EStructureScope.Info,
    {
      color: 'orange',
      iconCode: EStructureScope.Info,
      title: 'structure.tab-info',
    },
  ],
  [
    EStructureScope.Tech,
    {
      color: 'yellow',
      iconCode: EStructureScope.Tech,
      title: 'structure.tab-tech',
    },
  ],
  [
    EStructureScope.Infra,
    {
      color: 'green',
      iconCode: EStructureScope.Infra,
      title: 'structure.tab-infra',
    },
  ],
  // [ EStructureScope.Spec, {
  //   color: "green",
  //   iconCode: "",
  //   title: "structure.tab-spec"
  // }],
]);

/** 決策狀態 -> icon樣式 */
export const DecisionTypeMap = new Map<EStructureStatus, IIcon>([
  [
    EStructureStatus.Publish,
    {
      color: 'green-middle',
      iconCode: 'confirmed-round',
      title: 'structure.published',
    },
  ],
  [
    EStructureStatus.Editing,
    {
      color: 'orange-middle',
      iconCode: 'edit',
      title: 'structure.editing',
    },
  ],
  [
    EStructureStatus.Cancel,
    {
      color: 'grey-iron',
      iconCode: 'cancel-round',
      title: 'structure.canceled',
    },
  ],
  [
    EStructureStatus.Draft,
    {
      color: 'green-light-icon',
      iconCode: 'edit',
      title: 'structure.draft',
    },
  ],
]);
