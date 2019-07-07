import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { EmitService } from 'src/app/service/middleman.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sterilization',
  templateUrl: './sterilization.component.html',
  styleUrls: ['./sterilization.component.scss']
})
export class SterilizationComponent implements OnInit {
  public todaytimes;
  public totaltimes;
  public todaytotaltimes;
  public showresult;

  constructor(
    private router:Router,
    private emitservice:EmitService,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.emitservice.eventEmitdifferntimes.subscribe((obj)=>{
      this.todaytimes=obj.todaytimes;
      this.todaytotaltimes=obj.todaytotaltimes;
      this.totaltimes=obj.totaltimes;
    })
    this.showresult=this.route.children[0].routeConfig.path=='result'?true:false;
    console.log(this.route.children[0].routeConfig.path);
  }
  goteril(){
    this.router.navigate(['/steril/content']);
  }
  goresult(){
    this.router.navigate(['/steril/result']);
  }
  getalltimes(value){
    console.log(value,'diffentimes');
  }
  gowitlog(){
    this.router.navigate(['/steril/witlog']);
  }
}
