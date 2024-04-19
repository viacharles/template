import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pureFunc',
  pure: true,
  standalone: true
})
export class PureFuncPipe implements PipeTransform {

  transform(templateValue: any, fnReference: (...params: any[]) => any, ...fnArguments: any[]): any {
    fnArguments.unshift(templateValue);
    return fnReference(...fnArguments);
  }
}

//// 下面寫個用法例子:
// 在angular component.ts 裡面定義自己的函數:
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnDestroy, OnInit {
//     constructor(
//     private api: ApiService,
//   ) {
//     // purePipe 函數本身沒有 this context, 用這個綁定this context
//     this.getCards = this.getCards.bind(this);
//   }
//    getCards(topic: DTOTopic) {
//     // 使用 purePipe則省去了 很多變量, 還可以排列組合把結果發給排序,過濾等其他函數.
//      return  this.api.getCardsByTopic(topic.id);
//    }
// }
// 在template 裡可以這樣調用purePipe:
// 我這裡用ngTemplateeOutlet purePipe結果存入context, 就可以在
// template 裡面 consume data 了.
// <ng-container
//   *ngTemplateOutlet="
//     cards;
//     context: {
//       data:
//         selectedTopic$
//         | async
//         | PureFunc: getCards : cardListChange
//         | async
//         | PureFunc: applyFilterPipe : (cardFilter$ | async)
//         | async
//     }
//   "
// >
// </ng-container>
// <ng-template #cards let-cards="data">
//    // enumerate data cards ...
// </ng-template>
