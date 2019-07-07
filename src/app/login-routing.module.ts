import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisonGard }            from './service/gard/usergard.service';
// import { AuthService }          from './auth.service';
import { LoginComponent }       from './pages/login/login.component';
 
const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent }
];
 
@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
     PermisonGard
  ]
})
export class LoginRoutingModule {}