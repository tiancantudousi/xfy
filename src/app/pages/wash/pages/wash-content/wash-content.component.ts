import { Component, OnInit ,TemplateRef,ViewChild,ElementRef} from '@angular/core';
import { WashService } from './../../../../service/http/wash.service'
import storage from './../../../../service/storage';
import {ToolsService} from './../../../../service/tools/tools.service'
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import {DatePipe} from "@angular/common";
import { PublicuseService} from './../../../../service/http/publicuse.service';
import { EmitService} from './../../../../service/middleman.service';
import { Observable } from 'rxjs/internal/Observable';
import { element } from '@angular/core/src/render3/instructions';
import { BrokedataService } from 'src/app/service/state/wastage.service';
import { RecoveryService } from '../../../../service/http/recovery.service';


@Component({
  selector: 'app-wash-content',
  templateUrl: './wash-content.component.html',
  styleUrls: ['./wash-content.component.scss']
})
export class WashContentComponent implements OnInit {
  @ViewChild('packageinput')
  Packageinput:ElementRef;
  @ViewChild('afterperson')
  afterPersoninput:ElementRef;
  public date;//日期时间
  public pik="./../../../../../assets/images/";
  public washerslist=[];
  public contol=false;
  public userName: string;
  public userId: string;
  public deptId: string;
  public deptName: string;
  public listheader=['清洗盘名称','包名称','材料数量','包数量','操作'];
  public packagename:string;//包明称或盘条码
  public BpzglList;
  public slidelist=[];
  public loading=true;
  public totalpackage:number=0;
  public tempactivetype;
  private changepanmodal;

  private washerstate;

  private reasons=[];
  private changereson;

  private changebtn='default';//换锅按钮颜色

  private showbutton:boolean=false;

  // private nowpan=null;//当前选定锅

  public washtype=[];

  public tempactiveitem;//当前选定锅
  public chosenpackage=null;//当前选定包

  public pan:string="primary";
  public buttonwash:string="default";
  public washerdata=[];
  public showtopul:boolean=false;
  private freewashers=[];//可以换锅的目标清洗机
  private targetpan;//换锅被选定的目标清洗锅
  public lefttime;//倒计时清洗时间
  public afterPerson:string;//清洗人
  public afterPersonuid:string;//清洗人
  private timer;
  private timer1;
  public plantime='';
  public getIf=true;
  public syetemtime;

  constructor(
    public Reservice: RecoveryService,
    private service:WashService,
    private toolservice:ToolsService,
    public modalService:NzModalService,
    private datepipe:DatePipe,
    private publicservice:PublicuseService,
    private emitservice:EmitService,
    private stateservice:BrokedataService
 
  ) { 
    const message = storage.get('userMessage');
   
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
  }

