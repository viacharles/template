/** 需求 */
export enum EDemandType {
  New = 1,
  Optimize,
  Emergency,
}
/** 領域 */
export enum EStructureScope {
  Decision = 0,
  Business,
  Info,
  Tech,
  Infra,
}
/** 狀態 */
export enum EStructureStatus {
  Publish = 'publish',
  Editing = 'editing',
  Cancel = 'cancel',
  Draft = 'null',
  Delete = 'delete',
}

export enum EStructureScopeForEnd {
  Business = 'arcBussinesses',
  Info = 'arcInfos',
  Tech = 'arcTeches',
  Infra = 'arcInfras',
}
export enum EStructureScopeForEndUpdate {
  Decision = 'decision',
  Business = 'business',
  Info = 'info',
  Tech = 'tech',
  Infra = 'infra',
}
