import {EQuartileCheckListTopicName} from '@utilities/enum/quartile.enum';
import {EQuestionSectionId} from '@utilities/enum/question.enum';

/** 專案內四分位數id > 四分位數查表的項目 */
export const ProjectQuartileMap = new Map<
  EQuestionSectionId,
  IQuartileMapParams
>([
  [
    EQuestionSectionId.BUSINESS,
    {
      checkListTopicName: EQuartileCheckListTopicName.BUSINESS,
      titleI18n: 'project.table-biz-impact',
    },
  ],
  [
    EQuestionSectionId.RISK,
    {
      checkListTopicName: EQuartileCheckListTopicName.RISK,
      titleI18n: 'project.table-risk-level',
    },
  ],
  [
    EQuestionSectionId.TECH,
    {
      checkListTopicName: EQuartileCheckListTopicName.TECH,
      titleI18n: 'project.table-tech-cost',
    },
  ],
]);

/** 四分位數查表項目key > (專案內四分位數id & 四分位數查表的項目) */
export const QuartileMap = new Map<
  EQuartileCheckListTopicName,
  IQuartileMapParams
>([
  [
    EQuartileCheckListTopicName.BUSINESS,
    {
      sectionId: EQuestionSectionId.BUSINESS,
      titleI18n: 'project.table-biz-impact',
    },
  ],
  [
    EQuartileCheckListTopicName.RISK,
    {
      sectionId: EQuestionSectionId.RISK,
      titleI18n: 'project.table-risk-level',
    },
  ],
  [
    EQuartileCheckListTopicName.TECH,
    {
      sectionId: EQuestionSectionId.TECH,
      titleI18n: 'project.table-tech-cost',
    },
  ],
]);

export interface IQuartileMapParams {
  titleI18n: string;
  checkListTopicName?: EQuartileCheckListTopicName;
  sectionId?: EQuestionSectionId;
  levels?: {
    color: string;
    value: number;
  }[];
}
