import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import { IconDefinition } from '@ant-design/icons-angular';
// import { AccountBookFill, AlertFill, AlertOutline } from '@ant-design/icons-angular/icons';

import {JsonpModule} from "@angular/http";

import { AppRoutingModule} from './app-routing.module';
import { LoginRoutingModule } from './login-routing.module';
import {LocationStrategy,HashLocationStrategy} from '@angular/common';

import {ButtonTriggerDirective} from './service/http/directive2';
import {btntoggleDirective } from './service/http/directive';

import { AppComponent } from './core/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { NgZorroAntdModule, NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd';
import { NgZorroAntdModule, NZ_I18N, zh_CN,NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { CompleteComponent } from './pages/complete/complete.component';
import { LoginComponent } from './pages/login/login.component';
import { TorecoverComponent } from './pages/torecover/torecover.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { RecoveryHeaderComponent } from './pages/recovery/components/recovery-header/recovery-header.component';
import { RecoverySiderComponent } from './pages/recovery/components/recovery-sider/recovery-sider.component';
import { FooterComponent } from './componets/footer/footer.component';
import { RecoveryRecoveryComponent } from './pages/recovery/pages/recovery-recovery/recovery-recovery.component';

import { LosscordComponent } from './pages/torecover/component/losscord/losscord.component';
import { WarningDialogComponent } from './componets/dialog/warning-dialog/warning-dialog.component';
import { WashComponent } from './pages/wash/wash.component';
import { WashHeaderComponent } from './pages/wash/component/wash-header/wash-header.component';
import { WashSliderComponent } from './pages/wash/component/wash-slider/wash-slider.component';
import { WashContentComponent } from './pages/wash/pages/wash-content/wash-content.component';
import { WashResultComponent } from './pages/wash/pages/wash-result/wash-result.component';
import { MultiplePipe } from './service/pipe/multiple.pipe';
import { PrintmakeComponent } from './pages/printmake/printmake.component';
import { PrintmakeHeaderComponent } from './pages/printmake/component/printmake-header/printmake-header.component';
import { PrintmakeSliderComponent } from './pages/printmake/component/printmake-slider/printmake-slider.component';
import { PrintComponent } from './pages/printmake/pages/print/print.component';
import { MakeComponent } from './pages/printmake/pages/make/make.component';
import { WashprintComponent } from './pages/printmake/pages/washprint/washprint.component';
import { PrintmakeHelpComponent } from './pages/printmake/component/printmake-help/printmake-help.component';
import { ConfectPackageComponent } from './pages/printmake/pages/confect-package/confect-package.component';
import { SterilizationComponent } from './pages/sterilization/sterilization.component';
import { SterilContentComponent } from './pages/sterilization/pages/steril-content/steril-content.component';
import { TestpipePipe } from './pipe/testpipe.pipe';
import { HeaderComponent } from './componets/header/header.component';
import { SliderComponent } from './componets/slider/slider.component';
import { SterilResultComponent } from './pages/sterilization/pages/steril-result/steril-result.component';
import { GetHMSPipe } from './pipe/get-hms.pipe';
import { ApplyComponent } from './pages/apply/apply.component';
import { ApplyContentComponent } from './pages/apply/pages/apply-content/apply-content.component';
import { ApplyDirctComponent } from './pages/apply/pages/apply-dirct/apply-dirct.component';
import { ListComponent } from './componets/list/list.component';
import { WashcheckComponent } from './pages/printmake/pages/washcheck/washcheck.component';
import { CountComponent } from './pages/printmake/pages/count/count.component';
import { WitlogComponent } from './pages/sterilization/pages/witlog/witlog.component';
import { UseApplyComponent } from './pages/apply/pages/use-apply/use-apply.component';
import { SearchSlideComponent } from './componets/search-slide/search-slide.component';
import { SearchKslistComponent } from './componets/search-kslist/search-kslist.component';
import { WlbComponent } from './pages/printmake/pages/wlb/wlb.component';




registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateComponent,
    CompleteComponent,
    LoginComponent,
    TorecoverComponent,
    RecoveryComponent,
    RecoveryHeaderComponent,
    RecoverySiderComponent,
    FooterComponent,
    RecoveryRecoveryComponent,
    LosscordComponent,
    WarningDialogComponent,
    WashComponent,
    WashHeaderComponent,
    WashSliderComponent,
    WashContentComponent,
    WashResultComponent,
    MultiplePipe,
    PrintmakeComponent,
    PrintmakeHeaderComponent,
    PrintmakeSliderComponent,
    PrintComponent,
    MakeComponent,
    WashprintComponent,
    PrintmakeHelpComponent,
    ButtonTriggerDirective,
    btntoggleDirective,
    ConfectPackageComponent,
    SterilizationComponent,
    SterilContentComponent,
    TestpipePipe,
    HeaderComponent,
    SliderComponent,
    SterilResultComponent,
    GetHMSPipe,
    ApplyComponent,
    ApplyContentComponent,
    ApplyDirctComponent,
    ListComponent,
    WashcheckComponent,
    CountComponent,
    WitlogComponent,
    UseApplyComponent,
    SearchSlideComponent,
    SearchKslistComponent,
    WlbComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    LoginRoutingModule,
    AppRoutingModule,
    JsonpModule    
  ],
  entryComponents: [
    LosscordComponent,

    WarningDialogComponent
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN },{provide:LocationStrategy,useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
