import {ICabApplicationAnswerRes} from '@utilities/interface/api/cab-api.interface';
import {ICabRecordInfo} from '../interface/dynamic-form.interface';
import {ECabFormProcess, ELang} from '@utilities/enum/common.enum';
import {TranslateService} from '@ngx-translate/core';

export class CabRecord {
  public records?: ICabRecordInfo[];

  constructor(
    projects: ICabApplicationAnswerRes[],
    private translate: TranslateService
  ) {
    this.records = this.getRecords(projects);
  }

  /** 以 triggerDate 排序 */
  public getRecords(projects: ICabApplicationAnswerRes[]): ICabRecordInfo[] {
    const cabGroup = projects.reduce(
      (cabGroup, project) => {
        const key = project.cabId;
        cabGroup[key] = [...(cabGroup[key] || []), project];
        return cabGroup;
      },
      {} as {[cabId: string]: ICabApplicationAnswerRes[]}
    );
    return Object.values(cabGroup)
      .sort((a, b) => (a[0].cabId < b[0].cabId ? 1 : -1))
      .map(cabsRes => {
        const cabs = cabsRes;
        const current = cabs[cabs.length - 1];
        const records = {
          current: {
            sourceData: current,
            projectName: current.projectName,
            cabId: current.cabId,
            status: current.status,
            creator: {
              departmentName:
                this.translate.currentLang === ELang.Cn
                  ? current.creator.departmentCn
                  : current.creator.departmentEn,
              sectionName:
                this.translate.currentLang === ELang.Cn
                  ? current.creator.sectionCn
                  : current.creator.sectionEn,
              name: current.creator.name,
              id: current.creator.id,
            },
          },
          list: cabs.map((cab, cabIndex) => ({
            status: cab.status,
            triggerDate: cab.triggerDate,
            content: this.getRecordItemContent(cab),
          })),
        };
        const hasReview = cabs.some((cab, index) => {
          return (
            +cab.status === ECabFormProcess.UnderReview && !!cab.reviewDate
          );
        });
        if (hasReview) {
          const reviewIndex =
            cabs.length -
            1 -
            cabs
              .sort((a, b) =>
                new Date(a.triggerDate) < new Date(b.triggerDate) ? 1 : -1
              )
              .findIndex(
                (cab, index) =>
                  +cab.status === ECabFormProcess.UnderReview &&
                  !!cab.reviewDate
              );
          cabs.sort((a, b) =>
            new Date(a.triggerDate) > new Date(b.triggerDate) ? 1 : -1
          );
          const cancelScheduleLength = cabs.filter(
            cab => +cab.status === ECabFormProcess.CancelSchedule
          ).length;
          const hasScheduleCanceled =
            cancelScheduleLength === 0
              ? false
              : cancelScheduleLength >=
                cabs.filter(cab => +cab.status === ECabFormProcess.UnderReview)
                  .length;
          /** 加入委員會會議 */
          if (reviewIndex !== -1 && !hasScheduleCanceled) {
            records.list.push({
              status: ECabFormProcess.UnderReview,
              triggerDate: cabs[reviewIndex].reviewDate ?? '',
              content: `${this.translate.instant('cab.committee-review')}`,
            });
          }
        }
        records.list = records.list.sort((a, b) =>
          new Date(a.triggerDate) > new Date(b.triggerDate) ? 1 : -1
        );
        return records;
      });
  }

  /** 項目內容文字 */
  public getRecordItemContent(project: ICabApplicationAnswerRes): string {
    const triggerSection =
      this.translate.currentLang === ELang.Cn
        ? project.trigger.sectionCn
        : project.trigger.sectionEn;
    const triggerDepartment =
      this.translate.currentLang === ELang.Cn
        ? project.trigger.departmentCn
        : project.trigger.departmentEn;
    switch (+project.status) {
      case ECabFormProcess.Draft:
        return `${triggerSection} ${triggerDepartment} ${
          project.creator.name
        } ${this.translate.instant('cab.create-form')}`;
      case ECabFormProcess.SubmitForReview:
        return `${triggerSection} ${triggerDepartment}  ${
          project.creator.name
        } ${this.translate.instant('cab.send-form')}`;
      case ECabFormProcess.UnderReview:
        return `${triggerSection} ${triggerDepartment}  ${
          project.trigger.name
        } ${this.translate.instant(
          'cab.chairman-secretary'
        )} ${this.translate.instant('cab.set-schedule')}`;
      case ECabFormProcess.Approved:
        return `${triggerSection} ${triggerDepartment}  ${
          project.trigger.name
        } ${this.translate.instant('admin.CHAIRMAN')} ${this.translate.instant(
          'cab.approved'
        )}`;
      case ECabFormProcess.RequiredForApprove:
        return `${triggerSection} ${triggerDepartment}  ${
          project.trigger.name
        } ${this.translate.instant('admin.CHAIRMAN')} ${this.translate.instant(
          'cab.already-required-for-approve'
        )}`;
      case ECabFormProcess.SupplementForApprove:
        return `${triggerSection} ${triggerDepartment}  ${
          project.creator.name
        } ${this.translate.instant('cab.already-supplement-for-approve')}`;
      case ECabFormProcess.Rejected:
        return `${triggerSection} ${triggerDepartment}  ${
          project.trigger.name
        } ${this.translate.instant('admin.CHAIRMAN')} ${this.translate.instant(
          'cab.reject'
        )}`;
      case ECabFormProcess.CancelSchedule:
        return `${triggerSection} ${triggerDepartment}  ${
          project.trigger.name
        } ${this.translate.instant(
          'cab.chairman-secretary'
        )} ${this.translate.instant('cab.cancel-schedule')}`;
      case ECabFormProcess.BackSubmitForReview:
        return `${triggerSection} ${triggerDepartment}  ${
          project.trigger.name
        } ${this.translate.instant(
          'cab.chairman-secretary'
        )} ${this.translate.instant('cab.return-send-form')}`;
      default:
        return '';
    }
  }
}
