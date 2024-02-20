import {SharedModule} from '@shared/shared.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {CoreModule} from '@core/core.module';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {DataTableModule} from '@shared/components/data-table/data-table.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CoreModule,
    MatSelectModule,
    DataTableModule,
    SharedModule,
    DataTableModule,
  ],
})
export class HomeModule {}
