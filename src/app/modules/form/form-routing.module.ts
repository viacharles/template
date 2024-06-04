import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DynamicFormPageComponent } from './dynamic-form-page/dynamic-form-page.component';
import { EFormPages } from '@utilities/enum/router.enum';
import { SelectPageComponent } from './select-page/select-page.component';
import { ButtonPageComponent } from './button-page/button-page.component';
import { InputPageComponent } from './input-page/input-page.component';
import { FilePageComponent } from './file-page/file-page.component';

const routes: Routes = [
  {path: '', component: DynamicFormPageComponent, data: {title: 'Cloud Ready - Home'}},
  {path: `${EFormPages.CustomComponent}`, component: SelectPageComponent},
  {path: `${EFormPages.Button}`, component: ButtonPageComponent},
  {path: `${EFormPages.Input}`, component: InputPageComponent},
  {path: `${EFormPages.File}`, component: FilePageComponent},
  {path: `${EFormPages.DynamicForm}`, component: DynamicFormPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule {}
