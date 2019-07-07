import { Component, OnInit ,TemplateRef,ViewChild, AfterViewInit,ElementRef} from '@angular/core';
import storage from './../../../../service/storage';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {DatePipe} from "@angular/common";
import {ToolsService} from './../../../../service/tools/tools.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/service/http/http.service';
import { WashService } from 'src/app/service/http/wash.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-steril-result',
  templateUrl: './steril-result.component.html',
  styleUrls: ['./steril-result.component.scss']
})
export class SterilResultComponent implements OnInit {

    @ViewChild('tplTitle')
    tplTitleone: ElementRef;
    // @ViewChild('span')
    // span: ElementRef;
    @ViewChild('tplFooter')
    tplFooterone: ElementRef;
    @ViewChild('tplContent')
    tplContentone: ElementRef;
    arrs=[1,2];

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
  private Loginform;
  public unStandards=[];//不合格原因
  //物理，化学，生物状态
  private physicalstate={state:null};
  private chemstate={state:null};
  private biologystate={state:null};
  private nomalstate={state:null};
  private tempstate={};
  private wlcolor;
  private hxcolor;
  private swcolor;
  private nmcolor;
  //当前灭菌机合格状态
  private tempmachinestate;

  private tempreture;
  private hightpreture;
  private usetime;

  public surebtn='确定';
  public readonlyForm=false;
  private forbiden=false;
  public washerslistchange;
  suredisable=true;
  suredisableone=true;
  forbid=false;


  constructor(
    private service:HttpService,
    private getwasherservice:WashService,
    private datepipe:DatePipe,
    private toolservice:ToolsService,
    private modalService:NzModalService
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.Loginform= {deptId: this.deptId,deptName: this.deptName,userId: this.userId,userName: this.userName}

   }

