import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconDropdownComponent} from './components/dropdown/icon-dropdown/icon-dropdown.component';
import {NoDataSectionComponent} from './components/sections/no-data-section/no-data-section.component';
import {TranslateModule} from '@ngx-translate/core';
import {AccordionComponent} from './components/accordion/accordion.component';
import {GoTopButtonComponent} from './components/buttons/go-top-button/go-top-button.component';
import {PageTabSetComponent} from './components/layout/page-tabset/page-tab-set.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SimpleCardComponent} from './components/cards/simple-card/simple-card.component';
import {TooltipComponent} from './components/tooltip/tooltip/tooltip.component';
import {PipeModule} from './pipes/pipe.module';
import {LoadingOverlaySectionComponent} from './components/sections/loading-overlay-section/loading-overlay-section.component';
import {BreadCrumbsComponent} from './components/bread-crumbs/bread-crumbs.component';
import {TabsComponent} from './components/tab/tabs.component';
import {SideTabPopupDialogComponent} from './components/overlay/side-tab-popup-dialog/side-tab-popup-dialog.component';
import {AccordionListCardComponent} from './components/accordion/accordion-list-card/accordion-list-card.component';
import { SortThComponent } from './components/icon/sort-th/sort-th.component';

@NgModule({
  declarations: [
    IconDropdownComponent,
    NoDataSectionComponent,
    AccordionComponent,
    GoTopButtonComponent,
    PageTabSetComponent,
    SimpleCardComponent,
    TooltipComponent,
    LoadingOverlaySectionComponent,
    BreadCrumbsComponent,
    TabsComponent,
    SideTabPopupDialogComponent,
    AccordionListCardComponent,
    SortThComponent,
  ],
  exports: [
    IconDropdownComponent,
    NoDataSectionComponent,
    AccordionComponent,
    GoTopButtonComponent,
    PageTabSetComponent,
    SimpleCardComponent,
    TooltipComponent,
    LoadingOverlaySectionComponent,
    BreadCrumbsComponent,
    TabsComponent,
    SideTabPopupDialogComponent,
    AccordionListCardComponent,
    SortThComponent,
    PipeModule
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
  ],
})
export class SharedModule {}
