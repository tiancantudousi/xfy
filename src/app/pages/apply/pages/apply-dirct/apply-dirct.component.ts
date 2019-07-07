import { Component, OnInit ,TemplateRef,Output,EventEmitter,ViewChild,ElementRef} from '@angular/core';
import storage from './../../../../service/storage';
import {ToolsService} from './../../../../service/tools/tools.service'
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import {DatePipe} from "@angular/common";
import { PublicuseService} from './../../../../service/http/publicuse.service';
import { EmitService} from './../../../../service/middleman.service';
import { HttpService } from 'src/app/service/http/http.service';
import { LoginService } from 'src/app/service/http/login.service';
import * as _ from 'lodash'
import { RecoveryService } from '../../../../service/http/recovery.service';
import { BrokedataService } from 'src/app/service/state/wastage.service';



@Component({
  selector: 'app-apply-dirct',
  templateUrl: './apply-dirct.component.html',
  styleUrls: ['./apply-dirct.component.scss']
})
export class ApplyDirctComponent implements OnInit {
    // @ViewChild('packageinput')
    // Packageinput:ElementRef
    @ViewChild('ffrinput')
    Ffrinput:ElementRef;
    @ViewChild('btminput')
    Btminput:ElementRef;
    public userName: string;
    public userId: string;
    public deptId: string;
    public deptName: string;
    private Loginform;
    // public promptarr;
    // public palcevalue;
    public promptlist=[];
    public signshow;
    public showpalcesign;
    public chosenks;
    public packageid;
    public showkslist=false;
    public packageList=[];
    packList=[];
    placement = 'bottomRight';
    sizeselect='default';
    public afterPerson;
    public afterPersonuid;
    public ffr;
  constructor(
    private service:HttpService,
    private toolservice:ToolsService,
    private loginservice:LoginService,
    private Reservice: RecoveryService,
    private emitservice:EmitService,
    private state:BrokedataService
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.Loginform= {deptId: this.deptId,deptName: this.deptName,userId: this.userId,userName: this.userName};
    // this.promptarr=storage.get('promptarr');
   }

  ngOnInit() {
      // if(!this.promptarr){
      //     this.promptarr=this.getPromptarr();
      // }
      // this.Packageinput.nativeElement.focus();
      this.afterPerson=this.state.dbperson?this.state.dbperson['us_username']:'';
      this.afterPersonuid=this.state.dbperson?this.state.dbperson['us_userid']:''; 
      // this.emitservice.ffr.subscribe((value)=>{
      //   this.ffr=value;
        
      //   this.afterPerson=this.ffr['ffrname'];
      //   this.afterPersonuid=this.ffr['ffrid'];
      //   console.log(value,'1231231231231')
      //   console.log(this.afterPerson,'1231231231231')
      //   console.log(this.afterPersonuid,'1231231231231')
      // });
  }
  ngAfterViewInit(){
    //console.log(this.Childen,'2234');
    //console.log(this.elementRef.nativeElement.querySelectorAll('host'));
    this.Btminput.nativeElement.focus();
  //   let father=this.elementRef.nativeElement.querySelector('host');
  //   let father=document.getElementById('father')
  //   let nodes=document.querySelectorAll('.host');
      // let father=this.Childen.nativeElement;
  //     let nodes=father.querySelectorAll('.ant-spin-nested-loading');
  //    console.log(nodes,father,'nodes');
    
}


focus(element,skip,input){

  let zg=new RegExp('ZG','i');
  let qp=new RegExp('QP','i');
  let tm=new RegExp('TM','i');
  let lk=new RegExp('LK','i');
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
    this.Btminput.nativeElement.focus();
    this.packageid=element.substring(index+2,element.length);
    let e={keyCode:13};
    if(skip!='TM'){
      this.packageKeyup(e);
      return false;
    }
  }
  if(lk.test(element)){
    console.log(element);
    let index=element.indexOf('TM');
    let oldinput=element.slice(0,index);
    this[input]=oldinput.length>0?oldinput:'';
    this.Btminput.nativeElement.focus();
    this.packageid=element.substring(index,element.length);
    let e={keyCode:13};
    if(skip!='TM'){
      this.packageKeyup(e);
      return false;
    }
  }

