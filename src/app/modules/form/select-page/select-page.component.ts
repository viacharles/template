import { Component } from '@angular/core';
import { IDynamicOption } from '@utilities/interface/form.interface';
/**
 * @description 醫師排班(單一班次)
 * @param doctorNo:醫師代碼
 * @param doctorName:醫師名稱
 * @param workDate:排班日期
 * @param rank:排班診次代碼
 * @param rankName:排班診次名稱
 * @param assistNo:關聯助理編號(多個以逗號分隔)
 * @param assistName:關聯助理名稱(多個以逗號分隔)
 * @param remark:排班備註
 */
export interface ISingleDoctorSchedule {
  doctorNo: string,
  doctorName: string,
  workDate: string,
  rank: string,
  rankName: string,
  assistNo: string,
  assistName: string,
  remark: string,
}

@Component({
  selector: 'app-select-page',
  templateUrl: './select-page.component.html',
  styleUrls: ['./select-page.component.scss']
})
export class SelectPageComponent {

  public options: IDynamicOption<string>[] = [
    {
      code: '0',
      name: '小町當',
    },
    {
      code: '1',
      name: '瓜牛帶我去散步',
    },
    {
      code: '2',
      name: '亞洲最大梗圖專門網站。提供每日有趣梗圖',
      hasMemo: true
    },
    {
      code: '3',
      name: '中英夾雜的比較 high class 嗎？',
    },
    {
      code: '4',
      name: '「不好意思，我明天的 schedule 滿了，讓我 book 後天的時間好嗎？」',
    },
    {
      code: '12',
      name: '項目1333333333333333333333333333',
    },
    {
      code: '15',
      name: ' 最後一項',
    },
  ];

  public schedule =
    {
      doctorNo: '001',
      doctorName: '項目一',
      workDate: '20230101',
      rank: '1',
      rankName: '早班',
      assistNo: '001',
      assistName: '子項目一',
      remark: '備註',
    }


}