  ngOnInit() {
    this.syetemtime=setInterval(()=>{
      if(this.tempactiveitem){
      this.getwashers(this.tempactiveitem);
      }else{
        this.getwashers();
      }
    },60000)
    this.getporgram();
    this.getseasons();
    if(this.stateservice.targetWash){
        this.getwashers(this.stateservice.targetWash);
    }
    else{
        this.getwashers();
    }
    this.publicservice.getulPackagesbetter().subscribe(res=>{
      console.log(res,'包列表数据');
      this.BpzglList=res;
    });
    // this.emitservice.eventEmitChangePan.subscribe((item)=>{
    //     console.log('激活item',this.getwashers,item);
    //     this.getwashers(item);
    //     this.getIf=false;
    // })
    // setTimeout(()=>{
    //     console.log('正常获取清洗机列表',this.getIf);
    //     if(this.getIf){
    //         this.getwashers();
    //     }
       
    // },0)
  }
  focus(element,skip,input){

    let zg=new RegExp('ZG','i');
    let bf=new RegExp('BF','i');
    let qp=new RegExp('QP','i');
    let bb=new RegExp('BB','i');

    if(zg.test(element)){
      console.log(element);
      let index=element.indexOf('ZG');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
      this.afterPersoninput.nativeElement.focus();
      this.afterPerson=element.substring(index+2,element.length);
      let e={keyCode:13};
      if(skip!='ZG'){
        this.personKeyUp(e);
        return false;
      }
    }
    
    // if(bf.test(element)||qp.test(element)||bb.test(element)){
    //   console.log(element);
    //   let index=element.indexOf('ZG');
    //   let oldinput=element.slice(0,index);
    //   this[input]=oldinput.length>0?oldinput:'';
    //   this.Packageinput.nativeElement.focus(); 
    //   this.packagename=element;
    //   this.afterPerson=element.substring(index+2,element.length);
    //   let e={keyCode:13};
     
    //    if(skip!='TM'){
    //     this.packageidkeyup(e);
    //      return false;
    //   }
     
    //   // if(skip!='TM'){
    //   //   this.packageidkeyup(e);
    //   //   return false;
    //   // }
    // }
    // if(bf.test(element)||qp.test(element)||bb.test(element)){
    //   console.log(element);
    //   let index=element.indexOf('ZG');
    //   let oldinput=element.slice(0,index);
    //   this[input]=oldinput.length>0?oldinput:'';
    //   this.Packageinput.nativeElement.focus(); 
    //   this.packagename=element.substring(index+2,element.length);
    //   let e={keyCode:13};
     
    //    if(skip!='TM'){
    //     this.packageidkeyup(e);
    //      return false;
    //   }
     
    //   // if(skip!='TM'){
    //   //   this.packageidkeyup(e);
    //   //   return false;
    //   // }
    // }
    if(bf.test(element)){
      console.log(element);
      let index=element.indexOf('BF');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
      this.Packageinput.nativeElement.focus(); 
      this.packagename=element.substring(index,element.length);
      let e={keyCode:13};
     
       if(skip!='TM'){
        this.packageidkeyup(e);
         return false;
      }
    }
    if(qp.test(element)){
      console.log(element);
      let index=element.indexOf('QP');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
      this.Packageinput.nativeElement.focus(); 
      this.packagename=element.substring(index,element.length);
      let e={keyCode:13};
     
       if(skip!='TM'){
        this.packageidkeyup(e);
         return false;
      }
    }
    if(bb.test(element)){
      console.log(element);
      let index=element.indexOf('BB');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
      this.Packageinput.nativeElement.focus(); 
      this.packagename=element.substring(index,element.length);
      let e={keyCode:13};
     
       if(skip!='TM'){
        this.packageidkeyup(e);
         return false;
      }
    }
    
    return true;
  }
  
// // 人员 回车 查询
personKeyUp(e) {

  if (e.keyCode === 13 && this.afterPerson) {

    let goon=this.focus(this.afterPerson,'ZG','afterPerson');
    if(!goon){
       return;
    } 

    const data = {
      Userinfo: {
        us_userid: this.afterPerson
      },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.Reservice.getPersonMessageByPersonId(data).subscribe(res => {
      if (res['status'] === 'OK') {
        if (res['returnValue'] && res['returnValue']['Userinfo']) {
          const {us_username: name} = res['returnValue']['Userinfo'];
          const {us_userid: uid} = res['returnValue']['Userinfo'];
          this.afterPerson = name;
          this.afterPersonuid = uid;
        } else {
          this.afterPerson = '';
          this.afterPersonuid = '';
        }
      } else {
        this.toolservice.createMessage('warning', res['message']);
      }
    });
  }
}
  //选择包
  choosepackage(item,e){
    e.stopPropagation();
    this.showtopul=false;
    this.packagename=item.bmc;
    this.chosenpackage=item;
    this.addpackage(item,null)
    console.log(item);
  }
  //扫描包条码或盘
  packageidkeyup(e) {
   this.showtopul=this.packagename==''?false:true;//显示或影藏下拉列表
   console.log(this.BpzglList,'包数据列表');
   if(!this.BpzglList){
     this.toolservice.createMessage('warning','包数据未加载成功');
     return;
   }
   let list=this.BpzglList.filter((item)=>{
       let reg = new RegExp(`^${this.packagename}`,"i");      
       return reg.test(item.bmc)||reg.test(item.py_code);
    });
    this.slidelist=list;
    if (e.keyCode === 13 && this.packagename.trim()) {
      let goon=this.focus(this.packagename,'TM','packagename');
      if(!goon){
         return;
      }
      this.showtopul=false;
  
        let thisreg=new RegExp('^(BB|bb)');
        let tempbid=this.checkbid(this.BpzglList,'bmc',this.packagename);
        this.chosenpackage=thisreg.test(this.packagename)?{bid:this.packagename.slice(2,this.packagename.length)}:{bid:tempbid?tempbid:this.packagename.slice()};
        if(thisreg.test(this.packagename)){
          this.packagename=this.packagename.slice(2,this.packagename.length);
        }
        this.tempactiveitem.bid=this.chosenpackage.bid;
        console.log(this.chosenpackage,this.packagename,'1111');
        this.addpackage(this.chosenpackage,null,null);
      
    }
  }
  
  //检索包名称对应的bid,有这个bid则传bid,没有直接传原字符串
  checkbid(arr,name,value){
      let temp;
     arr.forEach((item)=>{     
         if(item[name]==value){
           temp=item.bid;
         }
      });
      if(temp){
        return temp;
      }
      else{
        return false;
      }
      
  }
  //查询包列表中是否包含该包，有就把原来数量加一，发送过去，没有就跳过
  checkList(packageId){
      console.log(this.washerdata,'this.washerdata zhang');
    let item=this.toolservice.checkbid(this.washerdata,'bid',packageId);
    return item;
   }

    //添加包到清洗机
  addpackage(thepackage,observe,key?){
    console.log(thepackage);
   
    // console.log(objnum,'objnum');
    if(!thepackage){
      this.toolservice.createMessage('warning', '包不存在');
      return;
    }
    //先判断包名称是否带清洗盘，不带，则原数量加一，带则跳过
     let objnum=this.checkList(thepackage.bid);
    if(objnum&&!objnum.basket_id){
        thepackage.b_num=key?objnum.b_num:objnum.b_num-0+1;
    }
    const data = {
      Hsqxdy:{b_num:thepackage.b_num?thepackage.b_num:1,isChecked:false,
        bid:thepackage.bid,
        qx_d_gc:this.tempactiveitem.d_gc,
        qx_dev_id:this.tempactiveitem.dev_id,
        qx_dev_name:this.tempactiveitem.dev_name,
        qx_t_gc:this.tempactiveitem.t_gc},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    // 判断是扫描盘，加字段
    if(thepackage.basket_id){
        Object.assign(data.Hsqxdy,{},{basket_id:thepackage.basket_id,basket_name:thepackage.basket_name});
    }
    console.log(data,'pandata');
    this.service.cancleaddpackage(data).subscribe(res =>{
      this.timer1=null;
      if (res['status'] === 'OK') {
        if(this.washerdata.length==0){this.getwashers(this.tempactiveitem)}; //刷新清洗机列表  
        this.getwasherdetail(this.tempactiveitem);
        if(observe){
          observe.next(null);
        }
        console.log(res,'添加包');
        this.toolservice.createMessage('success', '添加成功');   
             
      }
      else{
        this.toolservice.createMessage('warning', res.message+'添加包失败');    
      }
    })
  }
  //修改包数量
  numchange(item,e){
    if(item.wlb_tmid){
      this.toolservice.createMessage('warning', '外来包不能修改数量'); 
      return
    }


   if(this.timer1){
     return;
   }
   this.timer1=setTimeout(()=>{
    if((/^[1-9]\d*$/.test(item.b_num))){
      this.addpackage(item,null,'key');
    }
   },500)
 
      console.log(item);
  }

  countpackage(){
    let total=0;
    this.washerdata.forEach(item=>{
        total+=Number(item.b_num);
    });
    this.totalpackage=total;
  }
  //修改
  change(){
    console.log(this.tempactivetype);
    this.pan="default";
    this.buttonwash="default";
    this.changebtn="primary";
    if(!this.tempactivetype){
      this.toolservice.createMessage('warning', '请选定程序'); 
      return;
    }
    const data = {
      Qx:{
      did:this.deptId,
      jgms:this.tempactiveitem.jgms,
      plan_time_name:this.tempactiveitem.proc_name,
      sb_type:this.tempactiveitem.sb_type,
      state:this.tempactiveitem.state,
      state_name:this.tempactiveitem.state_name,
      d_gc:this.tempactiveitem.d_gc,
      dev_id:this.tempactiveitem.dev_id,
      dev_name:this.tempactiveitem.dev_name,
      end_dt:this.tempactiveitem.end_dt,
      id:this.tempactiveitem.id,
      mod_dt:this.timepipe(new Date()),
      mod_uid:this.userId,
      mod_uname:this.userName,
      plan_time:this.plantime,
      proc_id:this.tempactivetype.aaa102,
      proc_name:this.tempactivetype.aaa103,
      start_dt:this.timepipebind(this.date),
      t_gc:this.tempactiveitem.t_gc},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.toolservice.createWarningDialog('是否修改','',()=>{
        this.service.revise(data).subscribe(res => {
            console.log(res,'修改');
            if(res.status=="OK"){
              this.reload(this.tempactiveitem);
                // location.reload();
            //   console.log(res,'修改');
            //   this.getwashers();//刷新状态
              this.toolservice.createMessage('success', '修改成功'); 
            }
          })
    },null)
   
   
  }
  reload(activeitem){
    this.getwashers(activeitem);
  }
 

  //作废

  cancellation(){

    console.log(this.tempactiveitem,this.tempactivetype,'作废');
    this.pan="default";
    this.buttonwash="primary";
    this.changebtn="default";
    this.cancellationdo()
    //this.toolservice.createWarningDialog('是否作废', '', ()=>{this.cancellationdo()},  null)
   
  }
  //作废请求接口
  cancellationdo(){
    //console.log(this.tempactiveitem,this.tempactivetype,'作废');
    const data = {
      Qx:{state:this.tempactiveitem.state, 
        state_name:this.tempactiveitem.state_name,
        cre_dt:this.tempactiveitem.start_dt,
        cre_uid:this.userId,
        cre_uname:this.userName,
        d_gc:this.tempactiveitem.d_gc,
        dev_id:this.tempactiveitem.dev_id,
        dev_name:this.tempactiveitem.dev_name,
        end_dt:this.tempactiveitem.end_dt,
        id:this.tempactiveitem.id,
        is_inv:"1",
        //plan_time:this.mutipe(this.tempactiveitem.proc_name?this.tempactiveitem.proc_name:this.tempactivetype.aaa103,'number'),
        start_dt:this.tempactiveitem.start_dt,
        t_gc:this.tempactiveitem.t_gc},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    console.log(data);
    this.service.cancellation(data).subscribe(res => {
      if(res.status=='OK'){
        
        this.toolservice.createMessage('success', '作废成功');  
        console.log(res,'作废');
        // this.getwashers();
        this.reload(this.tempactiveitem);
      }
      else{
        this.toolservice.createMessage('warning', res.message+'作废失败');  
      }
    
    })
  }
  //开始清洗
  startwash(){
    this.pan="default";
    this.buttonwash="primary";
    this.changebtn="default";
   console.log(this.tempactiveitem);
    if(!this.afterPerson){
      this.toolservice.createMessage('warning','请填写清洗人');
      return;
    }

   if(this.washerdata.length==0){
    this.toolservice.createMessage('warning','请添加包');
    return;
   }

   if(!this.tempactivetype){
     this.toolservice.createMessage('warning','请选定清洗程序');
     return;
   }
  
   if(!this.tempactiveitem.start_dt){// 绑定数据到开始清洗接口，解决点击开始清洗再点作废时报错的bug
      this.tempactiveitem.start_dt=this.toolservice.timepipe(this.date,'yyyy-MM-dd HH:mm:ss');
      this.tempactiveitem.cre_dt=this.toolservice.timepipe(new Date(),'yyyy-MM-dd HH:mm:ss');
      let tlater=this.toolservice.timepipe(this.date.getTime()+Number(this.plantime)*60*1000,'yyyy-MM-dd HH:mm:ss');
      this.tempactiveitem.end_dt=tlater;
      // console.log(this.date,tlater,'20分钟后的时间');
   }
    const data = {
      Qx:{
        did:this.tempactiveitem.did,
        sb_type:this.tempactiveitem.sb_type,
        state:this.tempactiveitem.state,
        state_name:this.tempactiveitem.state_name,
        d_gc:this.tempactiveitem.d_gc,
        dev_id:this.tempactiveitem.dev_id,
        dev_name:this.tempactiveitem.dev_name,
        plan_time:this.plantime,
        start_dt:this.tempactiveitem.start_dt,
        t_gc:this.tempactiveitem.t_gc,
        proc_id:this.tempactivetype.aaa102,
        proc_name:this.tempactivetype.aaa103,
        cre_uid:this.afterPersonuid,
        cre_uname:this.afterPerson},
        
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.startwash(data).subscribe(res => {
      if(res.status=='OK'){
        console.log(res,'清洗接口结果');    
        this.toolservice.createMessage('success', '开始清洗成功');   
        this.reload(this.tempactiveitem);
        this.getwashers(this.tempactiveitem);
        // this.changewasherstate(this.tempactiveitem);
        // this.washerstate='2';
        // this.getwashers();//刷新清洗机状态
        // this.countdown(null,this.mutipe(this.tempactivetype.aaa103,'number'));//开始计时
      }
      else{
        this.toolservice.createMessage('warning', res.message+'开始清洗失败');    
      }
      
        
    })
  }
  //获取清洗机列表
  getwashers(activeItem?){

    // if(activeItem){
    //    this.getwasher(activeItem);
    // }
   
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
        res.returnValue.qxjStateList.forEach(item => {
            if(item.state=='2'){
                   //倒计时开始
                    clearInterval(this.timer);
                    let templefttime=new Date(item.end_dt).getTime()-new Date().getTime();
                    if(templefttime>0){
                    this.countdown(templefttime,null,item);
                    }
                
                // item.state_name=this.lefttime;
            }
          item.active=false;
        });
        this.washerslist=[...res.returnValue.qxjStateList];
        this.counttimes();
        // debugger;
        //换锅后跳到目标锅，激活选定的项
        // console.log(activeItem,'activeItem');
        if(activeItem){
           
            this.washerslist.forEach((element)=>{
                if(element.dev_id==activeItem.dev_id){
                    element.active=true;
                    this.getwasher(element);
                }
            })
        }
        console.log(res,this.washerslist,activeItem,'清洗机数据');
      }
    });
  }
  //刷新列表是重新计算所有锅次
  counttimes(){
    let total=0;
    this.washerslist.forEach((item)=>{
         if(item.state=='0'||item.state=='1'){
            total=total+Number(item.d_gc)-1;
         }
    });
    this.emitservice.eventEmithtotaltoday.emit(total);
  }
  getwasher(item){
  
    this.washerstate=item.state;
    this.packagename='';
    this.plantime=item.plan_time?item.plan_time:'';
    console.log(item,'当前选定清洗机');
    if(item.state=='0'||item.state=='1'){
       this.showbutton=true;
    }
    else{
      this.showbutton=false;
    }
    if(this.tempactiveitem){
        this.tempactiveitem.active=false;
    }
    let now=new Date();
    this.date=item.start_dt?item.start_dt:now;
    item.active=true;
    this.tempactiveitem=item;

    //选定默认清洗程序
    if(item.proc_name){
      this.washtype.forEach((value)=>{
        if(value.aaa103==item.proc_name){
          if(item.plan_time){
            this.choosetype(value,item.plan_time);
          }else{
            this.choosetype(value);
          }
          
        }
      })
    }
    else{
      this.washtype.forEach((value)=>{
        value.active=false;
        this.tempactivetype=null;
      })
    }
    this.emitservice.eventEmithcount.emit(this.tempactiveitem); //发送锅次数量给header
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
        this.loading=false;
        this.washerdata=[].concat(res.returnValue.qxDtlList);
        this.countpackage();
        if( this.Packageinput){
            this.Packageinput.nativeElement.focus();
        }
        this.washerdata.forEach((item)=>{
          if(item.wlb_tmid){
            item.bmc=item.bmc+"("+item.wlb_tmid+")";
            item.updatesl=false;
          }else{
            item.updatesl=true;
          }
        })
       
        console.log(res,'清洗机明细');
    })
  }
  //撤销
  cansle(item){
      let content="";
      // console.log(item);
      // console.log(this.tempactiveitem);
      this.toolservice.createWarningDialog('是否撤销', content, () => {
        console.log('点击是');
        const data = {
          Hsqxdy:{
            b_num:0,
            isChecked:false,
            bid:item.bid,qx_d_gc:this.tempactiveitem.d_gc,
            qx_dev_id:this.tempactiveitem.dev_id,
            wlb_tmid:item.wlb_tmid,
            qx_dev_name:this.tempactiveitem.dev_name,
            qx_t_gc:this.tempactiveitem.t_gc},
          LoginForm: {
            deptId: this.deptId,
            deptName: this.deptName,
            userId: this.userId,
            userName: this.userName
          }
        };
        if(item.basket_id){
         Object.assign(data.Hsqxdy,{},{basket_id:item.basket_id,basket_name:item.basket_name});
        }
        // console.log(data,'撤销请求数据');
       
      
        this.service.cancleaddpackage(data).subscribe(res => {
          if (res['status'] === 'OK') {
            let index;
            this.washerdata.forEach((value,i)=>{
                if(item.bid==value.bid){
                  index=i;
                }
            });
            let templist;
            templist=this.washerdata.concat();
            templist.splice(index,1);
            this.washerdata=templist;
            if(this.washerdata.length==0){//列表为空时刷新清洗机状态
              this.getwashers();
            }
            // console.log(res,index,'撤销接口');
            this.toolservice.createMessage('success', '撤销成功');        
          }
          else{
            this.toolservice.createMessage('warning',res['message']);   
          }
        })
      }, null)
  }
  //获取清洗程序
  getporgram(){
    const data = {
      AA10:{"aaa100":"QXCX"},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getwashprogram(data).subscribe(res => {
      this.washtype=[...res.returnValue.AA10List];
        console.log(res,'清洗程序');
    })
    
  }
  //隐藏弹出列表
  hideul(){
    this.showtopul=false;
  }
  //选定清洗模式
  choosetype(item,val?){
    console.log(item);
      item.active=true;
      if(this.tempactivetype!=null&&this.tempactivetype!=item){
        this.tempactivetype.active=false;
      }
      this.tempactivetype=item;
      this.plantime=this.mutipe(item.aaa103,'number')
      if(val){
        this.plantime=val;
      }
    
      
  }

  colorstate(state){
    let color;
    switch(state){
      case '1':color='prepare';break;
      case '0':color='blank';break;
      case '3':color='tobetest';break;
      case '2':color='washing';break;
    }
    return color;
  }
 
  onChange(e){

  }
  //更改清洗机状态 
  changewasherstate(item){
    item.state='2';
    item.state_name="清洗中";
  }

  //自定义函数过滤器
  mutipe(value,key){
    let start=value.indexOf('(');
    let end=value.indexOf(')');
    if(key=="number"){
       return value.slice(start+1,end);
    }
    else{
      return value.slice(0,start);
    }
  }
   //换锅
   changepan(tplTitle,tplFooter,tplContent){
     if(this.washerdata.length==0){
      this.toolservice.createMessage('warning', '此锅为空，无法换锅'); 
       return;
     }
     this.targetpan=null;
     this.changereson=null;

     console.log(this.tempactiveitem,this.washerdata,'锅中数据');
    this.pan="primary";
    this.buttonwash="default";
    this.changebtn="default";
   
    let tempwashers=this.washerslist;
    this.freewashers=tempwashers.filter((item)=>{
         return (this.tempactiveitem.dev_id!=item.dev_id)&&(item.state=="2"||item.state=="0"||item.state=="1");
     })
     if(this.freewashers.length==0){
         this.toolservice.createMessage('warning','无空闲清洗机可换锅');
         return;
     }
     this.createchangepanModal(tplTitle,tplFooter,tplContent);
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
   
    if(!this.changereson){
         this.toolservice.createMessage('warning','请选择换锅原因');
         return;
    }
    if(!this.targetpan){
        this.toolservice.createMessage('warning','请选择换后清洗机');
        return;
   }
   this.changepanmodal.destroy();
    console.log(this.targetpan,this.changereson.aaa103); 
    const data = {
      Qx:{aft_d_gc:this.targetpan.d_gc,
      aft_dev_id:this.targetpan.dev_id,
      aft_dev_name:this.targetpan.dev_name,
      aft_t_gc:this.targetpan.t_gc,
      isstart:this.tempactiveitem.state=="2"?"1":"0",
      d_gc:this.tempactiveitem.state!="2"?"-1":this.tempactiveitem.d_gc,
      dev_id:this.tempactiveitem.dev_id,
      dev_name:this.tempactiveitem.dev_name,
      start_dt:this.timepipe(new Date()),
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
        if(this.tempactiveitem.state=='2'){//清洗中的锅作废
          this.cancellation();
          this.washerstate='0';
        } 
        this.getwashers(this.targetpan);//刷新清洗机状态
      }
      else{
        this.toolservice.createMessage('warning', res.message);  
      }
       
    })

  }
  timepipebind(time){
     return this.datepipe.transform(time,'yyyy-MM-dd HH:mm:ss');
  }

