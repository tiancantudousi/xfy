import { Component, Input, TemplateRef, ViewChild,OnInit,AfterViewInit,OnDestroy} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

import { TorecoverComponent } from './../../../../pages/torecover/torecover.component';
import { RecoveryService } from './../../../../service/http/recovery.service'

import { BrokedataService } from './../../../../service/state/wastage.service'

import { EmitService } from './../../../../service/middleman.service'

import storage from './../../../../service/storage'
import {DatePipe} from "@angular/common";
import { Router }  from '@angular/router';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/service/tools/tools.service';


@Component({
  selector: 'app-recovery-header',
  templateUrl: './recovery-header.component.html',
  styleUrls: ['./recovery-header.component.scss']
})
export class RecoveryHeaderComponent implements OnInit ,AfterViewInit,OnDestroy{
  isVisible:boolean=false;

  public count;
  public todayrecoverycount=0;

  // public toberecoverlist;

  public userName: string;
  public userId: string;
  public deptId: string;
  public deptName: string;
  public todayrecovery:number=0;
  public tempcount;
  private changepanmodal;
  private table;
  isLoading=false;
  constructor(private modalService:NzModalService,
    private service:RecoveryService,
    private brokedataservice:BrokedataService,
    private emitserivce:EmitService,
    private datepipe:DatePipe,
    private router:Router,
    private toolservice:ToolsService
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
   }

  tplModal: NzModalRef;
  modal2;
  data;
  hsr;
  ngOnInit() {
    let timenow=new Date();
    let nowday=this.datepipe.transform(timenow,'yyyy-MM-dd');
    let postday;
    postday={"end_dt_hs":`${nowday} 23:59:59`,"isChecked":false,"start_dt_hs":`${nowday} 00:00:00`};
    this.getodayrecover(postday)
    this.getoberecovery();
    this.emitserivce.eventEmittodayrecover.subscribe((value)=>{
      this.getodayrecover(value);
      this.getoberecovery();
    });
    this.emitserivce.hsr.subscribe((value)=>{
      this.hsr=value;

    });
    this.emitserivce.eventEmithaverecovercount.subscribe(()=>{
      this.todayrecoverycount++;
    })
    this.emitserivce.eventEmittempcount.subscribe((value)=>{
        console.log(value,'value');
        this.count=value;
    });
    this.emitserivce.eventEmittable.subscribe((res)=>{
      this.table=res;
      console.log(res,'tablessss');
    })
  }
  ngAfterViewInit(){
    // this.emitserivce.eventEmittodayrecover.unsubscribe();
    // this.emitserivce.eventEmithaverecovercount.unsubscribe();
    // this.emitserivce.eventEmittempcount.unsubscribe()
    // this.emitserivce.eventEmittable.unsubscribe();
  }
  ngOnDestroy(){
    // this.emitserivce.eventEmittodayrecover.unsubscribe();
    // this.emitserivce.eventEmithaverecovercount.unsubscribe();
    // this.emitserivce.eventEmittempcount.unsubscribe()
    // this.emitserivce.eventEmittable.unsubscribe();
  }
  gobackhome(){
    let redirect = '/home';
    this.router.navigate([redirect]);
  }
  doToRecovery(){
    this.router.navigate(['/recovery/torecovery']);
  }

  getodayrecover(nowday){
    // let nowday=this.brokedataservice.today;
    //"Tmxx":{"end_dt_hs":"2018-09-11 23:59:59","isChecked":false,"start_dt_hs":"2018-09-11 00:00:00"}
    console.log(nowday,'nowday');
    const data = {
      PageReq:{},
      Tmxx:nowday,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };

    this.service.todayrecovercount(data).subscribe((res)=>{     
       if(res.status=='OK'){    
         this.todayrecovery=res.returnValue.jrhss;
         console.log(res,'今日回收接口成功');
       }
    })
  }
  showdialog(){
    this.isVisible=true;
  }
  
  success(): void {
    this.modalService.success({
      nzTitle: '<b>扫描成功!</b>',
      nzContent: '请在PDA上根据显示确认登录',
      nzOkText    : '是',
      nzCancelText: '否',
    });
  }


  showConfirm(): void {
    this.modalService.confirm({
      nzTitle  : '包条码(457896621)已回收',
      nzContent: '<b>是否撤销?</b>',
      nzOkText    : '是',
      nzCancelText: '否',
      nzFooter:`<button nz-button nzType="default" (click)="handleCancel()">Custom Callback</button><button nz-button nzType="primary" (click)="handleOk()" [nzLoading]="isConfirmLoading">Custom Submit</button>`,
      nzOnOk   : () => console.log('OK')
    });
  }



  createComponentModal(tplFooter:TemplateRef<{}>): void {
    if(!this.count){
      return;
    }
    this.isLoading=true;
    console.log('开始调用');
    //通知content显示loading
    this.changepanmodal = this.modalService.create({
      nzTitle: `待回收 ${this.count}`,
      nzContent: TorecoverComponent,
      nzOkType: 'primary',
      nzFooter: tplFooter,
 
    });
    this.changepanmodal.afterOpen.subscribe((res)=>{
      console.log(this,this.isLoading,'model打开了')
      this.isLoading=false;
    })
    this.changepanmodal.nzWidth=600;
  }
  onClick(){
    console.log('测试回收');
    let tempcheck=_.filter(this.table,(item)=>{
            return item.checked;
          });
          let parmas=_.map(tempcheck,(value)=>{
            return {'tmid':value['tmid']};
          })
          this.recoverheader(parmas);
          this.changepanmodal.destroy();
  }

  //回收
  recoverheader(parmas){
    if(this.hsr['hsrname']==''){
      this.toolservice.createMessage('warning','请填写回收人');
      return
    }else{
    const data = {
      HsLog:{opt_uname:this.hsr['hsrname'],
        opt_uid:this.hsr['hsrid']},
      HsLogList:parmas,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.recoverheader(data).subscribe((res)=>{
      if(res.status="OK"){
        this.toolservice.createMessage('success','回收成功');
        // this.
        this.getoberecovery();
        this.emitserivce.recoverysuccess.emit();
        console.log(res,'待回收，回收');
      }else{
        this.toolservice.createMessage('warning',res.message);
      }
  
    });
  }
  }

  // 待回收
  getoberecovery(){
    const data = {
      PageReq:{},
      Tmxx:{isChecked:false,ff_did:'',type:'pc'},
      
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };

    this.service.Toberecover(data).subscribe((res)=>{
       if(res.status=='OK'){
        // this.toberecoverlist=res;
        this.brokedataservice.toberecoverdata=res.returnValue.rows;
        this.count=res.returnValue.total;
         console.log(res,'待回收接口成功');
       }
    })
  }
  //
  loginout(){
    sessionStorage.setItem('islogin','false'); 
    storage.set('userMessage', null);
    this.router.navigate(['/login']);
  }


  
}