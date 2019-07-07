import { Component, OnInit, AfterViewInit,TemplateRef, ViewChild, ElementRef } from '@angular/core';
import storage from './../../../../service/storage';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { DatePipe } from "@angular/common";
import { ToolsService } from './../../../../service/tools/tools.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/service/http/http.service';
import { WashService } from 'src/app/service/http/wash.service';
import * as _ from 'lodash';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';


@Component({
  selector: 'app-washcheck',
  templateUrl: './washcheck.component.html',
  styleUrls: ['./washcheck.component.scss']
})
export class WashcheckComponent implements OnInit,AfterViewInit {

  validateForm: FormGroup;
  @ViewChild('tplTitle')
  tplTitleone: ElementRef;
  @ViewChild('tplFooter')
  tplFooterone: ElementRef;
  @ViewChild('tplContent')
  tplContentone: ElementRef;
  @ViewChild('inputsearch')
  Inputsearch:ElementRef;

  public washresult = [];
  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;
  public chosenmachine;
  public resultdata = [];
  public dateFormat = "yyyy-MM-DD";
  private today = new Date();
  public choosetime = new Date();
  private listheader = ['清洗盘名称', '包名称', '包数量'];
  private pan = "default";
  private checkstate;
  //换锅变量


  private tempreture;
  private hightpreture;
  private usetime;

  public surebtn = '确定';
  public readonlyForm = false;
  private forbiden = false;
  public washerslistchange;
  public packageslist = [];
  public Loginform;
  private changepanmodal;
  public packs=[];
  public selectedValue;
  public hickey;
  public hickeys=[];
  public broketype;
  public broketypes=[];
  public borksolve;
  public borksolves=[];
  public modelnumber;
  public showdiv=false;
  showtopul=false;
  packscopy=[];


  constructor(
    private service: HttpService,
    private getwasherservice: WashService,
    private datepipe: DatePipe,
    private toolservice: ToolsService,
    private modalService: NzModalService,
    private fb: FormBuilder
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.Loginform = { deptId: this.deptId, deptName: this.deptName, userId: this.userId, userName: this.userName }

  }
  ngOnInit() {
    this.getwashers();
    this.validateForm = this.fb.group({
      selectedValue  : [ null, [ Validators.required ] ],
      hickey: [ null, [ Validators.required ] ],
      modelnumber: [ null, [ Validators.required ] ],
      broketype: [ null, [ Validators.required ] ],
      borksolve: [ null, [ Validators.required ] ]
    });

    // this.getresults(this.timepipe(this.choosetime));
    // this.getResons();
    // this.getwasherschange();
    // this.getseasons();
  }
  ngAfterViewInit(){
    console.log(this.Inputsearch,'inputsearch');
  }

