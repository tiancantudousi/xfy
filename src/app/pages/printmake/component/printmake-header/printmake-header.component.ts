import { Component, OnInit,TemplateRef } from '@angular/core';
import storage from './../../../../service/storage';
import {Router,ActivatedRoute,ParamMap,Params,NavigationEnd} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EmitService } from 'src/app/service/middleman.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { store } from '@angular/core/src/render3/instructions';
import { PrintMakeService } from '../../../../service/http/printmake.service';
import { PublicuseService } from '../../../../service/http/publicuse.service';
import { Observable, of } from 'rxjs';
import { MyUserServService } from '../../../../service/gard/my-user-serv.service';
import { ToolsService } from 'src/app/service/tools/tools.service';
@Component({
  selector: 'app-printmake-header',
  templateUrl: './printmake-header.component.html',
  styleUrls: ['./printmake-header.component.scss']
})
export class PrintmakeHeaderComponent implements OnInit {


  private name:string;
  
    public userName: string="李岚 0232";
    public userId: string;
    public deptId: string;
    public deptName: string;
    public todayrecovery:number=0;
  
    public totalnum:number=100;//总锅次
    public daynum:number=10;//日锅次
    public btn1="primary";
    public btn2="default";
    public serviceip;
    public isadd=true;
    hideall=true;
    changepanmodal;
    machineip;
    machinename;
    active=false;

    public showmakepackage=true;
    constructor(
      private router:Router,
      private routerinfo:ActivatedRoute,
      private middlemanserivce:EmitService,
      private modalService: NzModalService,
      private service:PrintMakeService,
      private publicservice:PublicuseService,
      private userService: MyUserServService,
      private toolservice: ToolsService
    ) {
      const message = storage.get('userMessage');
      this.userName = message['userName'];
      this.userId = message['userId'];
      this.deptId = message['deptId'];
      this.deptName = message['deptName'];
      
    }
    gobackhome(){
      this.router.navigate(['/home']);
    }
    loginout(){
      sessionStorage.setItem('islogin','false'); 
      storage.set('userMessage', null);
      this.router.navigate(['/login']);
    }
    gowashprint(){
      this.btn1="primary";
      this.btn2="default";
     
      this.router.navigate(['/printmake/washprint','1']);
    }
    goprint(){
      this.btn1="default";
      this.btn2="primary";
      this.router.navigate(['/printmake/print']);
    }
    reprint(){
      console.log(this.router);
      this.router.navigate(['/printmake/washprint','0']);
   
    }

    ngOnInit() {
      this.routerinfo.params.subscribe((params:Params)=>{
        this.showmakepackage=(params.id=='1')?false:true;
          console.log(params);
      })
      this.middlemanserivce.eventEmithmakepackage.subscribe(res=>{
        this.showmakepackage=(res=='1')?false:true;
        this.active=true;
      });
      this.confectshow(this.routerinfo.children[0].routeConfig.path);
      this.serviceip= sessionStorage.getItem('ip');
      //let observer=new Observable((observer)=>{this.publicservice.getip(observer);}).subscribe((value)=>{
      //  this.serviceip=value;
      //});


      // this.userService.getIpAddress().subscribe(data => {

      //   console.log(data);
  
      // });
      // this.userService.getIpAddress().subscribe(data => {

      //   console.log(data,'date');
  
      // });
      // this.middlemanserivce.eventEmithmakepackage.subscribe((item)=>{
      //   if(item){
      //     this.showmakepackage=false;
      //   }
      //   else{
      //     this.showmakepackage=true;
      //   }
      //      console.log('配包打包',this.routerinfo.children[0].routeConfig.path=="count",item);
      // });
      
      this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event:NavigationEnd) => {
        console.log(this.routerinfo.children[0].routeConfig.path,'header 当前路由');
        // if(this.routerinfo.children[0].routeConfig.path=="count"||this.routerinfo.children[0].routeConfig.path=="washcheck"){
        //   this.hideall=false;
        // }
        // else{
        //   this.hideall=true;
        // }
        this.confectshow(this.routerinfo.children[0].routeConfig.path)
      //do something
      });
    }
    confectshow(val){
        switch(val){
          case 'washcheck':this.hideall=false;break;
          case 'count':this.hideall=false;break;
          case 'confect':this.hideall=true;this.showmakepackage=true;break;
          case 'print':this.hideall=true;this.showmakepackage=false;break;
          case 'washprint/:id':this.hideall=true;this.showmakepackage=false;break;
        }
    }
    //点击配包
    confectPackage(){
      this.router.navigate(['/printmake/confect']);
    }
    //打包
    makePackage(){
      this.router.navigate(['/printmake/make','1']);
    }
    //直接配包
    directConfect(){
      this.router.navigate(['/printmake/make','0']);
    }
      //创建打印弹窗
  createModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    console.log(location.href)
    if(storage.get('machineip')){
      this.isadd=false;
      this.machineip=storage.get('machineip')
    }
    if(storage.get('machinename')){
      this.isadd=false;
      this.machinename=storage.get('machinename')
    }
    this.changepanmodal = this.modalService.create({
      nzTitle: tplTitle,
      nzOkType: 'primary',
      nzContent: tplContent,
      nzFooter: tplFooter
    });
    this.changepanmodal.nzWidth = 490;
  }
  // sure(){
  //   storage.set('machineip',this.machineip);
  //   storage.set('machinename',this.machinename);
  //   this.changepanmodal.destroy();
  // }
 //获取灭菌机列表
