import { Component, OnInit ,TemplateRef,ViewChild,ElementRef,AfterViewInit,Renderer2} from '@angular/core';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ToolsService } from '../../../../service/tools/tools.service';

import storage from '../../../../service/storage';
import { RecoveryService } from '../../../../service/http/recovery.service';


import { EmitService } from '../../../../service/middleman.service';

import { BrokedataService } from './../../../../service/state/wastage.service'

import { LosscordComponent } from './../../../../pages/torecover/component/losscord/losscord.component';

import { Router }  from '@angular/router';


import {DatePipe} from "@angular/common";

import {PublicuseService } from './../../../../service/http/publicuse.service';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { debug } from 'util';



@Component({
  selector: 'app-recovery-recovery',
  templateUrl: './recovery-recovery.component.html',
  styleUrls: ['./recovery-recovery.component.scss']
})
export class RecoveryRecoveryComponent implements OnInit,AfterViewInit {
    @ViewChild('packageinput')
    Packageinput:ElementRef;
    @ViewChild('losscontent')
    lossContent:ElementRef;
    @ViewChild('tablebox')
    tablebox:ElementRef;
    @ViewChild('tabledetail')
    tabledetail:ElementRef;
    @ViewChild('afterperson')
    afterPersoninput:ElementRef;
    @ViewChild('plate')
    plate:ElementRef;
    
  isLoading=true;
  dateFormat = 'yyyy-MM-dd';
  public palteid;
  public today=new Date();
  public formtime=new Date();
  public modal2;
  public recovercount:number=0;//损耗登记数量
  public transformdata;
  public packageId: string='';
  public packageList = [];
  public plateList = [];
  public plateListFromPackageList = [];
  public userName: string;
  public userId: string;
  public deptId: string;
  public deptName: string;
  public packageStatus: string;
  public prePerson: string; // 下收人
  public prePersonuid:string; //下收人id
  public afterPerson: string; // 回收人
  public afterPersonuid: string; // 交接人
  public selectItem = {}; // 选择selectItem
  public material: number;
  public materialArray = [];
  public showpan=[];
  public cleannum:number=0;
  public tempPan;
  public panlist=[];
  private changepanmodal;
  private firsttimeinit=true;
  public activeImg;
  private serviceip;
  public Tmxx={
    bmc:'',
    bid:'',
  };
  small='small';
  firsttime=true;
  firsttime1=true;
  isbd=true;
  packagsarr=[];
  platearr=[];
  bindstart:string='package';
  constructor(
    public service: RecoveryService,
    public tools: ToolsService,
    public datepipe: DatePipe,
    public emitservice:EmitService,
    public modalService:NzModalService,
    public brokedataservice:BrokedataService,
    public router:Router,
    private publicservice:PublicuseService,
    private renderer:Renderer2
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.prePerson = this.userName;
  }

  ngOnInit() {
    this.emitservice.hsr.emit({'hsrname':'','hsrid':''})
    let nowday=this.datepipe.transform(this.today,'yyyy-MM-dd');
    let postday;
    postday={"end_dt_hs":`${nowday} 23:59:59`,"isChecked":false,"start_dt_hs":`${nowday} 00:00:00`};
   this.getPackageList(postday);
    //  this.initgetdata();
    this.emitservice.eventEmit.subscribe((value)=>{
      this.recovercount=value;
    });
    this.emitservice.recoverysuccess.subscribe((res)=>{
        let timenow=this.gettimenow();
        this.getPackageList(timenow);
    })
    this.Packageinput.nativeElement.focus();
    let observer=new Observable((observer)=>{this.publicservice.getServiceIp(observer);}).subscribe((value)=>{
        this.serviceip=value;
    });
    // this.emitservice.showloading.subscribe(res=>{
    //   console.log(res,'收到通知');
    //   this.isLoading=res;
    // })
  

      
  }

  focus(element,skip,input){
    let qp=new RegExp('QP','i');
    let tm=new RegExp('TM','i');
    let bf=new RegExp('BF','i');
    let zg=new RegExp('ZG','i');
    console.log(element,skip,input,'2323')
    if(qp.test(element)){
      let index=element.indexOf('QP');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
      this.plate.nativeElement.focus();
      this.palteid=element.substring(index+2,element.length);
      this.getsignplate();
      return false;

    }
    if(tm.test(element)){
      // element=element.substr(2,element.length-2);
      let index=element.indexOf('TM');
      let oldinput=element.slice(0,index);
      this[input]=oldinput.length>0?oldinput:'';
      this.Packageinput.nativeElement.focus();
      let e={keyCode:13};
      this.packageId=element.substring(index+2,element.length);

      if(skip!='TM'){
        this.packageIdKeyUp(e);
        return false;
      }

    }
    if(bf.test(element)&&skip!='BF'){
      element=element.substr(2,element.length-2);
      return false;
    }
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


    



    return true;
  }
  // initgetdata(){
  //   let nowday=this.datepipe.transform(this.today,'yyyy-MM-dd');
  //   let postday;
  //   postday={"end_dt_hs":`${nowday} 23:59:59`,"isChecked":false,"start_dt_hs":`${nowday} 00:00:00`};
  //  this.getPackageList(postday);
  //   // this.settableheight();
  // }
  ngAfterViewInit(){
    // this.settableheight();
  }
// 人员 回车 查询
personKeyUp(e) {
 
  const personId =this.afterPerson;
 
  if (e.keyCode === 13 && personId) {
   
    console.log('循环调用');
    let goon=this.focus(personId,'ZG','afterPerson');
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
    this.service.getPersonMessageByPersonId(data).subscribe(res => {
      if (res['status'] === 'OK') {
        if (res['returnValue'] && res['returnValue']['Userinfo']) {
          const {us_username: name} = res['returnValue']['Userinfo'];
          const {us_userid: uid} = res['returnValue']['Userinfo'];
          this.afterPerson = name;
          this.afterPersonuid = uid;
          this.emitservice.hsr.emit({'hsrname':name,'hsrid':uid})
        } else {
          this.afterPerson = '';
          this.afterPersonuid = '';
          this.emitservice.hsr.emit({'hsrname':'','hsrid':''})
        }
      } else {
        this.tools.createMessage('warning', res['message']);
      }
    });
  }
}

  settableheight(){
     let tableheight=this.tabledetail.nativeElement.offsetHeight;
     let headerheight=this.tablebox.nativeElement.getElementsByClassName('thead')[0].clientHeight;
     console.log(tableheight,headerheight,this.tablebox.nativeElement,'高度');
     this.renderer.setStyle(this.tablebox.nativeElement.getElementsByClassName('tbodyf')[0],'height',`${tableheight-headerheight}px`);
     this.renderer.setStyle(this.tablebox.nativeElement.getElementsByClassName('tbodyf')[0],'overflow-y','scroll');
  }
  gettimenow(){
    let now=this.datepipe.transform(new Date(),'yyyy-MM-dd');
    let timenow={"end_dt_hs":`${now} 23:59:59`,"isChecked":false,"start_dt_hs":`${now} 00:00:00`};
    return timenow;
  }
  unchart(item){
    console.log(item,'item')
    const data = {
      Hsqxdy:{hs_tmid:item.hs_tmid},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };

        this.modalService.confirm({
            nzTitle: '温馨提示?',
            nzContent: '确定要检定不合格吗',
            nzOkText: '不合格',
            nzOkType: 'danger',
            nzOnOk: () => {
              this.service.unchart(data).subscribe(res => {
                console.log(res,'res');
                if(res.status="OK"){
                  this.tools.createMessage('success','操作成功');
                  let timenow=this.gettimenow();
                  this.getPackageList(timenow);
                }
               
             });
            
            },
            nzCancelText: '取消',
            nzOnCancel: () => {
              console.log('取消')
            }
        });
    
 
  }
  
//日期改变
  getlist(){
    // this.emitservice.eventEmittodayrecover.emit(this.timepipe(this.formtime));
    this.getPackageList(this.timepipe(this.formtime));
    console.log(this.formtime);
  }
  //时间转化函数
  timepipe(time){
    let nowday=this.datepipe.transform(time,'yyyy-MM-dd');
    let postday;
    postday={"end_dt_hs":`${nowday} 23:59:59`,"isChecked":false,"start_dt_hs":`${nowday} 00:00:00`};
    return postday;
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };

  //损耗登记弹窗
  createlossComponentModal(tplTitle:TemplateRef<{}>,tplFooter: TemplateRef<{}>): void {
    this.modal2 = this.modalService.create({
      nzTitle: tplTitle,
      nzOkType: 'primary',
      nzContent: LosscordComponent,
      nzFooter: tplFooter
    });
    this.modal2.nzWidth=480;
  }
  destroyTplModal(): void {
      if(this.recovercount==0){
        // this.modal2.destroy();
        this.tools.createMessage('warning','请添加数量');
        return;
      }
    const data = {
      Sh:{"sh_did":this.brokedataservice.ksid,"sh_dname":this.brokedataservice.ksname},
      ShDtl:{shList:[{"sh_type_name":this.brokedataservice.broketype.aaa103,"bid":this.brokedataservice.bid,"bmc":this.brokedataservice.brokematerial.bmc,"clid":this.brokedataservice.brokematerial.clid,"clmc":this.brokedataservice.brokematerial.clmc,"sh_num":this.recovercount,"sh_type":this.brokedataservice.broketype.aaa102,"tmid":this.brokedataservice.tmid}]},
      LoginForm: {  
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.storageloss(data).subscribe(res => {
      if(res.status=="OK"){
        this.tools.createMessage('success', `损耗登记成功`);
      }
      else{
        this.tools.createMessage('warning', `损耗登记失败`);
      }
    });
   this.recovercount=0;
   this.modal2.destroy();
   
  }
  //获取损耗类型接口
  getlosstype(tplTitle:TemplateRef<{}>,tplFooter: TemplateRef<{}>) {
      //重置默认数量为0
      this.recovercount=0;
    const data = {
      AA10:{"aaa100":"SH_TYPE"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getlossType(data).subscribe(res => {
      this.transformdata.rows=this.transformdata.TmxxList;

      let losscordres={'transformdata':this.transformdata,'AA10List':res.returnValue.AA10List,'Tmxx':this.Tmxx};
      storage.set('losscordres',losscordres)
        console.log(losscordres,'getsucess');
        if(!losscordres.transformdata){
            this.tools.createMessage('warning','请选定包');
           return;
        }
      this.createlossComponentModal(tplTitle,tplFooter);
    });
  }
  binding(items){
    console.log(this.packagsarr,items,'cs')
    this.isbd=false;
    this.packagsarr.forEach((pack, index) => {
      this.packageList.forEach((packs, index) => {
        if(pack.hs_tmid==packs.hs_tmid){
          this.selectpan(packs,items);
        }
      })
    
   })
  }
//扫描包条码

  packageIdKeyUp(e) {


    if (e.keyCode === 13 && this.packageId.trim()) {




      let goon=this.focus(this.packageId,'TM','packageId');

      if(!goon){
        return;
      }
      if(!this.isbd){
        this.bindplate()
      }
      if(!this.afterPerson){
        this.tools.createMessage('warning', '请填写回收人');
        return;
      }
      // this.packageId=this.publicservice.pipestart(this.packageId,'TM');
        console.log('循环调用1');
      
        console.log(this.packageId);
        const data = {
          HsLog: {
            tmid: this.packageId.trim(),
            opt_uname:this.afterPerson,
            opt_uid:this.afterPersonuid
          },
          LoginForm: {
            deptId: this.deptId,
            deptName: this.deptName,
            userId: this.userId,
            userName: this.userName
          }
        };
        this.service.recoveryBarCode(data).subscribe(res => {
          if (res['status'] === 'OK') {
            this.emitgetcount();


            
            this.emitservice.eventEmithaverecovercount.emit();
            this.tools.createMessage('success', `包条码(${this.packageId.trim()})回收成功`);
            let timenow=this.gettimenow();
            this.getPackageList(timenow,this.packageId.trim());
            
            this.packageId='';

          } else {
            if (res['message'].indexOf('是否撤销') !== -1) {
              this.cancelRecovery(this.packageId.trim());
            } else {
              this.packageId='';
              this.tools.createMessage('warning', res['message']);
            }
          }
        });
  
    }
  }
  bindif(item,name){
    console.log(this.bindstart,this.packagsarr,'qxpbd')


    if(this.bindstart=='package'&&name=="package"){
          this.packagsarr.push(item);
          
    }
    if(name=="pan"&&this.packagsarr.length>=1){
      this.binding(item);
    }
    if(name=="pan"&&this.packagsarr.length<1){
      this.tools.createMessage('warning', '没有要绑定的包信息');
    }
    if(name=="package"&&this.bindstart=='pan'){
      this.packagsarr.length=0;
      this.packagsarr.push(item)
    }
    if(!this.bindstart&&name=="package"){
      this.packagsarr.push(item);
  }
  this.bindstart=name;
  }

  //同时触发请求今日回收接口和待回收接口
  emitgetcount(){
      //请求今日回收接口
      let postday=this.timepipe(this.today);
      this.emitservice.eventEmittodayrecover.emit(postday);
      //请求待回收接口
      this.emitservice.eventEmittoberecovercount.emit(null);
  }
  // 撤销回收
  cancelRecovery (barId, e = null) {
    if (e) {
      e.stopPropagation();
    }
    this.tools.createWarningDialog(`包条码(${barId})已回收`, '是否撤销？', () => {
      const data = {
        HsLog: {
          tmid: barId
        },
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
      this.service.cancelRecovery(data).subscribe(res => {
        this.packageId='';
        if (res['status'] === 'OK') {
          this.emitgetcount();
          let timenow=this.gettimenow();
          this.getPackageList(timenow);
          this.materialArray=[];
          this.tools.createMessage('success', `包条码(${barId})撤销回收成功`);
          this.reload();
          // location.reload();
        } else {
          this.tools.createMessage('warning', res['message']);
        }
      });
    });
  }
  reload(){
    let timenow=this.gettimenow();
    let nowday=this.datepipe.transform(new Date(),'yyyy-MM-dd');
    let postday;
    postday={"end_dt_hs":`${nowday} 23:59:59`,"isChecked":false,"start_dt_hs":`${nowday} 00:00:00`};
    this.emitservice.eventEmittodayrecover.emit(postday);
    this.getPackageList(timenow);
    this.materialArray=[];
  }
  //获取包列表

  getPackageList(time,hstm?) {
    // let pipetime=this.datepipe.transform(time,'yyyy-MM-dd HH:MM:SS');
    if(hstm){
      console.log(hstm)
    }
    console.log('cs')
    const data = {
      Tmxx: {
        hs_type: this.packageStatus
      },
      PageReq: {
      },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    Object.assign(data.Tmxx,{},time);
    this.service.getUncollectedPacaageOnToday(data).subscribe(res => {
      this.isLoading=false;
      if (res.status === 'OK') {
        if (res['returnValue'] && res['returnValue']['rows']) {       
          this.packageList=[].concat(res['returnValue'].rows)
          //this.packageList=[].concat(res['returnValue'])
          // console.log(this.packageList,'this.packageList');
          this.material = 0;
          let list =  [];
          let temppanid=[];
          this.packageList.forEach((item, index) => {
            item.showpan=item.p_name?item.p_name:'请选择';
            if(item.p_id&&item.p_id!=-1){
              // 将默认的值绑定到盘
              item.basket_id=item.p_id;
              item.basket_name=item.p_name;
              temppanid.push(item.p_id);
            }
            this.material += parseInt(item.clsl, 10);
            item.plateId = item.p_id ? parseInt(item.p_id, 10) : -1;
            list = [...list, item];
            if(hstm){
              if(item.hs_tmid==hstm){
                this.bindif(item,'package')
                this.bindstart="package";
              }
            }



          });
          if(this.packageList.length!=0&&this.firsttime1){
            setTimeout(()=>{  
               this.settableheight();
              this.firsttime1=false;},20)
         
          }
          //拿出所有的盘id获取盘信息
          // Array.from(new Set(temppanid)) // 盘id去重
          temppanid=temppanid.filter(function (element, index, self) {
            return self.indexOf(element) === index;
          });
            // console.log(temppanid,'temppanid');

        temppanid.forEach((value,index)=>{
            let promise=new Promise((resolve,reject)=>{
            let listpan=this.getPlateFromPackageList(value,'',1,resolve);              
            });
            promise.then((reject)=>{
                if(index==temppanid.length-1){
                // console.log(this.plateList,this.packageList,'indexpaltelist');//所有盘列表已添加完
                this.packageList.forEach((value)=>{
                    if(value.plateId){
                    this.plateList.forEach(valuepan=>{
                            if(value.p_id==valuepan.basket_id){
                                valuepan.bsl=valuepan.bsl-0+1; 
                                valuepan.templist=valuepan.templist?valuepan.templist.concat(value):[].concat(value);
                            }
                    })
                    }
                })
                } 
            })
        })
        //this.bindif(res.returnValue,'package');
        //this.bindstart="package";


        if(this.firsttimeinit){
            this.firsttimeinit=false;
            this.getnumbind();
        }
    

          // 根据 plateId 冒泡 排序
          for (let i = 0; i < list.length - 1; i ++) {
            for (let j = i + 1; j < list.length; j ++) {
              if (list[i].plateId > list[j].plateId) {
                [list[i], list[j]] = [list[j], list[i]];
              }
            }
          }
          this.plateListFromPackageList = [];
      
        }
      } else {
      }
    });

  }

  // 点击加急
  clickEmergent(item, e) {
    e.stopPropagation();
    const content = item.isjj === '1' ? '是否取消加急' : '是否加急';
    this.tools.createWarningDialog(content, '', () => {
      const data = {
        Tmxx: {
          isjj: item.isjj === '1' ? '0' : '1',
          tmid: item.hs_tmid
        },
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
      this.service.setPackageIsUrgent(data).subscribe(res => {
        if (res['status'] === 'OK') {
          this.getPackageList(new Date());
          this.tools.createMessage('success', item.isjj === '1' ? '取消加急成功' : '加急成功');
          item.isjj = item.isjj === '1' ? '0' : '1';
          
        }
      });
    });
  }
  // 选择包状态
  selectPackageStatus(status) {
    if (this.packageStatus !== status) {
      console.log(status,'status');
      switch(status){  
        case '过期回收':this.packageStatus='2';break;
        case '直接回收':this.packageStatus='4';break;
        case '使用回收':this.packageStatus='1';break;
        case '不合格回收':this.packageStatus='3';break;
        case '全部':this.packageStatus='';break;
      }
      this.getPackageList(this.today);
    }
  }

//点击包时
  selectPackage (item) {
    console.log(item);
    this.activeImg=`${this.serviceip}/upload/image_bb/${item.bid}.jpg`;
    this.selectItem = item;
    this.brokedataservice.ksid=item.ksid;
    this.brokedataservice.ksname=item.ksname;
    this.Tmxx.bmc=item.bmc;  
    this.Tmxx.bid=item.bid;  
    this.getPackageMessage(item.hs_tmid);
  }

  // 获得包内容物品
  getPackageMessage(barId) {
    const data = {
      Tmxx: {
        tmid: barId,
        type:'pc'
      },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getPackageMessage(data).subscribe(res => {
      this.materialArray = [];
      if (res&&res['status'] === 'OK') {
        if (res['returnValue'] && res['returnValue']['TmxxList']) {
          this.transformdata=res['returnValue'];
          // console.log(this.transformdata,'this.transformdata');
          const {TmxxList: list} = res['returnValue'];
          let itemList = [];
          for (let i = 0; i < list.length; i++) {
            if (i > 0 && i % 5 === 0) { // 每 5 条 为 一组
              this.materialArray = [...this.materialArray, itemList];
              itemList = [];
            }
            itemList = [...itemList, list[i]];
          }
          if (itemList.length !== 0) {
            this.materialArray = [...this.materialArray, itemList];
            if(this.firsttime){
              setTimeout(()=>{
                let content=this.lossContent.nativeElement.getElementsByClassName('appliance-list')[0];
                let width=this.lossContent.nativeElement.clientWidth-304;
                this.renderer.setStyle(content,'width',`${width}px`);
                this.firsttime=false;
              },20)
           
            }
         
          }
          console.log(this.materialArray);
        }
      } else {
        this.tools.createMessage('warning', res['message']);
      }
    });
  }
// 获取单个盘信息
  getPlateFromPackageList(plateId,qxptmval,num,resolve) {
   
    const data = {
      HsLog: {
        basket_id: plateId + '',
        qxptm:qxptmval+''
      },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    // if(num==0){//已经有盘，改数量，不请求
    //   let temparr=this.plateList.forEach((value,i)=>{
    //     if(value.p_id==itemin.p_id){
    //       thisindex=i;
    //     }
    //     return value.p_id==itemin.p_id;
    //   })
    // }
   this.service.getPlateFromPackage(data).subscribe(res => {
      console.log(res,'res获取清洗盘');
      if (res['status'] === 'OK') {
        

        if(this.plateList.length==0){
          this.plateList.push(res.returnValue);
          console.log(this.plateList,'thispaltelist567');
          if(resolve){
            resolve(null);
          }
          this.bindif(res.returnValue,'pan')
          this.bindstart="pan";
          return;
        }
        let checkindex=-1;
        this.plateList.forEach((item)=>{
          console.log(item,res.returnValue,this.plateList);
            if(item.basket_id==res.returnValue.basket_id){
              checkindex=0;
            }
        })
        if(checkindex!=0){
          this.plateList.push(res.returnValue);
        }
        if(resolve){
          resolve(null);
        }
        this.bindif(res.returnValue,'pan')
        this.bindstart="pan";
      } else {
        this.tools.createMessage('warning', res['message']);
      }
    });
  }

  //选择盘
  selectpan(pack,value,e?){
    if(e){
    e.stopPropagation;
    }
    //console.log(pack,value,e,'important');
    let shutdown=false;
    if(!value){
      return;
    }
    if(pack.panids){//判断当前绑定的清洗盘是否重复
       _.forEach(pack.panids,(item)=>{
             if(value.basket_id==item.basket_id){
              this.tools.createMessage('warning', '此包已绑定该清洗盘');
              shutdown=true;
               return;
             }
       })
    }
    else{
      pack.panids=[];
    }
    if(shutdown){
      return;
    }
    pack.panids=pack.panids.concat(value);
    this.plateList.forEach(item=>{
      // if(item.basket_id==pack.basket_id){
      //   item.bsl--;
      //   pack.basket_id=null;
      //   item.templist=item.templist.filter((value)=>{
      //       return value!=pack;
      //   })
      // }
      if(value&&item.basket_id==value.basket_id){
         item.bsl++;
         item.templist=item.templist?item.templist.concat(pack):[].concat(pack);
         pack.name='';
         _.forEach(pack.panids,(value)=>{
          pack.name+=value.basket_name;
         })
         console.log(pack.panids,'pack.panids');
      }
    })
  
    if(value==null){
      pack.basket_id=null;
      pack.basket_name=null;
      pack.showpan="请选择";
      this.getnumbind();
     
      return;
    }
   
    pack.basket_id=value.basket_id;
    pack.basket_name=value.basket_name;
    pack.showpan=value.basket_name;
    this.getnumbind();
    //把包临时添加到盘
  }

  //扫码或搜索盘
  getsignplate(){

    let goon=this.focus(this.palteid,'QP','palteid');
    if(!goon){
       return;
    }
    // let reg=new RegExp('QP','i');
    // if(reg.test(this.palteid)){
    //   this.palteid=this.palteid.substr(2,this.palteid.length-2);
    // }
    this.getPlateFromPackageList('',this.palteid,null,null);
  }
  //绑定清洗盘
  bindplate(){
    this.isbd=true;

    let list=this.sourcepackagelist();
    
    const data = {
      HsLogList: list,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.bindclean(data).subscribe(res => {
      if(res.status=='OK'){
        this.tools.createMessage('success', '绑定清洗盘成功');
        //刷新列表
        // location.reload();
        this.reload();
        this.clearpan();
        // this.getPackageList(this.today);
      }
      console.log(res,'绑定清洗盘成功');
    })  
  }
  clearpan(){
     this.plateList=[];
     this.cleannum=0;
  }
  //绑定清洗盘整理data
  sourcepackagelist(){
    let list=[];
    console.log(this.packageList,'this.packageList');
    let temppackageList=_.filter(this.packageList,(item)=>{
        return item.panids;
    })
    temppackageList.forEach((item, index) => {
      let qxplist=[];
      _.forEach(item['panids'],value=>{
         let tempvalue=`${value.qxptm}@${value.basket_id}`;
         qxplist.push(tempvalue);
      });
      let string=qxplist.join('!');
      list.push({"tmid":item['hs_tmid'],"bid":item['bid'],'qxplist':string})
    })
    console.log(list,'list');
    return list;
  }
  //获取绑定清洗盘数量
  getnumbind(){
    let num=0;
    console.log(this.packageList,'999');
    this.packageList.forEach((item) => {
      if(item.basket_id&&item.basket_id!=-1){
        num++;
      }
    })
    this.cleannum=num;
  }

  //点击清洗盘
  cardClick(item,tplTitle,tplFooter,tplContent){
       console.log(item);
       this.tempPan=item;
       const data = {
        HsLog: {qxptm:item.qxptm},
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
      this.service.getPanData(data).subscribe(res => {
        if(res.status=='OK'){
            console.log(res,'清洗盘数据');
            this.panlist=[].concat(res.returnValue.QxpDtl);
            if(item.templist&&item.templist.length!=0){
                this.panlist=this.panlist.concat(item.templist);
            }
            console.log(this.panlist);
           
           this.createchangepanModal(tplTitle,tplFooter,tplContent)
 
        }
        else{
            this.tools.createMessage('warning', '清洗盘数据获取失败');
        }
      })  
  }
  //弹出盘信息框
    createchangepanModal(tplTitle:TemplateRef<{}>,tplFooter: TemplateRef<{}>,tplContent: TemplateRef<{}>): void {
        this.changepanmodal = this.modalService.create({
          nzTitle: tplTitle,
          nzOkType: 'primary',
          nzContent: tplContent,
          nzFooter: tplFooter
        });
        this.changepanmodal.nzWidth=480;
      }
  surechangepan(){
    this.changepanmodal.destroy();
  }
  //撤销包
  cancelPackage(item, e){
    const data = {
        HsLog:{"tmid":item.hs_tmid,basket_id:this.tempPan.basket_id},
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
      this.tools.createWarningDialog('是否撤销','',()=>{
        this.service.cancelPackage(data).subscribe(res => {
            if(res.status=='OK'){
                console.log(res,'清洗盘数据');
                this.tools.createMessage('success', '撤销成功');
                this.panlist=this.panlist.filter((value)=>{
                    return value!=item;
                })
                if(this.tempPan.bsl>0){
                    this.tempPan.bsl--;
                }
                this.getPackageList(new Date());
               
            }
            else{
                this.tools.createMessage('warning', '清洗盘数据获取失败');
            }
          })  
      },null);

    
  }
  getcolor(item,val){
    console.log(item,val,'itemval');
  }
 

}
