import { Component, OnInit,Renderer2,TemplateRef,ViewChild,ElementRef} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import storage from './../../service/storage'
import {BrokedataService} from './../../service/state/wastage.service'
import { EmitService } from 'src/app/service/middleman.service';
import * as _ from 'lodash';
import { PublicuseService } from 'src/app/service/http/publicuse.service';
import { HttpService } from 'src/app/service/http/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ToolsService } from '../../service/tools/tools.service';
import { NzModalService } from 'ng-zorro-antd';
import { LosscordComponent } from './component/losscord/losscord.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-torecover',
  templateUrl: './torecover.component.html',
  styleUrls: ['./torecover.component.scss']
})
export class TorecoverComponent implements OnInit {
    // @ViewChild('packageinput') input;
    public signshow:boolean=false;
    @ViewChild('losscontent')
    lossContent:ElementRef;
    @ViewChild('audioID')
    audioid:ElementRef
    
    @ViewChild('ksinput')
    ksinput:ElementRef
    public  sign;
    public promptarr;
    private table;
    public palcevalue;

    public de_deptid;
    public modal2;
    public tempdata;
    public ksvalue="";
    public ksid ="";
    public promptlist=[];
    private tempName;
    public indeterminate=false;
    public allChecked=false;
    public packname;
    public packs=[];
    public packscopy=[];
    public materialArray = [];
    public selectItem = {}; // 选择selectItem
    // showlist:boolean=false;
    checktype:string="�����";
    validateForm: FormGroup;
    public transformdata;
    public bodydata=[];
    private resetobj;
    private timer;
    public activeImg;
    private serviceip;
    showtopul=false;
    userName;
    userId;
    deptId;
    deptName;
    private todayrecovery :number=0;
    private count:number=0;
    searchChange$=new BehaviorSubject('');;
    public recovercount:number=0;//损耗登记数量
    public Tmxx={
      bmc:'',
      bid:'',
    };
  firsttime=true;
  firsttime1=true;
    constructor(    private datepipe:DatePipe,private emitserivce:EmitService,public modalService:NzModalService,public emitservice:EmitService,public tools: ToolsService,private publicservice:PublicuseService,private fb: FormBuilder,private brokedataservice:BrokedataService,private middleman:EmitService,private publiceservice:PublicuseService,private renderer:Renderer2, private service: HttpService) { 
      const message = storage.get('userMessage');
      this.userName = message['userName'];
      this.userId = message['userId'];
      this.deptId = message['deptId'];
      this.deptName = message['deptName'];
      this.bodydata=this.brokedataservice.toberecoverdata; 
      this.tempdata=this.bodydata.slice();
      this.promptarr=storage.get('promptarr');
      _.forEach(this.tempdata,(item)=>{
        item.checked=false;
      })
    }
  
    ngOnInit():void {
       //this.ksinput.nativeElement.focus();
      this.validateForm = this.fb.group({
        place:null 
      });
      let observer=new Observable((observer)=>{this.publicservice.getServiceIp(observer);}).subscribe((value)=>{
        this.serviceip=value;
    });
    this.emitservice.eventEmit.subscribe((value)=>{
      this.recovercount=value;
    });
      this.middleman.eventEmittable.emit(this.tempdata);
      this.emitserivce.eventEmittable.subscribe((res)=>{
        this.table=res;
        console.log(res,'tablessss');
      })
      this.getoberecovery()
      this.emitserivce.recoverysuccess.emit();
    }
    play(text){
      var ttsDiv = document.getElementById('bdtts_div_id');
      var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
      var sss = `<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=${text}" type="audio/mpeg">`;
      var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
      var au2 = '</audio>';
      ttsDiv.innerHTML = au1 + sss + eee + au2;
    }
    onChosePack(e){
      console.log(e,'选择结果');
      if(!e){
        this.tempdata=this.bodydata.slice();
        return;
      }
      // this.tempdata=_.filter(this.bodydata,(item)=>{
      //     return e.bid==item.bid;
      // })
      this.tempdata=this.bodydata.filter((item)=>{
        // return item.ff_did==this.de_deptid; 
        return item.bmc==e.bmc;  
      })
      console.log(this.tempdata,this.bodydata);
    }
    gethouse1(e){
      if(e.keyCode === 13 && this.ksvalue.trim()){
        let ks=new RegExp('^(KS|ks)');
      if(ks.test(this.ksvalue)){
        this.ksvalue=this.ksvalue.slice(2,this.ksvalue.length);
        this.gethouse(this.ksvalue);
        return 
      }
     }
    }
    gethouse(value){

      let data={"Department":{de_deptid:value},"LoginForm":{}}
      this.service.getksbyid(data).subscribe((res)=>{
        if(!res.returnValue&&!res.returnValue.DepartmentList){
          this.play('科室数据失败');
          this.tools.createMessage('warning','科室数据失败');
          return;
        }
        if(res.returnValue.DepartmentList.length!=0){
          this.ksvalue=res.returnValue.DepartmentList[0].de_deptname;
          this.ksid=res.returnValue.DepartmentList[0].de_deptid;
          this.onChoseKs(this.ksvalue);
        } else{
          this.play('科室数据失败');
          this.tools.createMessage('warning','科室数据失败');
          return;
        }
  
      })
    }