//  {"sysid":"web","ssoid":"","specialcode":"","sign":"DA944624C718CAA806A5E5555D78ED9B",
//  "timestamp":"","v":"1.0","req":
//  {"service":"ParamService","method":"updateAa10","args":{"AA10":{"aaa102":"0","aaa103":
//  "空闲中1","aaa100":"QXJ_STATE","aaa101":"清洗机状态","baa110":"","aaa105":"","aaa106":"",
//  "aaa107":"","aaa104":"1","baa109":"1","baa108":"0","aae013":""}}}}


 sure(){
  
  const data = {
    // "service":"ParamService","method":"addAa10"
    AA10:{"aaa102":this.serviceip,"aaa103":this.machineip,"aaa100":"PC_DYIP","aaa101":"PC打印配置IP","baa110":"","aaa105":"","aaa106":"","aaa107":"","aaa104":"1","baa109":"1","baa108":"0","aae013":""},
  };
if(this.isadd){
  this.service.addAa10(data).subscribe(res =>{
    if (res['status'] === 'OK') {
     storage.set('machineip',this.machineip);
     this.dyname();
    }else{
      storage.set('machineip',this.machineip);
      storage.set('machinename',this.machinename);
      this.toolservice.createMessage('warning',res.message);
      this.changepanmodal.destroy();
    }
    
  })
}else{
  this.service.updateAa10(data).subscribe(res =>{
    if (res['status'] === 'OK') {
     storage.set('machineip',this.machineip);
     this.dyname();
    }else{
      storage.set('machineip',this.machineip);
      this.toolservice.createMessage('warning',res.message);
      this.changepanmodal.destroy();
    }
  })
}
  
}



dyname(){
  const data = {
    // "service":"ParamService","method":"addAa10"
    AA10:{"aaa102":this.serviceip,"aaa103":this.machinename,"aaa100":"PC_DYNAME","aaa101":"PC打印配置打印机名称","baa110":"","aaa105":"","aaa106":"","aaa107":"","aaa104":"1","baa109":"1","baa108":"0","aae013":""},
  };
  if(this.isadd){
  this.service.addAa10(data).subscribe(res =>{
    if (res['status'] === 'OK') {
     storage.set('machinename',this.machinename);
     this.changepanmodal.destroy();
    }else{
      this.toolservice.createMessage('warning',res.message);
    }
  })
}else{
  this.service.updateAa10(data).subscribe(res =>{
    if (res['status'] === 'OK') {
      storage.set('machinename',this.machinename);
      this.changepanmodal.destroy();
    }else{
      this.toolservice.createMessage('warning',res.message);
    }
  })
}
}



}

