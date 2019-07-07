import { Component, OnInit,OnDestroy,AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute,Params,NavigationEnd} from '@angular/router';
import { EmitService } from 'src/app/service/middleman.service';
import {environment} from './../../../../../environments/environment'
import { PublicuseService } from 'src/app/service/http/publicuse.service';

@Component({
  selector: 'app-printmake-slider',
  templateUrl: './printmake-slider.component.html',
  styleUrls: ['./printmake-slider.component.scss']
})
export class PrintmakeSliderComponent implements OnInit,OnDestroy,AfterViewInit{

  public chooseobj={'washprint/:id':false,'confect':false,'count':false,'check':false,'washcheck':true,'print':false,'wlb':false}
  // testMake;
  // testConfect;
  
    constructor(private router:Router,
      private route:ActivatedRoute,
      private middlemanservice:EmitService,
      private publicservice:PublicuseService
    ) { 
      // if(environment.switch){
      //   this.testMake=environment.make;
      //   this.testConfect=environment.confect;
      // }else{

      // }
      // let data=this.publicservice.getSwitch('make');
      // this.testMake=data['openif'];
      // console.log(this.testMake,data,'this.testMake');
     
    }
    //控制开关
    getopen(){
      this.publicservice.getSwitch('make').subscribe(res=>{
        console.log(res,'异步请求返回结果');
        if(res){
          // this.testMake=res['openif'];
        }
      })
    }
  
    ngOnInit() {
      // this.getopen();
      console.log(this.chooseobj,this.route.children[0].routeConfig.path,'chooseobj');
      this.activebool(this.route.children[0].routeConfig.path,this.chooseobj);
    }
    ngAfterViewInit(){
      // this.activebool('washcheck',this.chooseobj);
    }
    getwashers(){
      this.activebool('washprint/:id',this.chooseobj);
 
      this.middlemanservice.eventEmithmakepackage.emit('1');
      this.route.params.subscribe((params:Params)=>{
        console.log(params,this.route,'params');
        if(this.route.children[0].routeConfig.path=='washprint/:id'||this.route.children[0].routeConfig.path=='print'){
          return;
        }
        else{
          console.log('路由通过');
          // this.router.navigate(['/printmake/washprint','1']);
          this.router.navigate(['/printmake/washprint']);
        }
      })

   
     
    }
    wlb(){
      this.activebool('wlb',this.chooseobj);
      this.router.navigate(['/printmake/wlb']);
    }
    goprint(){
      this.activebool('print',this.chooseobj);
      this.middlemanservice.eventEmithmakepackage.emit('1');
      this.router.navigate(['/printmake/print']);
    }
    ngOnDestroy(){
      // this.router.events.unsubscribe();
        //  console.log('printmake 侧边栏被销毁');
        //  this.router.events.unsubscribe();     
    }
    goresult(){
      // console.log(this.result);
      this.activebool('confect',this.chooseobj);
      this.router.navigate(['/printmake/confect']);
      this.middlemanservice.eventEmithmakepackage.emit(null);
    }
    gowashcheck(){
      // console.log(this.result);
      this.activebool('washcheck',this.chooseobj);
      this.router.navigate(['/printmake/washcheck']);
      // this.middlemanservice.eventEmithmakepackage.emit(null);
    }
    gocount(){
      this.activebool('count',this.chooseobj);
      this.router.navigate(['/printmake/count']);
    }
    // gocheck(){
    //   this.activebool('check',this.chooseobj);
    //   // this.router.navigate(['/wash/wash-check']);
    // }
    // gocount(){
    //   this.activebool('count',this.chooseobj);
    //   // this.router.navigate(['/wash/wash-count']);
    // }
    activebool(item,thisobj){
      console.log(item,thisobj,'bug');
      for(let key in thisobj){
         if(item==key){
            thisobj[key]=true;
         }
         else{
           thisobj[key]=false;
         }
      }
    }
    getactiveroute(){
      let url=location.href;
      let i=url.lastIndexOf('-');
      let active=url.slice(i+1,url.length);
      this.activebool(active,this.chooseobj);
    }
  

}
