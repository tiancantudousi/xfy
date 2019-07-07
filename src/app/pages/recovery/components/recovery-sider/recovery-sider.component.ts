import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

@Component({
  selector: 'app-recovery-sider',
  templateUrl: './recovery-sider.component.html',
  styleUrls: ['./recovery-sider.component.scss']
})
export class RecoverySiderComponent implements OnInit {
  public chooseobj={recover:true,torecover:false}
  constructor(  private router:Router) { }

  ngOnInit() {
  }
  gorecover(){
    this.activebool('recover',this.chooseobj);
    this.router.navigate(['/recovery/recovery']);
  }
  gotorecover(){
    this.activebool('torecover',this.chooseobj);
    this.router.navigate(['/recovery/torecovery']);
  }
  activebool(item,thisobj){
    for(let key in thisobj){
       if(item==key){
          thisobj[key]=true;
       }
       else{
         thisobj[key]=false;
       }
    }
  }

}
