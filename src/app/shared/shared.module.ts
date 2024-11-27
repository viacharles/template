import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDropdownComponent } from './components/dropdown/icon-dropdown/icon-dropdown.component';
import { NoDataSectionComponent } from './components/sections/no-data-section/no-data-section.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from './components/accordion/accordion.component';
import { PageTabSetComponent } from './components/layout/page-tabset/page-tab-set.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleCardComponent } from './components/cards/simple-card/simple-card.component';
import { TooltipComponent } from './components/tooltip/tooltip/tooltip.component';
import { PipeModule } from './pipes/pipe.module';
import { LoadingOverlaySectionComponent } from './components/sections/loading-overlay-section/loading-overlay-section.component';
import { BreadCrumbsComponent } from './components/bread-crumbs/bread-crumbs.component';
import { TabsComponent } from './components/tab/tabs.component';
import { SideTabPopupDialogComponent } from './components/overlay/side-tab-popup-dialog/side-tab-popup-dialog.component';
import { AccordionListCardComponent } from './components/accordion/accordion-list-card/accordion-list-card.component';
import { ButtonsModule } from './components/buttons/buttons.module';
import { DirectiveModule } from './directives/directive.module';

@NgModule({
  declarations: [
    IconDropdownComponent,
    NoDataSectionComponent,
    AccordionComponent,
    PageTabSetComponent,
    SimpleCardComponent,
    TooltipComponent,
    LoadingOverlaySectionComponent,
    BreadCrumbsComponent,
    TabsComponent,
    SideTabPopupDialogComponent,
    AccordionListCardComponent,
  ],
  exports: [
    IconDropdownComponent,
    NoDataSectionComponent,
    AccordionComponent,
    PageTabSetComponent,
    SimpleCardComponent,
    TooltipComponent,
    LoadingOverlaySectionComponent,
    BreadCrumbsComponent,
    TabsComponent,
    SideTabPopupDialogComponent,
    AccordionListCardComponent,
    PipeModule,
    ButtonsModule,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    ButtonsModule,
    DirectiveModule
  ],
})
export class SharedModule {}
