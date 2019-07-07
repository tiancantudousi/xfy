import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PermisonGard} from './service/gard/usergard.service'

import {LoginComponent} from './pages/login/login.component';
import {CompleteComponent} from './pages/complete/complete.component';

import {HomeComponent} from './pages/home/home.component';
import { CreateComponent }  from './pages/create/create.component';

import { RecoveryComponent } from './pages/recovery/recovery.component';
import { RecoveryRecoveryComponent } from './pages/recovery/pages/recovery-recovery/recovery-recovery.component';

import { LosscordComponent } from './pages/torecover/component/losscord/losscord.component'
import { WashComponent } from 'src/app/pages/wash/wash.component';
import { WashContentComponent } from 'src/app/pages/wash/pages/wash-content/wash-content.component';
import { WashResultComponent } from 'src/app/pages/wash/pages/wash-result/wash-result.component';
import { PrintmakeComponent } from 'src/app/pages/printmake/printmake.component';
import { WashcheckComponent } from 'src/app/pages/printmake/pages/washcheck/washcheck.component';
import { CountComponent } from 'src/app/pages/printmake/pages/count/count.component';
import { PrintComponent } from 'src/app/pages/printmake/pages/print/print.component';
import { MakeComponent } from 'src/app/pages/printmake/pages/make/make.component';
import { WashprintComponent } from 'src/app/pages/printmake/pages/washprint/washprint.component';
import { ConfectPackageComponent } from 'src/app/pages/printmake/pages/confect-package/confect-package.component';
import { SterilizationComponent } from 'src/app/pages/sterilization/sterilization.component';
import { WitlogComponent } from 'src/app/pages/sterilization/pages/witlog/witlog.component';
import { SterilContentComponent } from 'src/app/pages/sterilization/pages/steril-content/steril-content.component';
import { SterilResultComponent } from 'src/app/pages/sterilization/pages/steril-result/steril-result.component';
import { ApplyComponent } from 'src/app/pages/apply/apply.component';
import { ApplyContentComponent } from 'src/app/pages/apply/pages/apply-content/apply-content.component';
import { ApplyDirctComponent } from 'src/app/pages/apply/pages/apply-dirct/apply-dirct.component';
import { UseApplyComponent } from 'src/app/pages/apply/pages/use-apply/use-apply.component';
import { WlbComponent } from './pages/printmake/pages/wlb/wlb.component';
import { TorecoverComponent } from 'src/app/pages/torecover/torecover.component';



const routes:Routes=[
  {path:'',redirectTo:'/recovery',pathMatch:'full'},
 
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path:'tocover',component:TorecoverComponent},
      {
        path: 'create',
        component: CreateComponent
      }
    ],
    canActivate:[PermisonGard]
    // canActivate:[PermisonGard]
  }, 

  {
    path: 'recovery',
    component: RecoveryComponent,
    children: [
      {
        path: 'recovery',
        component: RecoveryRecoveryComponent
      },
      {
        path: 'torecovery',
        component: TorecoverComponent
      },

      {
        path: '',
        component: RecoveryRecoveryComponent
      },
    ],
    canActivate:[PermisonGard]},
  {
    path: 'torecover',
    component: TorecoverComponent},
  {
      path:'losscord',
      component:LosscordComponent
  },
  {
    path:'wash',
    component:WashComponent,
    canActivate:[PermisonGard],
    children: [
      {
        path: '',
        component: WashContentComponent
      },
      {
        path: 'wash-content',
        component: WashContentComponent
      },
      {
        path: 'wash-result',
        component: WashResultComponent
      },
    ]},

  {
    path:'printmake',
    component:PrintmakeComponent,
    canActivate:[PermisonGard],
    children: [
      {
        path: '',redirectTo:'washcheck',pathMatch:'full'
      },
      {
        path: 'print',
        component: PrintComponent
      },
      {
        path: 'make/:id',
        component: MakeComponent
      },
      {
        path: 'confect',
        component: ConfectPackageComponent,
      },
      {
        path: 'washprint/:id',
        component: WashprintComponent
      },
      {
        path: 'washcheck',
        component: WashcheckComponent
      },
      {
        path: 'count',
        component: CountComponent
      },
      {
        path: 'wlb',
        component: WlbComponent
      }
     
    ]
   
  },
  {
    path:'steril',
    component:SterilizationComponent,
    children: [
      {
        path: '',
        component: SterilContentComponent
      },
      {
        path: 'content',
        component: SterilContentComponent
      },
      {
        path:'result',
        component:SterilResultComponent
      },
      {
        path:'witlog',
        component:WitlogComponent
      }
    ]
  },
  {
    path:'apply',
    component:ApplyComponent,
    children: [
      {
        path: '',
        component: ApplyContentComponent
      },
      {
        path: 'content',
        component: ApplyContentComponent
      },
      {
        path:'dirct',
        component:ApplyDirctComponent
      }
      , {
        path:'use-apply',
        component:UseApplyComponent
      }
    ]
  },


   
];

//

@NgModule({
  imports: [RouterModule.forRoot(routes
    // { enableTracing: true }//用于调试
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }


