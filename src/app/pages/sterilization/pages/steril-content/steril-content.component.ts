import { Component, OnInit ,TemplateRef,Output,EventEmitter,ElementRef,ViewChild,AfterViewInit} from '@angular/core';
import storage from './../../../../service/storage';
import {ToolsService} from './../../../../service/tools/tools.service'
import { NzModalRef, NzModalService,NzMessageService } from 'ng-zorro-antd';
import {DatePipe} from "@angular/common";
import { PublicuseService} from './../../../../service/http/publicuse.service';
import { EmitService} from './../../../../service/middleman.service';
import { HttpService } from 'src/app/service/http/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { RecoveryService } from '../../../../service/http/recovery.service';

@Component({
  selector: 'app-steril-content',
  templateUrl: './steril-content.component.html',
  styleUrls: ['./steril-content.component.scss']
})
export class SterilContentComponent implements OnInit,AfterViewInit {
    @ViewChild('packageinput')
    Packageinput:ElementRef
    @ViewChild('mjrinput')
    Mjrinput:ElementRef
  public date;//日期时间
  public pik="./../../../../../assets/images/";
  public washerslist=[];
  public contol=false;
  public userName: string;
  public userId: string;
  public deptId: string;
  public deptName: string;
  public listheader=['包条码','包名称','操作'];
  public packagename:string;//包明称或盘条码
  public BpzglList;
  public slidelist=[];
  public loading=true;
  public totalpackage:number=0;
  public tempactivetype=null;
  private changepanmodal;

  private washerstate;

  private reasons=[];
  private changereson;

  private changebtn='default';//换锅按钮颜色

  private showbutton:boolean=false;
  disable=false;

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
  public afterPerson:string;//灭菌
  public afterPersonuid:string;//灭菌
  private timer;
  private Loginform;
  private baseNumber;
  isLoading=false;
  iffocus=true;
  timer1;
  searchChange$ = new BehaviorSubject('');
  // shownumberwarn=false;
  afterPersonDuration;
  packDuration;
  typeDuration;
  baseNumberDuration;



  constructor(
    public Reservice: RecoveryService,
    private service:HttpService,
    private toolservice:ToolsService,
    public modalService:NzModalService,
    private datepipe:DatePipe,
    private publicservice:PublicuseService,
    private emitservice:EmitService,
    private toastmessage: NzMessageService
 
  ) { 
    const message = storage.get('userMessage');
    // this.BpzglList=this.publicservice.getulPackages();
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.Loginform= {deptId: this.deptId,deptName: this.deptName,userId: this.userId,userName: this.userName}
  }

  ngOnInit() {
    this.getwashers();
    this.getporgram();
    this.getseasons();
  }
  ngAfterViewInit(){
    // this.Packageinput.nativeElement.focus();
  }
  // postbase(){
  //     this.searchChange$.next(this.baseNumber);
  //     this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(this.postbase1));
  // }
  // // 人员 回车 查询

  focus(element,skip,input){

    let zg=new RegExp('ZG','i');
    let qp=new RegExp('QP','i');
    let tm=new RegExp('TM','i');
    if(zg.test(element)){
      console.log(element);
      let index=element.indexOf('ZG');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
     // this.Mjrinput.nativeElement.focus();
      this.afterPerson=element.substring(index+2,element.length);
      let e={keyCode:13};
      if(skip!='ZG'){
        this.personKeyUp(e);
        return false;
      }
    }
    if(tm.test(element)){
      console.log(element);
      let index=element.indexOf('TM');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
      this.Packageinput.nativeElement.focus();
      this.packagename=element.substring(index+2,element.length);
      let e={keyCode:13};
      if(skip!='TM'){
        this.packageidkeyup(e);
        return false;
      }
    }
  
    return true;
  }



personKeyUp(e) {

  if(e.target.value!=''&&this.afterPersonDuration==0){
    this.afterPersonDuration=null;
    this.toastmessage.remove()
  }
   
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
          if(this.afterPersonDuration==0){
            this.afterPersonDuration=null;
            this.toastmessage.remove()
          }
          
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
  postbase(){
    if(this.baseNumber!=''&&this.baseNumberDuration==0){
      this.baseNumberDuration=null;
      this.toastmessage.remove();
    }


    if(!this.baseNumber||this.timer1){
      return;
    }
 
    this.iffocus=false;
    this.timer1=setTimeout(()=>{
      const data = {
        service:'SbxxService',
        method:'updateMjjs',
        Sbxx:{id:this.tempactiveitem.dev_id,bsl:this.baseNumber},      
        LoginForm:this.Loginform
      };
      this.service.getdata(data).subscribe(res => {
        this.timer1=null;
        this.toolservice.createMessage('success','基数包修改成功');
        console.log(res,'修改基数包成功');
        ///this.getwashers(this.tempactiveitem);
      
        
      })
    },700)
  
  }
  // getbasenum(){
  //   const getRandomNameList = (name: string) => this.http.get(`${this.randomUserUrl}`).pipe(map((res: any) => res.results)).pipe(map((list: any) => {
  //     return list.map(item => `${item.name.first} ${name}`);
  //   }));
  //   const optionList$: Observable<string[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));
  //   optionList$.subscribe(data => {
  //     this.optionList = data;
  //     this.isLoading = false;
  //   });
  // }

  // refresh(){
  //   console.log('刷星页面');
  //   this.getwashers();
  //   this.getwasher(this.tempactiveitem);
  // }

    //获取清洗机列表
    getwashers(activeItem?){
      const data = {
        service:'MjService',
        method:'getAllMjjState',
        Mj:{tmxxList:[]},
        LoginForm:this.Loginform
      };
      this.service.getdata(data).subscribe(res => {
        if(res.status=="OK"){
          res.returnValue.mjjStateList.forEach(item => {
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
          this.washerslist=[...res.returnValue.mjjStateList];
          if(activeItem){
             this.washerslist.forEach((element)=>{
                 if(element.dev_id==activeItem.dev_id){
                     element.active=true;
                     this.getwasher(element);
                 }
             })
         }
          this.counttimes(this.washerslist);
          console.log(res,this.washerslist,'清洗机数据');
        }
        else{
          this.toolservice.createMessage('warning','灭菌机列表获取失败');
        }
      });
    }
    

      //刷新列表是重新计算所有锅次
  counttimes(washerslist){
    let total=0;
    washerslist.forEach((item)=>{
         if(item.state=='0'||item.state=='1'){
            total=total+Number(item.d_gc)-1;
         }
    });
    let tempobj={todaytotaltimes:total,todaytimes:this.tempactiveitem?this.tempactiveitem.d_gc:0,totaltimes:this.tempactiveitem?this.tempactiveitem.t_gc:0};
    console.log(tempobj);
    this.emitservice.eventEmitdifferntimes.emit(tempobj);
  }

//获取单个清洗机
  getwasher(item){
     this.washerstate=item.state;
      // this.baseNumber=item.bsl;
     console.log(item,item.bsl,'当前选定清洗机');
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
     if(item.plan_time){
       console.log(this.washtype,'washtype');
       this.washtype.forEach((value)=>{
         if(value.aaa102==item.plan_time){
           this.choosetype(value);
         }
       })
     }
     else{
       this.washtype.forEach((value)=>{
         value.active=false;
         this.tempactivetype=null;
       })
     }
     this.counttimes(this.washerslist);
     this.getwasherdetail(item);
  

     
    
   }
    //选定清洗模式
  choosetype(item){
    console.log(item);
      item.active=true;
      if(this.tempactivetype!=null&&this.tempactivetype!=item){
        this.tempactivetype.active=false;
      }
      this.tempactivetype=item;
      if(this.typeDuration==0){
        this.typeDuration=null;
        this.toastmessage.remove();
      }
  }
  //   //点击灭菌机获取灭菌机明细
  getwasherdetail(item){
    console.log(item,'')
    const data = {
      service:'MjService',
      method:'getMjDtlList',
      Mj:{
        did:this.deptId,
        jgms:item.jgms?item.jgms:'',
        sb_type:item.sb_type,
        state:item.state,
        state_name:item.state_name,
        tmxxList:[],
        d_gc:item.d_gc,dev_id:item.dev_id,dev_name:item.dev_name,is_inv:"1",t_gc:item.t_gc,type:item.type},
      LoginForm: this.Loginform
    };
    this.service.getdata(data).subscribe(res => {
        if(this.Packageinput&&this.iffocus){
            this.Packageinput.nativeElement.focus();
        }
       
        this.loading=false;
        this.washerdata=[...res.returnValue.mjDtlList];
        this.countpackage();
        console.log(res,'灭菌机明细');
    })
  }
  //计算总数函数
  countpackage(){
    let total=0;
    this.washerdata.forEach(item=>{
        total+=Number(item.b_num);
    });
    this.totalpackage=total;
  }


   //倒计时函数
   countdown(planetime,minute,item){
    let minutes;
    let seconds;
    // let now=new Date().getTime();
    // console.log(this.toolservice.timepipe(now,'yyyy-MM-dd HH:mm:ss'));
    if(planetime){
      minutes= Math.floor(planetime/1000/60%60);
      seconds=Math.floor(planetime/1000%60);
    }
    else{
      minutes= minute;
      seconds=0;
    }
 
    console.log(minutes,seconds,'minutes');
    let that=this;
  
    let timer=setInterval(()=>{
      if(seconds==0&&minutes==0){
        clearInterval(timer);//清除定时器
        that.getwashers(this.tempactiveitem);              //刷新清洗机列表
        that.washerstate='3';
        // that.toolservice.createMessage('success','清洗完成');
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
  
  //绑定状态颜色
  colorstate(item){
    let color;
    if(!item){
      return;
    }
    switch(item.state){
      case '1':color='prepare';break;
      case '0':color='blank';break;
      case '3':color='tobetest';break;
      case '2':color='washing';break;
    }
    return color;
  }

  //   //撤销
  cansle(item){
      let content="";
      console.log(item);
      this.toolservice.createWarningDialog('是否撤销', content, () => {
        const data = {
          service:'MjService',
          method:'revokeMj',
          MjDtl:{tmid:item.tmid},
          LoginForm: this.Loginform
        };
        this.service.getdata(data).subscribe(res => {
          if (res['status'] === 'OK') {
            let index;
            this.washerdata.forEach((value,i)=>{
                if(item.tmid==value.tmid){
                  index=i;
                }
            });
            let templist;
            templist=this.washerdata.concat();
            templist.splice(index,1);
            this.washerdata=templist;
            if(this.washerdata.length==0){//列表为空时刷新清洗机状态
              this.getwashers(this.tempactiveitem);
            }
            this.toolservice.createMessage('success', '撤销成功');        
          }
          else{
            this.toolservice.createMessage('warning',res['message']);   
          }
        })
      }, null)
  }

 
  // //扫描包条码
  packageidkeyup(e) {
   
   this.showtopul=this.packagename==''?false:true;//显示或影藏下拉列表

    if (e.keyCode === 13 && this.packagename.trim()) {

      let goon=this.focus(this.packagename,'TM','packagename');
      if(!goon){
         return;
      }  

      this.isLoading=true;
        this.showtopul=false;
        let thisreg=new RegExp('^(TM|tm)');
        if(thisreg.test(this.packagename)){
          this.packagename=this.packagename.slice(2,this.packagename.length);
        }
        this.addpackage();       
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
  // //添加包到清洗机
  addpackage(){
    console.log(this.tempactiveitem,'123456');
    let packagename=this.packagename;
    this.packagename='';
    if(!this.afterPerson){
      this.toolservice.createMessage('warning','请填写灭菌人');
      this.isLoading=false;
       
      return;
     }else{

     
    const data = {
      MjDtl:{"d_gc":this.tempactiveitem.d_gc,"dev_id":this.tempactiveitem.dev_id,"t_gc":this.tempactiveitem.t_gc,"tmid":packagename,"cre_uid":this.afterPersonuid,
      "cre_uname":this.afterPerson},
      service:'MjService',
      method:'addMjDtl',
      LoginForm: this.Loginform
    };
 
    console.log(data,'pandata');
    this.service.getdata(data).subscribe(res =>{
      this.isLoading=false;
        
      if (res['status'] === 'OK') {
        console.log(res,'res');
        // if(this.washerdata.length==0){this.getwashers()}; //刷新清洗机列表  
        // //过滤本锅中包的信息，更新添加包数量
        // this.addpackagefun(res.returnValue.Hsqxdy);
        // console.log(res,'添加包');
       
        this.getwashers(this.tempactiveitem);
        this.washerdata=this.washerdata.concat(res.returnValue.MjDtlList);
        if(this.packDuration==0&&this.washerdata.length){
            this.packDuration==null;
            this.toastmessage.remove();
        }
        console.log(this.washerdata,'this.washerdata');
        this.toolservice.createMessage('success', '添加成功');        
      }
      else{
        console.log(res);
        if(res.status=='warn'){
             this.cansle({tmid:packagename});
        }
        else{
          this.toolservice.createMessage('warning', res.message+'添加包失败'); 
        }
           
      }
     
    })
  }
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
      service:'MjService',
      method:'modMj',
      Mj:{
      did:this.deptId,
      jgms:this.tempactiveitem.jgms,
      // plan_time_name:this.tempactiveitem.proc_name,
      sb_type:this.tempactiveitem.sb_type,
      state:this.tempactiveitem.state,
      state_name:this.tempactiveitem.state_name,
      tmxxList:[],
      is_inv:'1',
      d_gc:this.tempactiveitem.d_gc,
      dev_id:this.tempactiveitem.dev_id,
      dev_name:this.tempactiveitem.dev_name,
      end_dt:this.tempactiveitem.end_dt,
      id:this.tempactiveitem.id,
      mod_dt:this.timepipe(new Date()),
      mod_uid:this.userId,
      mod_uname:this.userName,
      plan_time:this.tempactivetype.aaa102,
      type:this.tempactiveitem.type,
      start_dt:this.timepipebind(this.date),
      t_gc:this.tempactiveitem.t_gc},
      LoginForm: this.Loginform
    };
    this.service.getdata(data).subscribe(res => {
      console.log(res,'修改');
      if(res.status=="OK"){
        console.log(res,'修改');
        // this.getwashers();//刷新状态
        // this.refresh();
        // location.reload();
        this.toolservice.createMessage('success', '修改成功'); 
      }
      else{
        this.toolservice.createMessage('warning', res.message+'修改失败'); 
      }
    })
   
  }
  reload(activeitem){
    this.getwashers(activeitem);
  }
 

  // //作废

  cancellation(){
    console.log(this.tempactiveitem,this.tempactivetype,'作废');
    this.pan="default";
    this.buttonwash="primary";
    this.changebtn="default";
    this.toolservice.createWarningDialog('是否作废', '', ()=>{this.cancellationdo()},  null);
   
  }
  // //作废请求接口
  cancellationdo(){
    console.log(this.tempactiveitem);
    const data = {
      service:'MjService',
      method:'invMj',
      Mj:{
        did:this.deptId,
        jgms:this.tempactiveitem.jgms?this.tempactiveitem.jgms:'',
        sb_type:"3,4,5",
        tmxxList:[],
        state:this.tempactiveitem.state, 
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
        plan_time:this.tempactiveitem.plan_time,
        start_dt:this.tempactiveitem.start_dt,
        t_gc:this.tempactiveitem.t_gc,
        type:this.tempactiveitem.thpe},
      LoginForm: this.Loginform
    };
    this.service.getdata(data).subscribe(res => {
      if(res.status=='OK'){
        this.tempactiveitem=null;
        this.toolservice.createMessage('success', '作废成功');  
        console.log(res,'作废');
        this.getwashers(this.tempactiveitem);
      }
      else{
        this.toolservice.createMessage('warning', res.message+'作废失败');  
      }
    
    })
  }
  // //开始灭菌
  startwash(){
    this.pan="default";
    this.buttonwash="primary";
    this.changebtn="default";
   
   console.log(this.tempactiveitem);

   if(this.baseNumber==''||this.baseNumber==undefined){
    this.baseNumberDuration=0;
    this.toastmessage
    .error('请输入基数包数量', { nzDuration: this.baseNumberDuration})
        //  this.shownumberwarn=true;
        // this.toolservice.createMessage('error','请选定灭菌程序');
        return;
   }
   if(!this.afterPerson){
    this.afterPersonDuration=0;
    this.toastmessage
    .error('请填写灭菌人', { nzDuration: this.afterPersonDuration})
    // this.toolservice.createMessage('warning','请填写灭菌人');
    return;
   }
   if(this.washerdata.length==0&&this.tempactiveitem.type!='1'){
    this.packDuration=0;
    this.toastmessage
    .error('请添加包', { nzDuration: this.packDuration})
    // this.toolservice.createMessage('warning','请添加包');
    return;
   }
   if(!this.tempactivetype){
    this.typeDuration=0;
    this.toastmessage
    .error('请选定灭菌程序', { nzDuration: this.typeDuration})
      //  this.toolservice.createMessage('warning','请选定灭菌程序');
     return;
   }

  
   if(!this.tempactiveitem.start_dt){// 绑定数据到开始清洗接口，解决点击开始清洗再点作废时报错的bug
      this.tempactiveitem.start_dt=this.toolservice.timepipe(this.date,'yyyy-MM-dd HH:mm:ss');
      this.tempactiveitem.cre_dt=this.toolservice.timepipe(new Date(),'yyyy-MM-dd HH:mm:ss');
      let tlater=this.toolservice.timepipe(this.date.getTime()+Number(this.mutipe(this.tempactivetype.aaa103,'number'))*60*1000,'yyyy-MM-dd HH:mm:ss');
      this.tempactiveitem.end_dt=tlater;
      // console.log(this.date,tlater,'20分钟后的时间');
   }
   this.disable=true;
    const data = {
      service:'MjService',
      method:'startMj',
      Mj:{
        did:this.tempactiveitem.did,
        sb_type:this.tempactiveitem.sb_type,
        state:this.tempactiveitem.state,
        state_name:this.tempactiveitem.state_name,
        d_gc:this.tempactiveitem.d_gc,
        dev_id:this.tempactiveitem.dev_id,
        dev_name:this.tempactiveitem.dev_name,
        plan_time:this.tempactivetype.aaa102,
        start_dt:this.tempactiveitem.start_dt,
        t_gc:this.tempactiveitem.t_gc,
        jgms:this.tempactiveitem.jgms?this.tempactiveitem.jgms:'',
        tmxxList:[],
        is_inv:"1",
        bsl:this.baseNumber,
        type:this.tempactiveitem.type,
        cre_uid:this.afterPersonuid,
        cre_uname:this.afterPerson
        },        
      LoginForm:this.Loginform
    };

    this.service.getdata(data).subscribe(res => {
      this.disable=false;
      if(res.status=='OK'){

        console.log(res,'');
        if(res.returnValue.Mj){
          let mj =res.returnValue.Mj
          let PRINT_URL="";         
          PRINT_URL= mj.mjdydz;
          PRINT_URL +="mjj="+mj.dev_name+"&mjkssj="+this.toolservice.timepipe(mj.start_dt,'yyyy-MM-dd HH:mm:ss');
          PRINT_URL +="&mjgc="+mj.d_gc+"&lktm="+mj.basket_id;
          PRINT_URL +="&bsl="+(mj.bsl==null?0:mj.bsl);
          PRINT_URL +="&swjcb="+mj.swjctm;
          PRINT_URL +="&ksid="+this.deptId;
          console.log(PRINT_URL,'url')
          window.open(PRINT_URL);
        }
        console.log(res,'灭菌接口结果');    
        this.toolservice.createMessage('success', '开始灭菌');   
        this.getwashers(this.tempactiveitem);
        this.afterPerson='';
      }
      else{
        this.toolservice.createMessage('warning', res.message+'灭菌失败');    
      }
      
    })

   
  }


 



  //获取清洗程序
  getporgram(){
    const data = {
      method:'getAa10ListForMobile',
      service:'ParamService',
      AA10:{"aaa100":"MJJHSJ"},
      LoginForm: this.Loginform
    };
    this.service.getdata(data).subscribe(res => {
      this.washtype=[...res.returnValue.AA10List];
        console.log(res,'灭菌程序');
    })
    
  }
  //隐藏弹出列表
  hideul(){
    this.showtopul=false;
  }


//   colorstate(item){
//     let color;
//     switch(item.state){
//       case '1':color='prepare';break;
//       case '0':color='blank';break;
//       case '3':color='tobetest';break;
//       case '2':color='washing';break;
//     }
//     return color;
//   }
 
//   onChange(e){

//   }
//   //更改清洗机状态 
//   changewasherstate(item){
//     item.state='2';
//     item.state_name="清洗中";
//   }

//   //自定义函数过滤器
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
    this.changepanmodal.destroy();
    console.log(this.targetpan,this.changereson.aaa103); 
    const data = {
      service:'MjService',
      method:'chgMj',
      Mj:{aft_d_gc:this.targetpan.d_gc,
      tmxxList:[],
      aft_dev_id:this.targetpan.dev_id,
      aft_dev_name:this.targetpan.dev_name,
      aft_t_gc:this.targetpan.t_gc,
      isstart:this.tempactiveitem.state=="2"?"1":"0",
      d_gc:this.tempactiveitem.state!="2"?"-1":this.tempactiveitem.d_gc,
      dev_id:this.tempactiveitem.dev_id,
      dev_name:this.tempactiveitem.dev_name,
      start_dt:this.timepipe(new Date()),
      hgyy:this.changereson.aaa103},
      LoginForm:this.Loginform
    };
    this.service.getdata(data).subscribe(res => {
      if(res.status=="OK"){
        this.toolservice.createMessage('success', "换锅成功");
        // if(this.tempactiveitem.state=='2'){//清洗中的锅作废
        //   this.cancellation();
        //   this.washerstate='0';
        // } 
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
      storage.set('changepanreasons',this.reasons);
        console.log(res,this.reasons,'换锅');
    })
    
  }
  //选定目标清洗锅
  chosetargetwasher(item){
     this.targetpan=item;
  }

  ngOnDestroy(){
    this.toastmessage.remove();
  }

}