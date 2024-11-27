import { IndividualPages, Modules } from '@utilities/enum/router.enum';
// angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// core
import { AuthGuard, DefaultGuard } from './core/auth.guard';
import { AuthenticationService } from './core/services/authentication.service';

export const baseRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: IndividualPages.Home,
    canActivateChild: [DefaultGuard],
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: `${Modules.Form}`,
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./modules/form/form-elements.module').then(m => m.FormElementsModule),
  },
  {
    path: `${Modules.Table}`,
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./modules/table/table-page.module').then(m => m.TablePageModule),
  },
  { path: '**', redirectTo: IndividualPages.Home, pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      baseRoutes,
      // { preloadingStrategy: PreloadAllModules }
      // TODO: this is for Production-Release only. unfortunately, no way to do this dynamically at the moment
      { onSameUrlNavigation: 'reload' }
    ),
  ],
  exports: [RouterModule],
  providers: [AuthenticationService],
})
export class AppRoutingModule { }