  timepipe(time){
    let nowday=this.datepipe.transform(time,'yyyy-MM-dd');
    let postday;
    postday=`${nowday} 00:00:00`;
    return postday;
  }
  //选定换锅原因
  chosepan(item){
    this.changereson=item;
     console.log(item);
  }
  //获取换锅原因函数
  getseasons(){
    const data = {
      AA10:{aaa100:"QX_HGYY"},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getwashprogram(data).subscribe(res => {
      this.reasons=[...res.returnValue.AA10List];
      this.reasons.forEach((item)=>{
        item.btntype="default";
      });
      storage.set('changepanreasons',this.reasons);
        console.log(res,this.reasons,'换锅');
    })
    
  }
  //选定目标清洗锅
  chosetargetwasher(item){
     this.targetpan=item;
  }
  //倒计时函数
  countdown(planetime,minute,item){
    let minutes;
    let seconds;
    if(planetime){
      minutes= Math.floor(planetime/1000/60%60);
      seconds=Math.floor(planetime/1000%60);
    }
    else{
      minutes= minute;
      seconds=0;
    }
 
    let that=this;
  
    let timer=setInterval(()=>{
      if(seconds==0&&minutes==0){
        clearInterval(timer);//清除定时器
        that.getwashers();              //刷新清洗机列表
        that.washerstate='3';
        return;
      }
      seconds--;
      if(seconds<0){
        seconds = 59;
        minutes--;
      }
      let minutess = minutes<10?'0'+minutes:minutes;
      let secondss = seconds<10?'0'+seconds:seconds;
     item.state_name=minutess+':'+secondss;
    },1000)

  }
  numberchange(){
    let reg=new RegExp('-','i');
    if(reg.test(this.plantime)){
      this.plantime=String(this.plantime).replace('-','');
    }
    
  }
  
  

 

}
