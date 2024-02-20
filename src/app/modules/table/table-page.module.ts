import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TablePageRoutingModule } from './table-page-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { ShareFormModule } from '@shared/components/form/share-form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TablePageComponent } from './table-page/table-page.component';
import { DataTableModule } from '@shared/components/data-table/data-table.module';
import { NewTableItemComponent } from './new-table-item/new-table-item.component';



@NgModule({
  declarations: [
    TablePageComponent,
    NewTableItemComponent
  ],
  imports: [
    CommonModule,
    TablePageRoutingModule,
    DataTableModule,
    TranslateModule,
    SharedModule,
    ShareFormModule,
    ReactiveFormsModule,
  ],
  providers: [
    DatePipe
  ]
})
export class TablePageModule { }
