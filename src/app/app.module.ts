import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './modules/layout/sidebar/sidebar.component';
import { FooterComponent } from './modules/layout/footer/footer.component';
import { LayoutBaseComponent } from './modules/layout/layout-base/layout-base.component';
import { PageNotFoundComponent } from './modules/layout/page-not-found/page-not-found.component';
import { OverlayModule } from '@shared/components/overlay/overlay.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LayoutBaseComponent,
    SidebarComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OverlayModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  public static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
