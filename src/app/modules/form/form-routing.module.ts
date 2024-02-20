import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FormPageComponent } from './form-page/form-page.component';
import { EFormPages } from '@utilities/enum/router.enum';
import { SelectPageComponent } from './select-page/select-page.component';
import { ButtonPageComponent } from './button-page/button-page.component';
import { InputPageComponent } from './input-page/input-page.component';
import { FilePageComponent } from './file-page/file-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';

const routes: Routes = [
  {path: '', component: FormPageComponent, data: {title: 'Cloud Ready - Home'}},
  {path: `${EFormPages.Select}`, component: SelectPageComponent},
  {path: `${EFormPages.Button}`, component: ButtonPageComponent},
  {path: `${EFormPages.Input}`, component: InputPageComponent},
  {path: `${EFormPages.File}`, component: FilePageComponent},
  {path: `${EFormPages.Calendar}`, component: CalendarPageComponent},
  {path: `${EFormPages.DataDrivenForm}`, component: FormPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule {}
