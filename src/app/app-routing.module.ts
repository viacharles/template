import {EModule} from '@utilities/enum/router.enum';
// angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// core
import {AuthGuard, DefaultGuard} from './core/auth.guard';
import {AuthenticationService} from './core/services/authentication.service';

// components
import { PageNotFoundComponent } from './modules/layout/page-not-found/page-not-found.component';

export const baseRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    canActivateChild: [DefaultGuard],
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: `${EModule.Form}`,
    canActivateChild: [AuthGuard],
    loadChildren: () =>
    import('./modules/form/form-elements.module').then(m => m.FormElementsModule),
  },
  {
    path: `${EModule.Table}`,
    canActivateChild: [AuthGuard],
    loadChildren: () =>
    import('./modules/table/table-page.module').then(m => m.TablePageModule),
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      baseRoutes,
      // { preloadingStrategy: PreloadAllModules }
      // TODO: this is for Production-Release only. unfortunately, no way to do this dynamically at the moment
      {onSameUrlNavigation: 'reload'}
    ),
  ],
  exports: [RouterModule],
  providers: [AuthenticationService],
})
export class AppRoutingModule {}