    onChoseKs(e){
      console.log(e,'ks');
      if(!e){
        this.tempdata=[].concat(this.bodydata);
        return;
    }
      this.tempdata=this.bodydata.filter((item)=>{
        // return item.ff_did==this.de_deptid; 
      return item.deptname==e.deptname;       
    })
   
    this.middleman.eventEmittempcount.emit(this.tempdata.length);
    this.signshow=false;
    }
    playOrPauseAction () {
       
      var tempAudio = this.audioid.nativeElement;
      if (tempAudio.paused) {
          tempAudio.play();
      } else {
          tempAudio.pause();
      }
    }
    getparmas(val){
      return {
        method: 'getComboGrid',
        service: 'PopupService',
        Popup:{"type":"COMBOGRID_BPZ_ks"},
        "PageReq":{page:"1",rows:"10",q:val},
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
    }

    ngAfterViewInit(){

    }
    hickeyopen(e){
      let reg = new RegExp(`${this.packname}`,"i");      
      this.packs=_.filter(this.packscopy,(item)=>{
       
        return reg.test(item.bmc)||reg.test(item.py_code);
      })
      console.log(this,this.packs,this.packname,'this.packs');
    }

    onKey(){
      let listarr=this.promptarr.filter((item)=>{
        let reg = new RegExp(`^${this.validateForm.value.place}`,"i");
        return reg.test(item.de_alph);
      });
      this.promptlist=[...listarr];
      if(this.promptlist.length>0){
        this.signshow=true;
      }
      else{
        this.signshow=false;
        // this.sign=null;
        this.de_deptid='';
      }    
    }

  inputclick($event?:Event){
    this.tempdata=this.bodydata.filter((item)=>{
        // return item.ff_did==this.de_deptid; 
      return item.deptname==this.palcevalue;      
    })
    if(!this.palcevalue){
        this.tempdata=[].concat(this.bodydata);
    }
    this.middleman.eventEmittempcount.emit(this.tempdata.length);
    this.signshow=false;

    if($event){$event.stopPropagation();}
  }



  signchoose(item){
    this.palcevalue=item.de_deptname;
    this.de_deptid=item.de_deptid;
    this.signshow=false;
    this.inputclick();
  }

  mountdetail(value){
    this.checktype=value;
    console.log(value);
  }

  // 获得包内容物品
  getPackageMessage(barId) {
    const data = {
      Bpzgl: {
        bid: barId
      },
      PageReq:{},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getPackageMessagebybid(data).subscribe(res => {
      this.materialArray = []; 
      if (res&&res['status'] === 'OK') {
        if (res['returnValue'] && res['returnValue']['rows']) {
          this.transformdata=res['returnValue'];
          console.log(this.transformdata,'this.transformdata');
          const {rows: list} = res['returnValue'];
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
        this.play(res['message']);
        this.tools.createMessage('warning', res['message']);
      }
    });
  }
  

  testvalue(value){
    let reg=/^[A-Z]$/;
    return  reg.test(value);
  }
  //全选效果
updateAllChecked(): void {
  this.indeterminate = false;
  if (this.allChecked) {
    this.tempdata.forEach(item => item.checked= true);
  } else {
    this.tempdata.forEach(item => item.checked = false);
  }
 }
   //修改打印数量给提示
   numchange(item){
    let reg = new RegExp(`^0[0-9]`,"i");
      if(Number(item.bsl)<Number(item.temp_num)||(reg.test(item.temp_num))){
        item.warning=true;
      }
      else{
        item.warning=false;
      }
  }
 //单选
 updateSingleChecked(): void {
  if (this.tempdata.every(item => item.checked === false)) { 
    this.allChecked = false;
    this.indeterminate = false;

  } else if (this.tempdata.every(item => item.checked === true)) {
    this.allChecked = true;
    this.indeterminate = false;
  } else {
    this.indeterminate = true;
  }
 } 
//点击包时
selectPackage (item) {
  console.log(item,'點擊'); 
  this.activeImg=`${this.serviceip}/upload/image_bb/${item.bid}.jpg`;
  this.selectItem = item;
  this.brokedataservice.ksid=item.dpid;
  this.brokedataservice.ksname=item.deptname;  
  this.Tmxx.bmc=item.bmc;  
  this.Tmxx.bid=item.bid;  
  item.checked=!item.checked;  
  this.getPackageMessage(item.bid); 
}

stop(e){
  e.stopPropagation();
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
    let losscordres={'transformdata':this.transformdata,'AA10List':res.returnValue.AA10List,'Tmxx':this.Tmxx};
    storage.set('losscordres',losscordres)
      console.log(losscordres,'getsucess');
      if(!losscordres.transformdata){
        this.play('请选定包');
          this.tools.createMessage('warning','请选定包');
         return;
      }
    this.createlossComponentModal(tplTitle,tplFooter);
    
  });
}

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
      this.play('请添加数量');
      this.tools.createMessage('warning','请添加数量');
      return;
    }
  const data = {
    Sh:{"sh_did":this.brokedataservice.ksid,"sh_dname":this.brokedataservice.ksname},
    ShDtl:{shList:[{"sh_type_name":this.brokedataservice.broketype.aaa103,"bid":this.brokedataservice.bid,"bmc":this.brokedataservice.bmc,"clid":this.brokedataservice.brokematerial.clid,"clmc":this.brokedataservice.brokematerial.clmc,"sh_num":this.recovercount,"sh_type":this.brokedataservice.broketype.aaa102}]},
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
      this.play(`损耗登记失败`);
      this.tools.createMessage('warning', `损耗登记失败`);
    }
  });
 this.recovercount=0;
 this.modal2.destroy();
 
}
onClick(){
  let tempcheck=_.filter(this.tempdata,(item)=>{
          return item.checked; 
        });
        console.log(tempcheck,'tempcheck');
        let parmas=_.map(tempcheck,(value)=>{
          return {'ff_did':value['dpid'],'b_num':value['temp_num'],'bid':value['bid'],'isjb':value['ff_type']=='是'?'1':'0'};
        }) 
        console.log(parmas,'parmas');
        this.recoverheaderBynotmid(parmas);
}
 
