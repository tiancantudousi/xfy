import { Component, OnInit ,TemplateRef,ViewChild,ElementRef} from '@angular/core';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ToolsService } from '../../../../service/tools/tools.service';

import storage from '../../../../service/storage';


import { EmitService } from '../../../../service/middleman.service';

import { BrokedataService } from './../../../../service/state/wastage.service'

import { LosscordComponent } from './../../../../pages/torecover/component/losscord/losscord.component';

import { Router }  from '@angular/router';


import {DatePipe} from "@angular/common";
import { RecoveryService } from '../../../../service/http/recovery.service';
import { PrintMakeService } from 'src/app/service/http/printmake.service';
import { PublicuseService } from 'src/app/service/http/publicuse.service';

import { Route,ActivatedRoute,Params} from '@angular/router';


@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.scss']
})
export class MakeComponent implements OnInit {
    @ViewChild('packageinput')
    Packageinput:ElementRef;

  private makeState="make";

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
  public afterPerson: string; // 交接人
  public selectItem = {}; // 选择selectItem
  public material: number;
  public materialArray = [];
  public showpan=[];
  public cleannum:number=0;
  public personid;

  public packageCode;
  constructor(
    public service: RecoveryService,
    public tools: ToolsService,
    public datepipe: DatePipe,
    public emitservice:EmitService,
    public modalService:NzModalService,
    public brokedataservice:BrokedataService,
    public router:Router,
    public printmakeservice:PrintMakeService,
    public publicservice:PublicuseService,
    private routerinfo:ActivatedRoute
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.prePerson = this.userName;
    this.personid=this.userId;
  }


  ngOnInit() {
    // this.getPlateFromPackageList(1);
    let nowday=this.datepipe.transform(this.today,'yyyy-MM-dd');
    let postday;
    postday={"end_dt_hs":`${nowday} 23:59:59`,"isChecked":false,"start_dt_hs":`${nowday} 00:00:00`};
    // this.getPackageList(postday);
    this.emitservice.eventEmit.subscribe((value)=>{
      this.recovercount=value;
    });
    this.routerinfo.params.subscribe((params:Params)=>{
          this.clearState();
          this.makeState=params.id=='0'?'directConfect':'make';
            console.log(params);
    })
    this.Packageinput.nativeElement.focus();
     


 
  }
  //清空所有状态
  clearState(){
    this.packageList=[];
    this.prePerson = this.userName;
    this.personid=this.userId;
    this.afterPerson='';
  }


    // 人员 回车 查询
    personKeyUp(e) {
      this.personid=this.prePerson;
      if (e.keyCode === 13) {
        const data = {
          Userinfo: {
            us_userid:this.prePerson
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
              console.log('res',res);
              const {us_username: name} = res['returnValue']['Userinfo'];
              this.prePerson = name;
            } else {
              this.prePerson = '';
            }
          } else {
            this.tools.createMessage('warning', res['message']);
          }
        });
      }
    }
    //  // 点击加急
  clickEmergent(item, e) {
    console.log(item);
    e.stopPropagation();
    const content = item.isjj === '1' ? '是否取消加急' : '是否加急';
    this.tools.createWarningDialog(content, '', () => {
      const data = {
        Tmxx: {
          isjj: item.isjj === '1' ? '0' : '1',
          tmid: item.tmid
        },
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
      this.service.setPackageIsUrgent(data).subscribe(res => {
        console.log(res,'加急接口');
        if (res['status'] === 'OK') {
          // this.getPackageList(new Date());
          this.tools.createMessage('success', item.isjj === '1' ? '取消加急成功' : '加急成功');
          item.isjj = item.isjj === '1' ? '0' : '1';
          
        }
      });
    },null);
  }
  //打包  
  buildpackage(e){
    if (e.keyCode != 13){
      return;
    }
    let afterPersoncopy;
    const data = {
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    let tempservice;
    if(this.makeState=='make'){
        let thisreg=new RegExp('^(TM|tm)');
        if(thisreg.test(this.afterPerson)){
          this.afterPerson=this.afterPerson.slice(2,this.afterPerson.length);
        }
        afterPersoncopy=this.afterPerson.slice();
      Object.assign(data,{},{ DbLog:{opt_uid:this.personid,opt_uname:this.prePerson,tmid:afterPersoncopy}});
      tempservice=this.printmakeservice.buildPackage(data);
    }else if(this.makeState=='directConfect'){
      let thisreg=new RegExp('^(TM|tm)');
      if(thisreg.test(this.afterPerson)){
        this.afterPerson=this.afterPerson.slice(2,this.afterPerson.length);
      }
      afterPersoncopy=this.afterPerson.slice();
      Object.assign(data,{},{ PbLog:{opt_uid:this.personid,opt_uname:this.prePerson,tmid:afterPersoncopy}})
       tempservice=this.printmakeservice.directConfect(data);
    }else{
      afterPersoncopy=this.afterPerson.slice();
      Object.assign(data,{},{ PbLog:{opt_uid:this.personid,opt_uname:this.prePerson,tmid:afterPersoncopy}})
       tempservice=this.printmakeservice.directConfect(data);
    }
    this.afterPerson='';
    console.log(data,'tmid none');
    tempservice.subscribe(res => { 
      if (res['status'] === 'OK') {
        console.log(res,'打包数据');
     
        this.packageList=this.packageList.concat(res.returnValue.tmxxList);
        this.tools.createMessage('success', '打包成功');
      } else {
        console.log(res,'error');
        if(res.status=='error'){
          this.tools.createMessage('warning', res['message']);
        }
        else{     
          this.tools.createWarningDialog(res['message'],'', ()=>{
            this.canclePackage(afterPersoncopy);
          }, null);
        }
       
      }
   
    });
  }

  cancle(value,e){
    e.stopPropagation;
    let state=this.tools.createWarningDialog('是否撤销','',()=>{this.canclePackage(value),null});
  }
  //撤销打包接口
  canclePackage(value){
   this.materialArray=[];
    const data = {
    
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    let tempservice;
    if(this.makeState=='make'){
      Object.assign(data,{},{DbLog:{tmid:value}});
      tempservice=this.printmakeservice.canclePackage(data);

    }
    else{
      Object.assign(data,{},{ PbLog:{tmid:value}})
       tempservice=this.printmakeservice.cancleDirectPackage(data);
    }
    
    tempservice.subscribe(res => {
        this.afterPerson='';
      if (res['status'] === 'OK') {
        this.deleteitem(value);
        this.tools.createMessage('success', '撤销成功');
       
      } else {
        
        this.tools.createMessage('warning', res['message']);
      }
    });
  }
  //撤销完成删除item
  deleteitem(tmid){
    if(this.packageList.length==0){
      return;
    }
    let temp=this.publicservice.checkbid(this.packageList,'tmid',tmid);
    this.packageList.splice(temp.index,1);
  }

    //点击包时
  selectPackage (item) {
    console.log(item);
    this.selectItem = item;
    this.getPackageMessage(item.tmid);
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
      console.log(res,'报信息');
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
          }
          console.log(this.materialArray);
        }
      } else {
        this.tools.createMessage('warning', res['message']);
      }
    });
  }







}
