import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { LoginService }      from '../http/login.service';

@Injectable()
export class PermisonGard implements CanActivate {
  constructor(private loginservice: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    // if (this.loginservice.islogin) { return true; }
    // // Store the attempted URL for redirecting
    // this.loginservice.redirectUrl = url;
    // console.log(url,'this isurl');

    // // Navigate to the login page with extras
    // this.router.navigate(['/login']);
    // return false;

    // Store the attempted URL for redirecting
    if(!this.loginservice.getlogin()){
      // this.loginservice.redirectUrl = url;
      // console.log(url,'this isurl');
        // Navigate to the login page with extras
      this.router.navigate(['/login']);
    }
    return this.loginservice.islogin;
  }
}