  return true;
}
  onChosePack(e){ 
    this.chosenks=e;
    // this.palcevalue=e.deptid;
    console.log(e,'当前选定科室');
    this.getDirctList(e);
  }
  personKeyUp(e) {
    const personId =this.afterPerson;
    if (e.keyCode === 13 && personId) {

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
            this.afterPersonuid=uid;
            this.state.dbperson=res['returnValue']['Userinfo'];
            // this.afterPersonuid = uid;
            // this.emitservice.ffr.emit({'ffrname':name,'ffrid':uid})
          } else {
            this.afterPerson = '';
            // this.afterPersonuid = '';
            // this.emitservice.hsr.emit({'ffrname':'','ffrid':''})
          }
        } else {
          this.toolservice.createMessage('warning', res['message']);
        }
      });
    }
  }

  getDirctList(value){
    console.log()
    const data = {
        service:'FfService',
        method:'getZjFfinfo',
        Tmxx:{"bnrList":[],"isChecked":false,"jsList":[],"zjFfList":[],"ff_did":value.deptid},"PageReq":{},
        LoginForm:this.Loginform
      };
      this.packList=[];
      this.service.getdata(data).subscribe(res => {
        this.Btminput.nativeElement.focus();
        if(res.status=="OK"){
          this.packageList=[].concat(res.returnValue.rows);
           //构建包列表
           let packnames=_.map(this.packageList,(item)=>{
               return item.bmc;
           })
           packnames=_.uniq(packnames);//去重
           _.forEach(packnames,(item)=>{
              let itemlist=_.filter(this.packageList,(val)=>{
                    return val.bmc==item;
              });
              this.packList=this.packList.concat({bmc:item,list:itemlist,show:false});
           })
          console.log(res,this.packList,'发放查询列表结果');
        }
        else{
          this.toolservice.createMessage('warning',res.message+'列表获取失败');
        }
      });
  }

  // onKey(palcevalue,e){
  //   //隐藏提示
  //   if(!this.promptarr){
  //     alert('数据异常');
  //     return;
  //   }
  //   let listarr=this.promptarr.filter((item)=>{
  //     let reg = new RegExp(`^${palcevalue}`,"i");
  //     return reg.test(item.de_alph)||reg.test(item.de_deptname);
  //   });
  //   this.promptlist=[].concat(listarr);
  //   if(this.promptlist.length>0){
  //     this.showkslist=true;
  //   }
  //   else{
  //     this.showkslist=false;
     
  //   }    
  // }
  //获取所有科室请求
  getPromptarr(){
    let params={"req":{"args":{"Department":{},"LoginForm":{}},"method":"getDepartmentList","service":"DepartmentService"},"sign":"DA944624C718CAA806A5E5555D78ED9B","sysid":"web","timestamp":"2018-09-05 13:34:45"}
    this.loginservice.getHouse(params).subscribe((res)=>{
      return res.returnValue.DepartmentList;
    })
  }
  //点击选定的科室

    // signchoose(item){
    //     console.log(item);
    //     this.palcevalue=item.de_deptname;
    //     this.chosenks=item;
    //     this.showkslist=false;
    //     this.getDirctList(item);
    // }

    //输入条码enter时
    packageKeyup(e){
        if(e.keyCode === 13 && this.packageid.trim()){


          let goon=this.focus(this.packageid,'TM','packageid');
          if(!goon){
             return;
          }  


            let thisreg=new RegExp('^(TM|tm)');
            if(thisreg.test(this.packageid)){
              this.packageid=this.packageid.slice(2,this.packageid.length);
            }
            this.applyenter(this.packageid);
         }
    }
    applyenter(value){
        console.log(this.chosenks,'this.chosenks');
        if(!this.chosenks){
            this.toolservice.createMessage('warning','请选择科室');
            return;
        }
        const data = {
            service:'FfService',
            method:'doZjFf',
            FfLog:{"dept_did":this.chosenks.deptid,"tmid":value,"opt_uid":this.afterPersonuid,"opt_uname":this.afterPerson},
            LoginForm:this.Loginform
          };
          this.service.getdata(data).subscribe(res => {
            this.packageid='';
            if(res.status=="OK"){
                this.toolservice.createMessage('success','发放成功');
                this.getDirctList(this.chosenks);
                
              console.log(res,'发放成功');
            }
            else{
                if(res.status==='warn'){
                     this.toolservice.createWarningDialog(res.message,'',()=>{
                        this.applycansle(value);
                     },null);
                }
                else{
                    this.toolservice.createMessage('warning',res.message+'发放失败');
                }
              
            }
          });
    }

      //撤销接口
  applycansle(tmid){
    const data = {
        service:'FfService',
        method:'revFf',
        FfLog:{"tmid":tmid},
        LoginForm:this.Loginform
      };
      this.service.getdata(data).subscribe(res => {
        if(res.status=="OK"){
            this.toolservice.createMessage('success','撤销成功');
            this.getDirctList(this.chosenks);
            this.packageid='';
          console.log(res,'撤销');
        }
        else{
          this.toolservice.createMessage('warning',res.message+'撤销失败');
        }
      });
  }
  // hideul(e){
  //   e.stopPropagation();
  //     if(this.showkslist){
  //       this.showkslist=false;
  //     }
  // }

  toggle(item,e){
       item.show=!item.show;
  }
  



}