  //获取清洗机列表
  getwashers() {
    //  this.washerslist=[];
    const data = {
      method: 'getQxzjState',
      service: 'QxService',
      Qxzj: { "start_dt": this.toolservice.timepipe(this.choosetime, 'yyyy-MM-dd') + ' 00:00:00' },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.washresult = res.returnValue.qxzjStateList.slice();
        console.log(res, '清洗机列表数据');
      }
    });
  }

  getlist() {
    this.getwashers();
  }

  choosemachine(item) {
    console.log(item, '当前选定清洗机');


    if (item.result == "1") {
      return;
    } else if (item.result == "0") {
      const data = {
        method: 'getQxzjDtlList',
        service: 'QxService',
        QxzjDtl: { "zjList": [], qxzj_id: item.id },
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
      this.service.getdata(data).subscribe(res => {
        if (res.status == "OK") {
          this.packageslist = [].concat(res.returnValue.qxzjDtlList);
          console.log(res, '点击单个清洗机数据');
        }
      });
    }
    else {
      this.packageslist.length=0;
    }
    if (this.chosenmachine) {
      this.chosenmachine.active = false;
    }
    item.active = true;
    this.chosenmachine = item;
  }
  //日期控制
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  packageidkeyup(e) {
    // this.showtopul=this.validateForm.value.selectedValue==''?false:true;//显示或影藏下拉列表
    if(!this.validateForm.value.selectedValue){
      this.showtopul=true;
      this.packs=this.packscopy;
      return;
    }
     this.packs=_.filter(this.packscopy,(item)=>{
        let reg = new RegExp(`^${this.validateForm.value.selectedValue}`,"i");      
        return reg.test(item.bmc)||reg.test(item.py_code);
     });
     console.log(this.packs,'this.packs');
  
   }
   showul(e){
    e.stopPropagation;
     this.showtopul=true;
   }
   choosepackage(item,e){
    this.validateForm.get('selectedValue').setValue(item.bmc);
    this.packchange();
    this.showtopul=false;
   }
  //获取包列表
  
  packlists(){
    //当前选定清洗机
    console.log(this.chosenmachine,'this.chosenmachine');
   
    const data = {
      method: 'getQxDtlList',
      service: 'QxService',
      Qx:{"d_gc":this.chosenmachine.d_gc,"dev_id":this.chosenmachine.dev_id,"t_gc":this.chosenmachine.t_gc},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        // this.packageslist = [].concat(res.returnValue.qxzjDtlList);
        this.packs=res.returnValue.qxDtlList.slice();
        this.packscopy=res.returnValue.qxDtlList.slice();
        // _.forEach(this.packs,(item)=>{
        //   item.name=item.bmc+item.py_code;
        // })
        console.log(res, '包列表数据数据');
      }
    });
  }
  selectopen(e){
    if(e){
      _.forEach(this.packs,(item)=>{
        item.name=item.bmc+item.py_code;
      })
    }
    else{
      if(!this.validateForm.value.selectedValue){
        return;
      }
      let choseitem=_.find(this.packs,{'bid':this.validateForm.value.selectedValue});
      choseitem.name=choseitem.bmc;
    }
  
  }
  hickeyopen(e){
    if(e){
      _.forEach(this.hickeys,(item)=>{
        console.log(item,'bug');
        item.name=item.clmc+item.py_code;
      })
    }
    else{
      let choseitem=_.find(this.hickeys,{'clid':this.validateForm.value.hickey});
      if(choseitem){
        choseitem.name=choseitem.clmc;
      }
     
    }
  }



  //添加
  add(tplTitle, tplContent, tplFooter) {
    this.showdiv=true;
     this.clearmodel();
     this.packlists();
     this.getborketypes();
     this.getbrokeresole();
     this.createchangepanModal(tplTitle, tplContent, tplFooter);
     console.log(this.Inputsearch,'inputsearch');
     this.validateForm = this.fb.group({
      selectedValue  : [ null, [ Validators.required ] ],
      hickey: [ null, [ Validators.required ] ],
      modelnumber: [ null, [ Validators.required ] ],
      broketype: [ null, [ Validators.required ] ],
      borksolve: [ null, [ Validators.required ] ]
    });
    // let tempwashers = this.washerslistchange;

    //  this.freewashers=tempwashers.filter((item)=>{
    //       return (this.chosenmachine.dev_id!=item.dev_id)&&(item.state=="2"||item.state=="0"||item.state=="1");
    //   })
    //   this.freewashers=[].concat(this.freewashers);
    //   console.log(this.chosenmachine,this.freewashers);

  }
  
  packchange(){
    this.validateForm.get('hickey').setValue(null);
    if(!this.validateForm.value.selectedValue){
      return;
    }
   
   let choseitem=_.find(this.packs,{'bmc':this.validateForm.value.selectedValue});

    
    const data = {
      method: 'getCl',
      service: 'ClService',
      Cl:{bid:choseitem.bid,clList:[],is_inv:"1"},
      PageReq:{},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.hickeys=res.returnValue.rows.slice();
        if(!this.hickeys.length){
          return;
        }
        _.forEach(this.hickeys,(item)=>{
          item.name=item.clmc+item.py_code;
        })
        console.log(res, '器械数据');
      }
    });
    //过滤损耗类别
    if(choseitem.blb=='qj'){
       this.broketypes=_.filter(this.broketypes,(item)=>{
         return item.aaa102.length==3;
       })
    }
    else{
      this.broketypes=_.filter(this.broketypes,(item)=>{
        return item.aaa102.length==1;
      })
    }
    
  }
  hickeychange(){
    if(!this.validateForm.value.hickey){
      return;
    }
    // let chosehickey=_.find(this.hickeys,{'clid':this.validateForm.value.hickey});
    // setTimeout(()=>{chosehickey.name=chosehickey.clmc;},20);
   
  }
  getborketypes(){
    if(this.broketypes.length){
      return;
    }
    const data = {
      method: 'getAa10ListForMobile',
      service: 'ParamService',
      AA10:{"aaa100":"NG_REA"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.broketypes=res.returnValue.AA10List.slice();
        console.log(res, '损耗类型数据');
      }
    });
  }
  getbrokeresole(){
    if(this.borksolves.length){
       return;
    }
    const data = {
      method: 'getAa10ListForMobile',
      service: 'ParamService',
      "AA10":{"aaa100":"PROC_WAY"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.borksolves=res.returnValue.AA10List.slice();
        console.log(res, '损耗处理数据');
      }
    });
  }
  //创建换锅弹窗
  createchangepanModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.changepanmodal = this.modalService.create({
      nzTitle: tplTitle,
      nzOkType: 'primary',
      nzContent: tplContent,
      nzFooter: tplFooter
    });
    this.changepanmodal.nzWidth = 490;
  }
  sureaddmessage(){
     let chosepack=_.find(this.packs,{'bmc':this.validateForm.value.selectedValue});
     let chosehickey=_.find(this.hickeys,{'clid':this.validateForm.value.hickey});
     let chosebroketype=_.find(this.broketypes,{'aaa102':this.validateForm.value.broketype});
     let choseborksolve=_.find(this.borksolves,{'aaa102':this.validateForm.value.borksolve});
     let choseborksolvee=this.validateForm.value.modelnumber;
     console.log(chosepack,chosehickey,chosebroketype,choseborksolve,'测试');
     if(!chosepack||!chosebroketype||!choseborksolve||!choseborksolvee){
       this.toolservice.createMessage('warning','有必填项未选择');
       return;
     }
     if(this.validateForm.value.modelnumber<=0&&chosehickey){
      this.toolservice.createMessage('warning',`数量必须大于0`);
      return;
     }
     if(!chosehickey&&this.validateForm.value.modelnumber>chosepack.b_num){
      this.toolservice.createMessage('warning',`数量不能超过${chosepack.b_num}`);
      return;
     }
     let tempobj={};
     if(chosehickey){
     tempobj={bid:chosepack.bid,bmc:chosepack.bmc,clid:chosehickey.clid,clmc:chosehickey.clmc,
      id:'',is_inv:'1',ng_rea:chosebroketype.aaa102,ng_rea_name:chosebroketype.aaa103,num:this.validateForm.value.modelnumber,proc_way:choseborksolve.aaa102,proc_way_name:choseborksolve.aaa103,qxzj_id:''};
    }else{
      tempobj={bid:chosepack.bid,bmc:chosepack.bmc,
        id:'',is_inv:'1',ng_rea:chosebroketype.aaa102,ng_rea_name:chosebroketype.aaa103,num:this.validateForm.value.modelnumber,proc_way:choseborksolve.aaa102,proc_way_name:choseborksolve.aaa103,qxzj_id:''};
     
    }
      this.packageslist=this.packageslist.concat(tempobj);
     this.changepanmodal.destroy();
     this.showdiv=false;
    
     console.log(this.validateForm.value.selectedValue,chosepack,chosehickey,chosebroketype,choseborksolve,this.packageslist,'all value');
  }
  //清空model
  clearmodel(){
    this.validateForm=null;
    // this.validateForm.get('selectedValue').setValue(null);
    // this.validateForm.get('hickey').setValue(null);
    // this.validateForm.get('broketype').setValue(null);
    // this.validateForm.get('borksolve').setValue(null);
    // this.validateForm.get('modelnumber').setValue(null);
  }
  //保存
  store(){
    console.log(this.chosenmachine,this.packageslist,'当前选定清洗机');
    this.chosenmachine['cre_uid']=this.userId;
    const data = {
      method: 'doQxzj',
      service: 'QxService',
      Qxzj:this.chosenmachine,
      QxzjDtl:{
        zjList:this.packageslist},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.toolservice.createMessage('success','保存成功');
        this.chosenmachine=null;
        this.getwashers();
        console.log(res, '保存接口数据');
      }
      else{
        this.toolservice.createMessage('warning',res.message+'保存失败');
      }
    });
   
  }







}