   //获取清洗机列表
getwashers(){
  // this.span.nativeElement.clienHeight;
    //  this.washerslist=[];
    const data = {
      Qx:{},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.getwasherservice.getwashersdata(data).subscribe(res => {
      if(res.status=="OK"){
   
        this.washerslist=this.washerslist.concat(res.returnValue.qxjStateList);
     

        console.log(res,this.washerslist,'清洗机数据');
      }
    });
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

    this.getresults(this.timepipe(this.choosetime));
    this.getResons();
    this.getwasherschange();
    this.getseasons();
  }
//   ngAfterViewInit(){
//       this.surebtn.nativeElement.innerhtml=this.chosenmachine.result=='0'?'换锅':'确定';
//   }
  //获取清洗结果的列表
  getresults(time,activemachine?){

    console.log(activemachine,'css');


    this.washresult=[];
    const data = {
      method:'getMjResultList',
      service:'MjService',
      Mj:time,
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    Object.assign(data.Mj,{},{"tmxxList":[]})
    this.service.getdata(data).subscribe(res => {
      if(res.status=="OK"){ 
        this.washresult=this.washresult.concat(res.returnValue.mjResultList);
        if(activemachine){
            this.chosenmachine=activemachine;
        }
        else{
            this.chosenmachine=this.washresult[0];
        }
        if(this.chosenmachine){
          this.choosemachine(this.chosenmachine);
        }
        
        console.log(res,'灭菌结果数据');
      }
    });
  }
  resetallstate(){
    this.physicalstate.state=null;
    this.chemstate.state=null;
    this.biologystate.state=null;
    this.nomalstate.state=null;
    this.tempreture='';
    this.hightpreture='';
    this.usetime='';
    this.wlcolor=null;
    this.hxcolor=null;
    this.swcolor=null;
    this.nmcolor=null;
    this.forbiden=false;
    this.suredisable=true
    // this.suredisableone=true;
   
  }

  choosemachine(item){
    this.resetallstate();
    item=_.find(this.washresult,{'dev_id':item.dev_id,'d_gc':item.d_gc});
    this.checkstate=item.result;//result==
    console.log(item,'当前选定清洗机');
     if(this.chosenmachine){
        this.chosenmachine.active=false;
     }
     item.active=true;
     this.chosenmachine=item;
     //this.chosenmachine.active=true;
     this.surebtn=item.result=='0'?'换锅':'确定';
     //赋值默认值到选项框，并禁用所有插件
     if(item.result_name!='待检定'){
         console.log('1234');
         this.tempreture=item.temp;
         this.hightpreture=item.pres;
         this.usetime=item.time;
        //  禁用按钮项
        this.readonlyForm=true;
        //绑定默认状态到物理，化学，生物按钮,并禁用这些按钮
        this.forbiden=true;
        this.forbidenbtn(item);
        if(item.result=='0'){
          this.suredisable=false
        }
     }
     else{
        this.readonlyForm=false;
     }
    //  disabled
  }

  // choosemachine(item){
  //   this.resetallstate();
  //   item=_.find(this.washresult,{'dev_id':item.dev_id,'d_gc':item.d_gc});
  //   this.checkstate=item.result;//result==
  //   console.log(item,'当前选定清洗机');
  //    if(this.chosenmachine){
  //       this.chosenmachine.active=false;
  //    }
  //    item.active=true;
  //    this.chosenmachine=item;
  //    this.surebtn=item.result=='0'?'换锅':'确定';
  //    this.suredisable=item.result=='0'?false:true;
  //    //赋值默认值到选项框，并禁用所有插件
  //   //  if(item.result_name!='待检定'){
  //   //      console.log('1234');
  //   //      this.tempreture=item.temp;
  //   //      this.hightpreture=item.pres;
  //   //      this.usetime=item.time;
  //   //     //  禁用按钮项
  //   //     this.readonlyForm=true;
  //   //     //绑定默认状态到物理，化学，生物按钮,并禁用这些按钮
  //   //     this.forbiden=true;
  //   //     this.forbidenbtn(item);
  //   //  }
  //   //  else{
  //   //     this.readonlyForm=false;
  //   //  }
  //   if(item.result_name!='待检定'){
  //     console.log('1234');
  //     this.tempreture=item.temp;
  //     this.hightpreture=item.pres;
  //     this.usetime=item.time;
  //    //  禁用按钮项
  //    this.readonlyForm=true;
  //    //绑定默认状态到物理，化学，生物按钮,并禁用这些按钮
  //    this.forbiden=true;
  //    this.forbidenbtn(item);
  //    if(item.result=='0'){
  //      this.suredisable=false
  //    }
  // }
  // else{
  //    this.readonlyForm=false;
  // }
  //   //  disabled
  // }
  forbidenbtn(item){
        
       if(item.sw_result){
        this.swcolor=item.sw_result=='1'?'primary':true;
       }
       if(item.hx_result){
        this.hxcolor=item.hx_result=='1'?'primary':true;
       }
       if(item.wl_result){
        this.wlcolor=item.wl_result=='1'?'primary':true;
       }
       this.nmcolor=item.result=='1'?'primary':true;
  }
  getallchose(){
    console.log(this.physicalstate.state==null,this.chemstate.state==null,this.biologystate.state==null,this.nomalstate.state==null,'all state'); 
    return this.physicalstate.state==null&&this.chemstate.state==null&&this.biologystate.state==null&&this.nomalstate.state==null;
  }

  //点击合格按钮
  standard(value){
      if(this.chosenmachine.result_name=="待检定"&&value=='2'){
        return;
      }
      if(this.forbiden&&value!='2'&&this.chosenmachine.result_name!="待检定"||this.chosenmachine.sw_result){
          return;
      }
      this.tempstate={};
   

    switch(value){
        case '0':this.wlcolor='primary';this.physicalstate['state']='1';break;
        case '1':this.hxcolor='primary';this.chemstate['state']='1';break;
        case '2':this.swcolor='primary';this.biologystate['state']='1';break;
        case '4':this.nmcolor='primary';this.nomalstate['state']='1';break;
    }
    if(this.getallchose()){
      this.suredisable=true;
      this.suredisableone=true;
    }else{
      this.suredisable=false;
      this.suredisableone=false;
    }
  }
  //获取不合格原因
  getResons(){
    const data = {
        method:'getAa10ListForMobile',
        service:'ParamService',
        "AA10":{"aaa100":"MJ_BHGYY"},
        LoginForm:this.Loginform
      };
      this.service.getdata(data).subscribe(res => {
        if(res.status=="OK"){
          // res.returnValue.mjResultList.forEach(item => {
          //   item.innerhtml=this.getinnerhtml(item);
          //   item.active=false;
          // });
    
        //   this.washresult=this.washresult.concat(res.returnValue.mjResultList);
        //   this.chosenmachine=this.washresult[0];
          console.log(res,'灭菌原因');
          this.unStandards=[].concat(res.returnValue.AA10List);
        }
        else{
            this.toolservice.createMessage('warning',res.message+'灭菌原因失败');
        }
      });
  }
  //点击不合格
  togleResons(value,tplTitle,tplFooter,tplContent){
      if(this.chosenmachine.result_name=="待检定"&&value=='2'){
        return;
      }
      if(this.forbiden&&value!='2'&&this.chosenmachine.result_name!="待检定"||this.chosenmachine.sw_result){
          console.log('禁用按钮');
          return;
      }
      //默认选定第一个不合格原因
    //   let tempunstandard={state:this.unStandards[0]};
      switch(value){
          case '0':this.wlcolor=true;this.physicalstate['state']='0';break;
          case '1':this.hxcolor=true;this.chemstate['state']='0';break;
          case '2':this.swcolor=true;this.biologystate['state']='0';break;
          case '4':this.nmcolor=true;this.nomalstate['state']='0';this.tempstate['state']=this.togleResons[0];break;//BD检测按钮
      }
    
      if(this.getallchose()){
        this.suredisable=true;
        this.suredisableone=true;
      }else{
        this.suredisable=false;
        this.suredisableone=false;
      }
      console.log(this.physicalstate,this.chemstate,this.biologystate);
      //有且只有一个零

      if((this.physicalstate['state']=='0'&&this.chemstate['state']!='0'&&this.biologystate['state']!='0')||
      (this.physicalstate['state']!='0'&&this.chemstate['state']=='0'&&this.biologystate['state']!='0')||
      (this.physicalstate['state']!='0'&&this.chemstate['state']!='0'&&this.biologystate['state']=='0')||
    value=='4'){
        this.createchangepanModal(tplTitle,tplFooter,tplContent,value);
      }

    
  }
  choseResons(tplTitle,tplFooter,tplContent){
      if(this.forbiden){
          return;
      }
    this.nomalstate['state']='0';
    this.createchangepanModal(tplTitle,tplFooter,tplContent);
  }
  choseReson(item){
      this.tempstate['state']=item;
  }

 
  sure(){
    // if(this.forbid){//阻止重复点击
    //    return;
    // }
    //   this.forbid=true;
      if(this.surebtn=='换锅'){
        console.log('换锅',this.tplTitleone);
        this.targetpan=null;
        this.changereson=null;
        this.changepan(this.tplTitleone,this.tplFooterone,this.tplContentone)}
      else{
        this.chosenmachine.type=='1'?this.qualified():this.nolmal();
      }
     
  }


   //普通检测
  nolmal(){

    this.suredisableone=true;
    const data = {
    "service":"MjService",
    "method":"addMjResult",
     Mj:{result_name:this.chosenmachine.result_name,
      tmxxList:[],
      bhgyy_id:"",
      bhgyy_name:"",
      cre_uid:this.userId,
      cre_uname:this.userName,
      d_gc:this.chosenmachine.d_gc,
      dev_id:this.chosenmachine.dev_id,
      dev_name:this.chosenmachine.dev_name,
      end_dt:this.chosenmachine.end_dt,
      start_dt:this.chosenmachine.start_dt,
      t_gc:this.chosenmachine.t_gc,
      hx_result:this.chemstate['state'],
      sw_result:this.biologystate['state'],
      pres:this.hightpreture,
      result:this.chosenmachine.result,
      temp:this.tempreture,
      time:this.usetime,
      type:this.chosenmachine.type,
      wl_result:this.physicalstate['state'] 
    },
      LoginForm: this.Loginform
    };
    this.service.getdata(data).subscribe(res => {
      if(res.status=='OK'){

        this.toolservice.createMessage('success', "检定成功");
        this.forbid=false;
        this.suredisableone=false;
        this.getresults(this.timepipe(this.choosetime),this.chosenmachine);
        // location.reload(); 
        console.log(res,'合格');
      }
    })
   
   
  }
  //BD检测
  qualified(){
    this.suredisable=true;
      let value=this.nomalstate.state;
    const data = {
        method:"addMjResult",   
        service:"MjService",
        Mj:{
            result_name:this.chosenmachine.result_name,
            tmxxList:[],
            cre_uid:this.userId,
            cre_uname:this.userName,
            d_gc:this.chosenmachine.d_gc,
            dev_id:this.chosenmachine.dev_id,
            dev_name:this.chosenmachine.dev_name,
            end_dt:this.chosenmachine.end_dt,
            result:value,
            start_dt:this.chosenmachine.start_dt,
            t_gc:this.chosenmachine.t_gc,
            pres:this.hightpreture,
            temp:this.tempreture,
            time:this.usetime,
            type:this.chosenmachine.type},
        LoginForm:this.Loginform
      };
      if(value=='0'){//不合格
        console.log(this.tempstate,'普通灭菌不合格原因');
        Object.assign(data.Mj,{},{
            bhgyy_id:this.tempstate['state']?this.tempstate['state'].aaa102:'',bhgyy_name:this.tempstate['state']?this.tempstate['state'].aaa103:''
        }) 
      }
      this.service.getdata(data).subscribe(res => {
        if(res.status=="OK"){
          console.log(res,'灭菌检定结果');
          this.forbid=false;
          this.suredisable=false;
          this.toolservice.createMessage('success','灭菌检定成功');
        }
        else{
            this.toolservice.createMessage('warning',res.message+'灭菌检定结果失败');
        }
        this.getresults(this.timepipe(this.choosetime),this.chosenmachine);
      });
   
  }
//   unqualified(){
//     this.qualified();
   
//   }

   //换锅
changepan(tplTitle,tplFooter,tplContent){
   this.targetpan=null;
   this.changereson=null;
   this.createchangepanModal(tplTitle,tplFooter,tplContent);
   let tempwashers=this.washerslistchange;
  
   this.freewashers=tempwashers.filter((item)=>{
        return (this.chosenmachine.dev_id!=item.dev_id)&&(item.state=="2"||item.state=="0"||item.state=="1");
    })
    this.freewashers=[].concat(this.freewashers);
    console.log(this.chosenmachine,this.freewashers);
   
}
 //创建换锅弹窗
 createchangepanModal(tplTitle:TemplateRef<{}>,tplFooter: TemplateRef<{}>,tplContent: TemplateRef<{}>,value?): void {
   this.changepanmodal = this.modalService.create({
     nzTitle: tplTitle,
     nzOkType: 'primary',
     nzContent: tplContent,
     nzFooter: tplFooter
   });
   console.log(this.changepanmodal,this.changepanmodal.elementRef.nativeElement,'this.changepanmodal');
   this.changepanmodal.nzWidth=490;
 }
  //获取换锅原因函数'ParamService', 'getAa10ListForMobile'
  getseasons(){
    const data = {
      AA10:{aaa100:"MJ_HGYY"},
      service:'ParamService',
      method:'getAa10ListForMobile',
      LoginForm: this.Loginform
    };
    this.service.getdata(data).subscribe(res => {
      this.reasons=[...res.returnValue.AA10List];
      this.reasons.forEach((item)=>{
        item.btntype="default";
      });
    })
    
  }
      //获取清洗机列表
      getwasherschange(){
        const data = {
          service:'MjService',
          method:'getAllMjjState',
          Mj:{tmxxList:[]},
          LoginForm:this.Loginform
        };
        this.service.getdata(data).subscribe(res => {
          if(res.status=="OK"){
            res.returnValue.mjjStateList.forEach(item => {
              item.active=false;
            });
            this.washerslistchange=[...res.returnValue.mjjStateList];
    
            console.log(res,this.washerslistchange,'换锅清洗机数据');
          }
          else{
            this.toolservice.createMessage('warning','灭菌机列表获取失败');
          }
        });
      }
      closeModel(){
        this.changepanmodal.destroy();
      }
 surechangepan(){
    //  if(!this.changereson){
    //     this.toolservice.createMessage('warning','请选择换锅原因');
    //     return;
    //  }
     if(!this.targetpan){
         this.toolservice.createMessage('warning','请选择换后灭菌机');
         return;
     }
     
   this.changepanmodal.destroy();
   const data = {
    service:'MjService',
    method:'chgMj',
    Mj:{aft_d_gc:this.targetpan.d_gc,
    tmxxList:[],
    aft_dev_id:this.targetpan.dev_id,
    aft_dev_name:this.targetpan.dev_name,
    aft_t_gc:this.targetpan.t_gc,
    isstart:"1",
    d_gc:this.chosenmachine.d_gc,
    dev_id:this.chosenmachine.dev_id,
    dev_name:this.chosenmachine.dev_name,
    start_dt:this.chosenmachine.start_dt,
    hgyy:this.changereson?this.changereson.aaa103:''},
    LoginForm:this.Loginform
  };
  this.service.getdata(data).subscribe(res => {
    if(res.status=="OK"){
      this.toolservice.createMessage('success', "换锅成功");
      // if(this.tempactiveitem.state=='2'){//清洗中的锅作废
      //   this.cancellation();
      //   this.washerstate='0';
      // } 
      this.getwashers();//刷新列表
    }
    else{
      this.toolservice.createMessage('warning', res.message);  
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
  getstate(){

  }
  //绑定状态颜色
  colorstate(state){
    let color;
    switch(state){
      case '合格':color='blank';break;
    //   case '待检定':color='blank';break;
      case '待检定':color='tobetest';break;
      case '不合格':color='washing';break;
    }
    return color;
  } 

  




















}
