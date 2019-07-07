import { Component, OnInit ,TemplateRef} from '@angular/core';
import storage from './../../../../service/storage';
import { WashService } from './../../../../service/http/wash.service'
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {DatePipe} from "@angular/common";
import {ToolsService} from './../../../../service/tools/tools.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { EmitService } from 'src/app/service/middleman.service';
import { BrokedataService } from 'src/app/service/state/wastage.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-wash-result',
  templateUrl: './wash-result.component.html',
  styleUrls: ['./wash-result.component.scss']
})
export class WashResultComponent implements OnInit {
  public washresult=[];
  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;
  public chosenmachine;
  public resultdata=[];
  public dateFormat="yyyy-MM-DD";
  private today=new Date();
  public choosetime=new Date();
  private listheader=['清洗盘名称','包名称','包数量'];
  private pan="default";
  private checkstate;
  //换锅变量
  private reasons=[];
  private changereson;
  private targetpan;
  private freewashers=[];
  private changepanmodal;
  private washerslist=[];

  constructor(
    private service:WashService,
    private datepipe:DatePipe,
    private toolservice:ToolsService,
    private modalService:NzModalService,
    private router:Router,
    private emitservice:EmitService,
    private stateservice:BrokedataService
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
   }
   //日期控制
   disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  //时间转化
  timepipe(time){
    let nowday=this.datepipe.transform(time,'yyyy-MM-dd');
    let postday;
    postday={"start_dt":`${nowday} 00:00:00`};
    return postday;
  }
   //暂不需要
   getlist(){
    this.getresults(this.timepipe(this.choosetime));
  }

