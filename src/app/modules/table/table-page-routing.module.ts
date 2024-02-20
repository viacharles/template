import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ETablePages } from '@utilities/enum/router.enum';
import { NewTableItemComponent } from './new-table-item/new-table-item.component';
import { TablePageComponent } from './table-page/table-page.component';

const routes: Routes = [
  {path: '', component: TablePageComponent, data: {title: 'Cloud Ready - Home'}},
  {path: `${ETablePages.Table}`, component: TablePageComponent},
  {path: `${ETablePages.New}`, component: NewTableItemComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablePageRoutingModule {}
