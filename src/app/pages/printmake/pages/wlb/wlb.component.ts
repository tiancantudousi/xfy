import { Component, OnInit, ViewChild, ElementRef,TemplateRef,AfterViewInit ,Renderer2} from '@angular/core';
import { PublicuseService } from 'src/app/service/http/publicuse.service';
import { ToolsService } from 'src/app/service/tools/tools.service';
import storage from './../../../../service/storage'
import { PrintMakeService } from 'src/app/service/http/printmake.service';
import { RecoveryService } from 'src/app/service/http/recovery.service';
import * as _ from 'lodash';
import { HttpService } from 'src/app/service/http/http.service';
import { Observable, of } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { PrintmakeHelpComponent } from 'src/app/pages/printmake/component/printmake-help/printmake-help.component';

@Component({
  selector: 'app-wlb',
  templateUrl: './wlb.component.html',
  styleUrls: ['./wlb.component.scss']
})
export class WlbComponent implements OnInit,AfterViewInit {
  @ViewChild('packslide') Packslide;

  @ViewChild('childone')
  childone:PrintmakeHelpComponent;


  sterilizerType;
  sterilizerTypes = [];
  settime;
  settimes = [];
  metialer;
  metialers = [];
  witstrong;
  witweight;
  witnum;
  findtype;
  changepanmodal;
  changepanmodaladd;
  changepanmodalgh;
  changepanmodalghzf;
  modelpack;
  timemodel=new Date();
  packnameone;
  speak;
  detail;
  checkpercent;
  chosepack;
  changepack='';
  public dateFormat = "yyyy-MM-DD";
  // public formtimestart = new Date(new Date().getTime()-1*24*60*60*1000);
  public formtimestart=new Date();
  public formtimeend = new Date();
  
  public packname;
  private packscopy = [];
  public packs = [];
  private resetobj;
  private ghitem;
  private ghzfitem;
  private fhuser;
  private jsuser;
  public makePackagePersons;

  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;
  public fhsid:string;
  public djztvalue:string;
  public wlbfladd:string;
  public wlbvalue:string;
  private fhs_add;
  private shradd:string;
  public shr:string;
  private bnum =0;
  private clnum=0;
  private  ghnum=0;
  private lxfs:string;
  public countlist = [];
  public wlbList =[];
  public wlbaddList =[];
  public wlbDtlList=[];
  public itmebxx;
  public fhs = [];
  public djzt = [];
  public wlbllx = [];
  disabledDate;
  showtopul=false;
  showtopulone=false;
  ifadd;
  id;
  pack2;
  constructor(
    private publicservice: PublicuseService,
    private toolservice: ToolsService,
    private service: HttpService,
    private recoverservice: RecoveryService,
    private modalService: NzModalService,
    private renderer:Renderer2,
    private publicuseservice:PublicuseService

  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.disabledDate = this.toolservice.disableDate(new Date());
  }

 





  ngOnInit() {
    // this.getwashers();
    this.getdjlx();
    this.getfhs();
    this.getwlblx();

    
   //获取打包人
   let observer=new Observable((observer)=>{
    this.publicuseservice.getPackageMans(observer);
  })
  
  observer.subscribe((value)=>{
    console.log(value,'value');
    let underkey=[...value['arr']];
      underkey.forEach((item)=>{
        item.showname=item.us_userid+'     '+item.us_username;
    });
    this.makePackagePersons=underkey;
  });

  }
  play(text){
    var ttsDiv = document.getElementById('bdtts_div_id');
    var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
    var sss = `<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=${text}" type="audio/mpeg">`;
    var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
    var au2 = '</audio>';
    ttsDiv.innerHTML = au1 + sss + eee + au2;
  }
  printwlb(e,item,name){
    e.stopPropagation();
    let formdata=this.childone.getform();
    let temparr=[];
    temparr.push(item);
    this.publicuseservice.publicprint(temparr,formdata,name);
  }