  ngOnInit() {
    this.getseasons();
    this.getresults(this.timepipe(this.choosetime));

  }
  refresh(){
    this.getresults(this.timepipe(this.choosetime));
  }
  //获取清洗结果的列表
  getresults(time,choseitem?){
    this.washresult=[];
    const data = {
      Qx:time,
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getresult(data).subscribe(res => {
      if(res.status=="OK"){
        res.returnValue.qxResultList.forEach(item => {
          item.innerhtml=this.getinnerhtml(item);
          item.active=false;
        });
  
        this.washresult=this.washresult.concat(res.returnValue.qxResultList);
        if(choseitem){
          let finditem=_.find(this.washresult,{'dev_id':choseitem.dev_id})
          this.choosemachine(finditem);
        }
        
        console.log(res,'清洗结果数据');
      }
    });
  }
  choosemachine(item){
    this.checkstate=item.result;
    console.log(item);
     if(this.chosenmachine){
        this.chosenmachine.active=false;
     }
     item.active=true;
     this.chosenmachine=item;
    this.getwasherdetail(item);
  }
  //点击清洗机获取清洗机明细
  getwasherdetail(item){
    const data = {
      Qx:{
        d_gc:item.d_gc,
        dev_id:item.dev_id,
        dev_name:item.dev_name,
        t_gc:item.t_gc,
        type:item.type},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getwasherdetail(data).subscribe(res => {
       
        this.resultdata=res.returnValue.qxDtlList;
      
        console.log(res,'清洗结果');
    })
  }
  //
  getinnerhtml(item){
    let innerhtml;
    if(item.result=="0"){
        innerhtml=`<i class="anticon anticon-close colorred"></i>`
    }
    else if(item.result=="1"){
      innerhtml=`<i class="anticon anticon-check colorgreen"></i>`
    }
    else{
      innerhtml=`<span class="colorblue">待检定</span>`
    }
    return innerhtml;
  }
  //合格
  qualified(tplTitle,tplFooter,tplContent){
    console.log(this.chosenmachine)
    const data = {
      Qx:{result_name:this.chosenmachine.result_name,
      cre_uid:this.userId,
      cre_uname:this.userName,
      d_gc:this.chosenmachine.d_gc,
      dev_id:this.chosenmachine.dev_id,
      dev_name:this.chosenmachine.dev_name,
      end_dt:this.chosenmachine.end_dt,
      result:tplTitle?'0':'1',
      start_dt:this.chosenmachine.start_dt,
      t_gc:this.chosenmachine.t_gc},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    let istrue=tplTitle?'不合格':'合格';
  

    if(tplTitle&&this.chosenmachine.result_name!='待检定'){//不合格换锅
        this.createchangepanModal(tplTitle,tplFooter,tplContent);
        let tempwashers=this.washerslist;
        console.log(this.chosenmachine,tempwashers);
        this.freewashers=tempwashers.filter((item)=>{
             return (this.chosenmachine.dev_id!=item.dev_id)&&(item.state=="2"||item.state=="0"||item.state=="1");
         })
      }
      else{
      
          if(tplTitle){//检定为不合格
            this.toolservice.createWarningDialog(`是否检定为${istrue}`,'',()=>{
                this.service.qualified(data).subscribe(res => {
                    if(res.status=='OK'){
                      this.toolservice.createMessage('success', "检定成功"); 
                        //重新获取左边列表，并更新右边状态
                      this.getresults(this.timepipe(this.choosetime),this.chosenmachine);
                    }
                })
            },null)
          }
          else{//检定为合格
            this.service.qualified(data).subscribe(res => {
                if(res.status=='OK'){
                  this.toolservice.createMessage('success', "检定成功"); 
                  //重新获取左边列表，并更新右边状态
                  console.log(res,this.chosenmachine,'合格');
                  
                  this.getresults(this.timepipe(this.choosetime),this.chosenmachine);
                 
                }
            })
          }
        
      }
  

   
  }
  getseasons(){
    let arr=storage.get('changepanreasons');
    console.log(typeof(arr));
    // this.reasons=[...arr];
    this.reasons=this.reasons.concat(arr);
  }
   //换锅


changepan(tplTitle,tplFooter,tplContent){
  this.getwashers(tplTitle,tplFooter,tplContent);

}
//获取清洗机列表
getwashers(tplTitle,tplFooter,tplContent){
      this.washerslist=[];
    const data = {
      Qx:{},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getwashersdata(data).subscribe(res => {
      if(res.status=="OK"){  
        this.washerslist=this.washerslist.concat(res.returnValue.qxjStateList);
        console.log(res,this.washerslist,'清洗机数据');

        this.targetpan=null;
        this.changereson=null;
      
        let tempwashers=this.washerslist;
        console.log(this.chosenmachine,tempwashers);
        this.freewashers=tempwashers.filter((item)=>{ 
             return (this.chosenmachine.dev_id!=item.dev_id)&&(item.state=="0"||item.state=="1");
         })
         if(this.freewashers.length==0){
          this.toolservice.createMessage('warning','没有空闲的清洗机');
          return
        }
         this.createchangepanModal(tplTitle,tplFooter,tplContent);
      }
    });
  }
 //创建换锅弹窗
 createchangepanModal(tplTitle:TemplateRef<{}>,tplFooter: TemplateRef<{}>,tplContent: TemplateRef<{}>): void {
   this.changepanmodal = this.modalService.create({
     nzTitle: tplTitle,
     nzOkType: 'primary',
     nzContent: tplContent,
     nzFooter: tplFooter
   });
   this.changepanmodal.nzWidth=480;
 }
 //确定换锅
 surechangepan(){
 
//    console.log(this.targetpan,this.changereson.aaa103,this.chosenmachine); 
   if(!this.changereson){
      this.toolservice.createMessage('warning','请选择换锅原因');
      return;
   }
   if(!this.targetpan){
    this.toolservice.createMessage('warning','请选择换后清洗机');
    return;
 }
   this.changepanmodal.destroy();
   const data = {
     Qx:{aft_d_gc:this.targetpan.d_gc,
     aft_dev_id:this.targetpan.dev_id,
     aft_dev_name:this.targetpan.dev_name,
     aft_t_gc:this.targetpan.t_gc,
     isstart:"1",
     d_gc:this.chosenmachine.d_gc,
     dev_id:this.chosenmachine.dev_id,
     dev_name:this.chosenmachine.dev_name,
     start_dt:this.chosenmachine.start_dt,
     hgyy:this.changereson.aaa103},
     LoginForm: {  
       deptId: this.deptId,
       deptName: this.deptName,
       userId: this.userId,
       userName: this.userName
     }
   };
   
   this.service.surechangepan(data).subscribe(res => {

     if(res.status=="OK"){
       this.toolservice.createMessage('success', "换锅成功"); 
       //跳到换后清洗机
       this.router.navigate(['/wash/wash-content']);
    //    this.emitservice.eventEmitChangePan.emit(this.targetpan);
    this.stateservice.targetWash=Object.assign({}, this.targetpan);
       console.log(res,'换锅确定接口');
     }
     else{
       this.toolservice.createMessage('warning', res.message+'失败');  
     }
      
   })

 }
  //选定目标清洗锅
  chosetargetwasher(item){
    this.targetpan=item;
 }
 //选定换锅原因
  chosepan(item){
    this.changereson=item;
     console.log(item);
  }

  // colorstate(state){
  //   let color;
  //   if(state.result_name=="待检定"){
  //       state.result='3';
  //   }
  //   switch(state.result){
  //     case '1':color='blank';break;
  //     case '0':color='red';break;
  //     case '3':color='tobetest';break;
  //     case '2':color='washing';break;
  //   }
  //   return color;
  // }
  getstate(){

  }

}
