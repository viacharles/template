import {
  IAnswer,
  IQuestion,
} from '@utilities/interface/api/project-api.interface';

export class Answer {
  public answer?: IAnswer;
  constructor(questions: IQuestion, answers: IFormlyAnswer) {
    this.answer = this.getAnswer(questions, answers);
  }

  /** 獲得答案(API要求格式)  */
  private getAnswer(questions: IQuestion, formModel: IFormlyAnswer): IAnswer {
    const answer: any = {
      questionTemplateId: questions.questionTemplateId,
      answers: {},
    };
    questions.groups.forEach(group =>
      Object.keys(group.questions).forEach(key => {
        if (
          formModel[key] !== undefined &&
          formModel[key] !== null &&
          (formModel[key] as []).length !== 0
        ) {
          answer.answers[key] = {
            value:
              typeof formModel[key] === 'object'
                ? formModel[key]
                : typeof formModel[key] === 'string'
                  ? [this.format(formModel[key] as string)]
                  : [formModel[key]],
          };
        }
      })
    );
    return answer;
  }

  /** 格式值 */
  private format(value: string): string {
    if (typeof value === 'string') {
      value = value.trim().replace(/\n{2,}/g, '\n');
    }
    return value;
  }
}

/** formly 使用規格的答案(評估表) */
export interface IFormlyAnswer {
  [key: string]: string | number | null | number[];
}