dohs(item){
  const data = { 
    HsTmxxList:[{'ff_did':item.dpid,'b_num':item.temp_num,'bid':item.bid,'isjb':item.ff_type=='是'?'1':'0'}],
    LoginForm: {
      deptId: this.deptId,
      deptName: this.deptName,
      userId: this.userId,
      userName: this.userName
    }
  };
  this.service.recoverheaderBynotmid(data).subscribe((res)=>{
    if(res.status="OK"){
      this.tools.createMessage('success','回收成功');
      this.getoberecovery()
      this.emitserivce.recoverysuccess.emit();
        
      console.log(res,'待回收，回收');  
    }else{
      this.play(res.message);
      this.tools.createMessage('warning',res.message);
    }

  });
}

//回收
recoverheaderBynotmid(parmas){
  const data = {
    HsTmxxList:parmas,
    LoginForm: {
      deptId: this.deptId,
      deptName: this.deptName,
      userId: this.userId,
      userName: this.userName
    }
  };
  this.service.recoverheaderBynotmid(data).subscribe((res)=>{
    if(res.status="OK"){
      this.playOrPauseAction();

      this.tools.createMessage('success','回收成功');
      this.getoberecovery()
      this.emitserivce.recoverysuccess.emit();
        
      console.log(res,'待回收，回收');  
    }else{
      this.play(res.message);
      this.tools.createMessage('warning',res.message);
    }

  });
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
      //this.brokedataservice.toberecoverdata=res.returnValue.rows;
      this.tempdata=res.returnValue.rows;
      this.bodydata=res.returnValue.rows;
      this.emitgetcount(); 
       console.log(res,'待回收接口成功');
     }
  })
}


  //同时触发请求今日回收接口和待回收接口
  emitgetcount(){
    //请求今日回收接口
    let timenow=new Date();
    let nowday=this.datepipe.transform(timenow,'yyyy-MM-dd');
    let postday;
   postday={"end_dt_hs":`${nowday} 23:59:59`,"isChecked":false,"start_dt_hs":`${nowday} 00:00:00`};
    this.emitservice.eventEmittodayrecover.emit(postday);
    //请求待回收接口
    this.emitservice.eventEmittoberecovercount.emit(null);
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
       this.count=res.returnValue.dhss;
       console.log(res,'今日回收接口成功');
     }
  })
}

}