  getfhs(){
    const data = {
      method: 'getSccj',
      service: 'SccjService',
      Sccj:{},PageReq:{},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        if(res.returnValue&&res.returnValue.rows){
          this.fhs=res.returnValue.rows
        }else{
          this.fhs=[]
        }
      }
    });
  }
  ngAfterViewInit(){
   
  
 
    
  }
  onChosePack(e){
    console.log(e,'选择结果');
    this.packname=e.bmc;
  }



 
  getpercent(){
    const data = {
      method: 'getmjhgltj',
      service: 'MjService',
      "Mj":{"start_dt":this.toolservice.timepipe(this.formtimestart, 'yyyy-MM-dd') + ' 00:00:00',"end_dt":this.toolservice.timepipe(this.formtimeend, 'yyyy-MM-dd') + ' 23:59:59'},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.checkpercent=`${res.returnValue.Mj[0].mjhgl*100}%`;
        console.log(res, 'bug', '合格率数据');
        // this.sterilizerTypes = res.returnValue.AA10List;
      }
    });
  }
  delete(item){
      //解绑商品

        console.log(item);
        this.modalService.confirm({
            nzTitle: '温馨提示?',
            nzContent: '是否删除',
            nzOkText: '删除',
            nzOkType: 'danger',
            nzOnOk: () => {
             this.deleteitem(item);
            },
            nzCancelText: '取消',
            nzOnCancel: () => {
              console.log('取消')
            }
        });
    
  }


  deleteitem(item){
    const data = {
      method: 'delSbdj',
      service: 'MjService',
      "Sbdj":{id:item.id},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.toolservice.createMessage('success','删除成功');
        this.Search();
        // console.log(res, 'bug', '灭菌方式数据');
        // this.sterilizerTypes = res.returnValue.AA10List;
      }
    });
  }
 
  getsterilizerType() {
    const data = {
      method: 'getAa10ListForMobile',
      service: 'ParamService',
      "AA10":{"aaa100":"XD_WAY"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        console.log(res, 'bug', '灭菌方式数据');
        this.sterilizerTypes = res.returnValue.AA10List;
      }
    });
  }
  getsettime(){
    const data = {
      method: 'getAa10ListForMobile',
      service: 'ParamService',
      AA10:{"aaa100":"MJJHSJ"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        console.log(res, 'bug', '灭菌时间数据');
        this.settimes = res.returnValue.AA10List;
      }
    });
  }
  getmetialer(){
    const data = {
      method: 'getAa10ListForMobile',
      service: 'ParamService',
      "AA10":{"aaa100":"BZCZ"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        console.log(res, 'bug', '包装材质数据');
        this.metialers = res.returnValue.AA10List;
      }
    });
  }
  getdjlx(){
    const data = {
      method: 'getAa10ListForMobile',
      service: 'ParamService',
      "AA10":{"aaa100":"WLB_STATE"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        console.log(res, 'bug', '包装材质数据');
        this.djzt = res.returnValue.AA10List;
      }
    });
  }
  getwlblx(){
    const data = {
      method: 'getAa10ListForMobile',
      service: 'ParamService',
      "AA10":{"aaa100":"WLB_TYPE"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.wlbllx = res.returnValue.AA10List;
        this.Search();
      }
    });
  }


  Search(){
    const data = {
      method: 'getWlbList',
      service: 'WlbService',
      "Wlb":{wlb_type:this.wlbvalue,fhs_id:this.fhsid,sh_uname:this.shr,status:this.djztvalue,start_dt: this.toolservice.timepipe(this.formtimestart, 'yyyy-MM-dd') + ' 00:00:00',end_dt:this.toolservice.timepipe(this.formtimeend, 'yyyy-MM-dd') + ' 23:59:59'},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        if(!res.returnValue.wlbList){
          this.wlbList=[];
           return;
        }else{  
          this.wlbList=res.returnValue.wlbList
          this.wlbList.forEach((item)=>{
            
            let wlb=_.find(this.wlbllx,{'aaa102':item.wlb_type});
            if(wlb){
              
              item.wlbtypename=wlb.aaa103
            }else{
              item.wlbtypename='';
            }
            
          })
        }
        console.log(res, 'bug', 'seach数据');
      }
    });
  }
  addbxx(tplTitle, tplContent, tplFooter,item){
    console.log(item,'item')
    this.bnum=item.num;
    if(item.dj_clsl){
      this.clnum=item.dj_clsl;
    }
   
    this.itmebxx=item;
    this.createchangepanModaladd(tplTitle, tplContent, tplFooter);
  }
  addghzf(tplTitle, tplContent, tplFooter,item){
    this.ghzfitem=item;
    this.ghnum=item.dj_num-item.gh_num
    console.log(this.ghzfitem,'this.ghzfitem');
    console.log(this.ghitem,'this.ghitem');
    
    this.createchangepanModalghzf(tplTitle, tplContent, tplFooter);
  }

  addgh(tplTitle, tplContent, tplFooter,item){
    this.ghitem=item;
    this.getghlist();

    this.createchangepanModalgh(tplTitle, tplContent, tplFooter);
  }

  getghlist(){
    const data = {
      method: 'getWlbDtlList',
      service: 'WlbService',
      WlbDtl:{wlbghList:[],
      wlb_id: this.ghitem.id},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        if(res.returnValue&&res.returnValue.wlbDtlList){
          this.wlbDtlList=[].concat(res.returnValue.wlbDtlList);
        }else{
          this.wlbDtlList=[];
        }
      }

    });
  }
  
  sureaddmessageadd(){
    console.log(123)
    this.wlbaddList.forEach((item)=>{
      if(this.itmebxx.bid=item.bid){
        item.num=this.bnum;
        item.dj_clsl=this.clnum;

      }
    })
    this.changepanmodaladd.destroy();
  }
  sureaddmessagegh(){
    this.ghzfitem.wlbghList=[
      {
        bid:this.ghzfitem.bid,
        bmc:this.ghzfitem.bmc,
        gh_num:this.ghnum,
        gh_uid:this.userId,
        gh_uname:this.userName,
        wlbdtl_id:this.ghzfitem.id
      }
    ]
    let wlbDtlList=[];
    wlbDtlList.push(this.ghzfitem);
    
    const data = {
      method: 'doWlbGh',
      service: 'WlbService',
      Wlb:this.ghitem,
      wlbDtlList:wlbDtlList,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.getghlist();
        this.Search();
        this.toolservice.createMessage('success','操作成功');
      }else{
        this.play(res.message);
        this.toolservice.createMessage('warning',res.message);
      }

    });
    this.changepanmodalghzf.destroy();

  }
  sureaddmessagezf(){
    this.ghitem.status='4';
    const data = {
      method: 'modWlb',
      service: 'WlbService',
      Wlb:this.ghitem,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.Search();
        this.toolservice.createMessage('success','操作成功');
      }else{
        this.play(res.message);
        this.toolservice.createMessage('warning',res.message);
      }

    });
    this.changepanmodalgh.destroy();
  }



  add(tplTitle, tplContent, tplFooter) {
      this.ifadd=true;
      this.clearall(); 
      this.createchangepanModal(tplTitle, tplContent, tplFooter);

  }
  clearall(){
    this.jsuser=null;
    this.fhuser=null;
    this.fhs_add=null;
    this.wlbaddList=[];
    this.shradd=null;
    this.lxfs=null;
    this.detail=null;
    this.wlbfladd=null;
  }
      //创建弹窗
  createchangepanModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.showtopul=false;
    this.changepanmodal = this.modalService.create({
      nzTitle: tplTitle,
      nzOkType: 'primary',
      nzContent: tplContent,
      nzFooter: tplFooter
    });
  
    // this.changepanmodal.afterOpen.subscribe((res)=>{
    //   this.chosepack=this.pack2;
    //   this.Packslide.pushpack(this.Packslide);
    //   // console.log(this.Packslide,'this.packslide');
    // })
  
    this.changepanmodal.nzWidth = 490;

  }
  createchangepanModaladd(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.showtopul=false;
    this.changepanmodaladd = this.modalService.create({
      nzTitle: tplTitle,
      nzOkType: 'primary',
      nzContent: tplContent,
      nzFooter: tplFooter
    });
  
    // this.changepanmodal.afterOpen.subscribe((res)=>{
    //   this.chosepack=this.pack2;
    //   this.Packslide.pushpack(this.Packslide);
    //   // console.log(this.Packslide,'this.packslide');
    // })
  
    this.changepanmodaladd.nzWidth = 490;

  }
  createchangepanModalgh(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.showtopul=false;
    this.changepanmodalgh = this.modalService.create({
      nzTitle: tplTitle,
      nzOkType: 'primary',
      nzContent: tplContent,
      nzFooter: tplFooter
    });
  
    // this.changepanmodal.afterOpen.subscribe((res)=>{
    //   this.chosepack=this.pack2;
    //   this.Packslide.pushpack(this.Packslide);
    //   // console.log(this.Packslide,'this.packslide');
    // })
  
    this.changepanmodalgh.nzWidth = 490;

  }
  createchangepanModalghzf(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.showtopul=false;
    this.changepanmodalghzf = this.modalService.create({
      nzTitle: tplTitle,
      nzOkType: 'primary',
      nzContent: tplContent,
      nzFooter: tplFooter
    });
  
    // this.changepanmodal.afterOpen.subscribe((res)=>{
    //   this.chosepack=this.pack2;
    //   this.Packslide.pushpack(this.Packslide);
    //   // console.log(this.Packslide,'this.packslide');
    // })
  
    this.changepanmodalghzf.nzWidth = 490;
  }
  


  onChosePack2(e){
    let temppack=_.find(this.wlbaddList,{'bid':e.bid});
  if(temppack){
    e.num++;
  }else{
    e.num=1;
    this.wlbaddList=this.wlbaddList.concat(e);
  }

  console.log(this.wlbaddList,' this.wlbaddList')
    
  }



  sureaddmessage(){
    if(!this.jsuser){
      this.play('请选择对应的接收人');
      this.toolservice.createMessage('warning','请选择对应的接收人');
      return
    }
    if(!this.fhuser){
      this.play('请选择对应的复核人');
      this.toolservice.createMessage('warning','请选择对应的复核人');
      return
    }
    if(!this.fhs_add){
      this.play('请选择对应的发货商');
      this.toolservice.createMessage('warning','请选择对应的发货商');
      return
    }
    if(!this.wlbaddList){
      this.play('请先添加包');
      this.toolservice.createMessage('warning','请先添加包');
      return
    }
    if(!this.shradd){
      this.play('请输入送货人');
      this.toolservice.createMessage('warning','请输入送货人');
      return
    }
    if(!this.lxfs){
      this.play('请输入联系方式');
      this.toolservice.createMessage('warning','请输入联系方式');
      return
    }
    if(!this.wlbfladd){
      this.play('请选择外来包类型');
      this.toolservice.createMessage('warning','请选择外来包类型');
      return
    }

    this.wlbaddList.forEach((item)=>{
      item.dj_num=item.num;
      item.wlbghList=[];
      item.dj_clsl=0;
    })


    const data = {
      method: 'addWlb',
      service: 'WlbService',
      Wlb:{
        fh_uid:this.fhuser.us_userid,
        fh_uname:this.fhuser.us_username,
        fhs_id:this.fhs_add.id,
        fhs_name:this.fhs_add.name,
        have_sms:'有',
        jj_uid:this.jsuser.us_userid,
        jj_uname:this.jsuser.us_username,
        remark:this.detail,
        sh_info:this.lxfs,
        sh_uname:this.shradd, 
        wlb_type:this.wlbfladd
      },
      wlbDtlList:
        this.wlbaddList
      ,
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
        this.Search();
        console.log(res, 'bug', '保存数据');
      }
      else{
        this.play('保存失败');
        this.toolservice.createMessage('warning','保存失败');
      }
    });
    this.changepanmodal.destroy();
  }
  store(val){
    if(!this.timemodel){
      this.play('请选择时间');
      this.toolservice.createMessage('warning','请选择时间');
      return;
    }
    if(!this.pack2){
      this.play('请选择包');
      this.toolservice.createMessage('warning','请选择包');
      return;
    }
    const data = {
      method: 'addSbdj',
      service: 'MjService',
      Sbdj:val,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
    
      if (res.status == "OK") {
        // this.countlist=res.returnValue.SbdjResultList;
        this.toolservice.createMessage('success','保存成功');
        this.Search();
        console.log(res, 'bug', '保存数据');
        // this.metialers = res.returnValue.AA10List;
      }
      else{
        this.play('保存失败');
        this.toolservice.createMessage('warning','保存失败');
      }
    });
    
  }
  rechange(val){
    let tempval={};
    Object.assign(tempval,val,{id:this.id});
    const data = {
      method: 'modSbdj',
      service: 'MjService',
      Sbdj:tempval,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      
      if (res.status == "OK") {
        // this.countlist=res.returnValue.SbdjResultList;
        this.toolservice.createMessage('success','修改成功');
        this.Search();
        console.log(res, 'bug', '保存数据');
        // this.metialers = res.returnValue.AA10List;
      }
      else{
        this.play('修改失败');
        this.toolservice.createMessage('warning','修改失败');
      }
    });
  }
  change(item,tplTitle, tplContent, tplFooter){
    console.log(item,'item');
    this.changepack=item.bmc?item.bmc:'';
    this.chosepack=item;
    this.ifadd=false;
    let chosesterilizerType=_.find(this.sterilizerTypes,{'aaa103':item.mjfs});
    let chosesettime=_.find(this.settimes,{'aaa103':item.sdsj});
    let chosemetialer=_.find(this.metialers,{'aaa103':item.bzcl});
    // let chosepack=_.find(this.packs,{'bmc':item.bmc});
    this.pack2=item;
    this.timemodel=item.djsj;
    this.sterilizerType=chosesterilizerType?chosesterilizerType.aaa102:'';
    this.settime=chosesettime?chosesettime.aaa102:'';
    this.metialer=chosemetialer?chosemetialer.aaa102:'';
    this.witstrong =item.sbtj;
    this.witweight=item.sbzl;
    this.witnum=item.sbsl;
    this.findtype=item.fxfs;
    this.speak=item.ms;
    this.detail=item.remark;
    this.id=item.id;
    this.createchangepanModal(tplTitle, tplContent, tplFooter);
  }

}
