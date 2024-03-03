import * as moment from 'moment';

export class TimeHelper {
  constructor() {}

  public static get today(): string {
    return TimeHelper.formatDateTw(new Date());
  }

  public static formatMoment(date: string | Date): moment.Moment {
    return moment(new Date(date), ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']);
  }

  /**
   * @description 轉換日期格式(Tw)
   */
  public static formatDateTw(
    date: string | Date,
    format = 'YYYY-MM-DD'
  ): string {
    moment.locale('zh-tw');
    return moment(new Date(date), ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']).format(
      format
    );
  }

  /**
   * @description 轉換日期格式(En)
   */
  public static formatDateEn(
    date: string | Date,
    format = 'YYYY-MM-DD'
  ): string {
    moment.locale('en');
    return moment(new Date(date), ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']).format(
      format
    );
  }

  /**
   * @description 取得特定日期
   * @param date 日期
   * @param amount 增加的單位量
   * @param unit 單位
   */
  public static formatSpecDate(
    date: moment.MomentInput,
    amount: moment.DurationInputArg1 = 0,
    unit: moment.DurationInputArg2 = 'day'
  ): string {
    return moment(date, ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']).add(amount, unit).toISOString();
  }

  /**
   * @description 取得特定邊界日期
   * @param date 日期
   * @param amount 增加的單位量
   * @param unit 單位
   */
  public static formatBoundaryDate(
    date: moment.MomentInput,
    amount: moment.DurationInputArg1,
    unit: moment.DurationInputArg2,
    start = true
  ): string {
    const Target = moment.utc(date, ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']).add(amount, unit);
    return (start ? Target.startOf(unit) : Target.endOf(unit)).toISOString();
  }

  /**
   * @description 取得兩日期間距
   * @param start 開始日期
   * @param end 結束日期
   * @param unit 計算單位
   * @returns
   */
  public static getOffset(
    start: moment.MomentInput,
    end: moment.MomentInput,
    unit: moment.DurationInputArg2
  ): number {
    const Offset = Math.abs(moment(start, ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']).diff(moment(end, ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']), unit));
    return !Offset ? Offset : Offset + 1;
  }

  public static isSame(
    date1: string,
    date2: moment.MomentInput,
    unit: moment.unitOfTime.StartOf | undefined = 'date'
  ): boolean {
    return moment(new Date(date1), ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD']).isSame(date2, unit);
  }
}
