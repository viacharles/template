import {
  IProject,
  IQuestion,
  IScore,
  IQuartileCheckList,
  IQuestionGroup,
} from '@utilities/interface/api/project-api.interface';
import {ReportTextMap} from '@utilities/map/question.map';
import {EQuestionSectionId} from '@utilities/enum/question.enum';
import {Question} from './question.model';
import {Quartile} from './quartile.model';
import {TranslateService} from '@ngx-translate/core';
import {IFormlyAnswer} from './answer.model';

export class Project {
  public source?: IProject;
  public report?: IReport;
  /** 給formly使用的答案格式 */
  private formlyAnswer?: IFormlyAnswer;
  private quartile?: Quartile;
  private question?: Question;
  constructor(
    project: IProject,
    questionSource: IQuestion,
    quartileCheckList?: IQuartileCheckList,
    $translate?: TranslateService
  ) {
    this.source = project;
    if (quartileCheckList && $translate) {
      this.quartile = new Quartile(quartileCheckList, project, $translate);
      this.question = new Question(questionSource);
      this.question.setQuestionSectionMap(questionSource);
      this.question.setQuestionIdMap(questionSource);
      if (project.scores && quartileCheckList && $translate) {
        this.report = this.getReport($translate);
      }
    }
  }

  public getFormlyAnswer(): IFormlyAnswer {
    if (!this.formlyAnswer) {
      const Project = this.source!;
      const Question = this.question?.source!;
      let answer: IFormlyAnswer = {};
      Object.keys(Project.answers).forEach(key => {
        const Value = Project.answers[key].value;
        Question.groups.forEach(group =>
          Object.entries(group.questions).forEach(([questionKey, question]) => {
            if (questionKey === key) {
              answer[key] =
                question.type === 'multiselect'
                  ? (Value as number[])
                  : Value[0];
            }
          })
        );
      });
      this.formlyAnswer = answer;
    }
    return this.formlyAnswer;
  }

  private getReport($translate: TranslateService): IReport | undefined {
    if (!this.report && this.source?.scores) {
      const Project = this.source!;
      const QuestionSource = this.question?.source!;
      const Scores = Project.scores!;
      this.report = this.report ?? {
        sections: QuestionSource.groups
          .filter(group =>
            ReportTextMap.has(group.sectionId as EQuestionSectionId)
          )
          .reduce((groups: IQuestionGroup[], group: IQuestionGroup) => {
            const TargetSection = groups.find(
              (item: any) => item.sectionId === group.sectionId
            );
            if (TargetSection) {
              TargetSection.reportGroups = [
                ...TargetSection.reportGroups!,
                {
                  groupName: group.groupName,
                  groupId: group.groupId,
                  questions: group.questions,
                },
              ];
            } else {
              groups.push({
                ...group,
                ...{
                  reportGroups: [
                    {
                      groupName: group.groupName,
                      groupId: group.groupId,
                      questions: group.questions,
                    },
                  ],
                },
              });
            }
            return groups;
          }, [])
          .sort((a, b) => a.groupOrder - b.groupOrder)
          .map(newGroup => ({
            title: $translate.instant(
              `questions.report-title-${newGroup.section.split(' ')[0]}`
            ),
            descHtml: this.getDescHtml(
              newGroup.sectionId as EQuestionSectionId,
              Scores,
              $translate
            ),
            paragraphs: newGroup.reportGroups!.map(reportGroup => ({
              title: `${reportGroup.groupName}得分: `,
              score: Scores.find(
                score => score.sectionId === newGroup.sectionId
              )?.groups.find(group => group.groupId === reportGroup.groupId)
                ?.originalRegular!,
              items: Object.entries(reportGroup.questions)
                .filter(
                  ([questionKey, question]) =>
                    (question.type === 'select' ||
                      question.type === 'multiselect') &&
                    Project.answers[questionKey] &&
                    Project.answers[questionKey].value !== null
                )
                .sort((a, b) => a[1].questionOrder - b[1].questionOrder)
                .reduce(
                  (options, [questionKey, question]) => {
                    return [
                      ...options,
                      ...question
                        .options!.filter(
                          option =>
                            Project.answers[questionKey].value.some(
                              valueItem => valueItem === option.value
                            ) &&
                            option.reportAdvice &&
                            !!option.reportAdvice.trim()
                        )
                        .map(option => ({
                          text: option.reportAdvice,
                          isHighLight: option.reportHighLight,
                        })),
                    ];
                  },
                  [] as {text: string; isHighLight: boolean}[]
                ),
            })),
          })),
      };
    }
    return this.report;
  }

  /** 獲得說明文字 */
  private getDescHtml(
    id: EQuestionSectionId,
    scores: IScore[],
    $translate: TranslateService
  ): string {
    if (scores) {
      const Text = $translate.instant(ReportTextMap.get(id)!);
      const Score = scores.find(score => score.sectionId === id)!;
      const Style = this.quartile?.getColorAndI18nAndLevels(
        scores,
        Score.sectionId
      )!;
      const LevelText = $translate.instant(Style.levelI18n);
      return Text.replace(
        '${score}',
        `<span style="color:${Style.color}">${Score.originalRegular}/100</span>`
      ).replace(
        '${levelText}',
        `<span style="color:${Style.color}">「${LevelText}」</span>`
      );
    } else {
      return '';
    }
  }
}

/** 報告
 * @param sections 大項目
 * @param desc 第一段描述文字
 * @param paragraphs 內文段落
 * @param items 內文項目  */
export interface IReport {
  sections: {
    title: string;
    descHtml: string;
    paragraphs: {
      title: string;
      score: number;
      items: {
        text: string;
        isHighLight: boolean;
      }[];
    }[];
  }[];
}
