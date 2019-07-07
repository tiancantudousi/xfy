import { Component, OnInit ,TemplateRef,Output,EventEmitter,ElementRef,ViewChild,AfterViewInit} from '@angular/core';
import storage from './../../../../service/storage';
import {ToolsService} from './../../../../service/tools/tools.service'
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import {DatePipe} from "@angular/common";
import { PublicuseService} from './../../../../service/http/publicuse.service';
import { EmitService} from './../../../../service/middleman.service';
import { HttpService } from 'src/app/service/http/http.service';
import * as _ from 'lodash';
import { RecoveryService } from '../../../../service/http/recovery.service';
import { BrokedataService } from 'src/app/service/state/wastage.service';


@Component({
  selector: 'app-apply-content',
  templateUrl: './apply-content.component.html',
  styleUrls: ['./apply-content.component.scss']
})
export class ApplyContentComponent implements OnInit,AfterViewInit {
     @ViewChild('itemthis')
     Childen:ElementRef;
     @ViewChild('packageinput')
     packageinput:ElementRef;
     @ViewChild('ffrinput')
     Ffrinput:ElementRef;
     @ViewChild('btminput')
     Btminput:ElementRef;
    public deletespan=true;
    public userName: string;
    public userId: string;
    public deptId: string;
    public deptName: string;
    private Loginform;
    // public kslist=[];
    public kslist=[];
    private kslistcopy=[];
    private activeks;
    public packageid;
    public packageList=[];

    ksname;
    public afterPerson;
    public afterPersonuid;
    public ffr;
  constructor(

    private service:HttpService,
    private toolservice:ToolsService,
    private elementRef:ElementRef,
    public Reservice: RecoveryService,
    public emitservice:EmitService,
    public state:BrokedataService
  ) { 
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.Loginform= {deptId: this.deptId,deptName: this.deptName,userId: this.userId,userName: this.userName}

  }

  ngOnInit() {
    this.afterPerson=this.state.dbperson?this.state.dbperson['us_username']:'';
    this.afterPersonuid=this.state.dbperson?this.state.dbperson['us_userid']:''; 
     
    console.log(this.afterPerson,'this.afterperson');
    // this.emitservice.ffr.subscribe((value)=>{
    //   this.ffr=value;
    //   this.afterPerson=this.ffr['ffrname'];
    //   this.afterPersonuid=this.ffr['ffrid'];
    // });
    this.getKsList();
  }
  getKsList(){
    const data = {
        service:'SlService',
        method:'getSlKsHzInfo',
        Sl:{"end_dt":this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+' 23:59:59',"isChecked":false,"slDtlList":[],"start_dt":this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+" 00:00:00"},
        LoginForm:this.Loginform
      };
      this.service.getdata(data).subscribe(res => {
        if(res.status=="OK"){
        //   res.returnValue.mjjStateList.forEach(item => {
        //     item.active=false;
        //   });
        //   this.washerslist=[...res.returnValue.mjjStateList];
          this.kslistcopy=[].concat(res.returnValue.slKsHzList);
          this.kslist=[].concat(res.returnValue.slKsHzList);
          
     
        //   this.getsingle(0);
        }
        else{
          this.toolservice.createMessage('warning',res.message+'科室列表获取失败');
        }
      });
  }
  ngAfterViewInit(){
      console.log(this.Childen,'2234');
      console.log(this.elementRef.nativeElement.querySelectorAll('host'));
      this.Btminput.nativeElement.focus();
    //   let father=this.elementRef.nativeElement.querySelector('host');
    //   let father=document.getElementById('father')
    //   let nodes=document.querySelectorAll('.host');
        // let father=this.Childen.nativeElement;
    //     let nodes=father.querySelectorAll('.ant-spin-nested-loading');
    //    console.log(nodes,father,'nodes');
      
  }
  kskeyup(e){
    if(e.keyCode === 13 && this.ksname.trim()){

      let goon=this.focus(this.ksname,'SS','ksname');
      if(!goon){
         return;
      }  
    }


      let reg=new RegExp(`^${this.ksname}`)
      this.kslist=_.filter(this.kslistcopy,(item)=>{
        return reg.test(item.dname)||reg.test(item.dname);
      })
  }
  dothis(item,e){
      if(item==this.kslist[0]){
        e.click();
        console.log(e);
        this.dothis=null;
        this.deletespan=false;
      }
     console.log(item,e,'item,e');
  }
  getsingle(value){
   console.log(value,'当前选定科室');
      this.activeks=value;
    const data = {
        service:'FfService',
        method:'getFfinfo',
        SlDtl:{"deptname":value.dname,"did":value.did,"end_dt":this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+' 23:59:59',"ffList":[],"hb_num":0,"jb_num":0,"jsb_num":0,"start_dt":this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+" 00:00:00"},
        LoginForm:this.Loginform
      };
      this.service.getdata(data).subscribe(res => {
        if(res.status=="OK"){
            this.packageList=[].concat(res.returnValue.FfList)
        //   res.returnValue.mjjStateList.forEach(item => {
        //     item.active=false;
        //   });
        //   this.washerslist=[...res.returnValue.mjjStateList];

          console.log(res,'单个科室信息');
        }
        else{
          this.toolservice.createMessage('warning',res.message+'单个发放获取失败');
        }
      });
  }
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

  applyenter(packageid){
    const data = {
        service:'FfService',
        method:'doSlFf',
        FfLog:{"end_dt":this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+' 23:59:59',
        "start_dt":this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+" 00:00:00",
        "dept_did":this.activeks.did,"dept_dname":this.activeks.dname,
        "tmid":packageid,"opt_uid":this.afterPersonuid,"opt_uname":this.afterPerson},
        LoginForm:this.Loginform
      }; 
      this.service.getdata(data).subscribe(res => {
        this.packageid='';
        if(res.status=="OK"){
            this.toolservice.createMessage('success','发放成功');
        //   res.returnValue.mjjStateList.forEach(item => {
        //     item.active=false;
        //   });
        //   this.washerslist=[...res.returnValue.mjjStateList];
       
        this.getsingle(this.activeks);

          console.log(res,'发放成功');
        }
        else{
            if(res.status==='warn'){
                 this.toolservice.createWarningDialog(res.message,'',()=>{
                    this.applycansle(packageid);
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
            this.getsingle(this.activeks);
          console.log(res,'撤销');
        }
        else{
          this.toolservice.createMessage('warning',res.message+'撤销失败');
        }
      });
  }


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
      this.Btminput.nativeElement.focus();
      this.packageid=element.substring(index+2,element.length);
      let e={keyCode:13};
      if(skip!='TM'){
        this.packageKeyup(e);
        return false;
      }
    }
  
    return true;
  }

// 人员 回车 查询
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
          this.state.dbperson=res['returnValue']['Userinfo']; 
          this.afterPerson = name;
          this.afterPersonuid = uid;
          // this.emitservice.ffr.emit({'ffrname':name,'ffrid':uid})
          // console.log(name,'12312312312313')
          // console.log(uid,'12312312312313')

        } else {
          this.afterPerson = '';
          this.afterPersonuid = '';
          // this.emitservice.hsr.emit({'ffrname':'','ffrid':''})
        }
      } else {
        this.toolservice.createMessage('warning', res['message']);
      }
    });
  }
}

















}
