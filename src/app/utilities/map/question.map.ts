import {
  EQuestionGroupId,
  EQuestionSectionId,
} from '@utilities/enum/question.enum';
import {IField} from '@utilities/interface/api/project-api.interface';

/** 第一階主題id > 題目 */
export const QuestionSectionMap = new Map<
  EQuestionSectionId,
  {[key: string]: IField} | undefined
>([
  [EQuestionSectionId.BUSINESS, undefined],
  [EQuestionSectionId.RISK, undefined],
  [EQuestionSectionId.TECH, undefined],
]);

/** 題目id > (第一階主題id & 第二階主題id) */
export const QuestionIdMap = new Map<
  string,
  {sectionId: EQuestionSectionId; groupId: EQuestionGroupId}
>([]);
/** 題目id > 題目資料 */
export const QuestionMap = new Map<string, IField>([]);

/** 第一階主題id > report第一段文字i18n */
export const ReportTextMap = new Map<EQuestionSectionId, string>([
  [EQuestionSectionId.BUSINESS, 'questions.report-content-biz'],
  [EQuestionSectionId.RISK, 'questions.report-content-rick'],
  [EQuestionSectionId.TECH, 'questions.report-content-tech'],
]);
