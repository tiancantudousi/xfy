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

@Component({
  selector: 'app-witlog',
  templateUrl: './witlog.component.html',
  styleUrls: ['./witlog.component.scss']
})
export class WitlogComponent implements OnInit,AfterViewInit {
  @ViewChild('packslide') Packslide;


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





  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;


  public countlist = [];
 
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
    private renderer:Renderer2

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
    this.getsterilizerType();
    this.getsettime();
    this.getmetialer();

    this.Search();

  

  }
  ngAfterViewInit(){
   
  
 
    
  }
  onChosePack(e){
    console.log(e,'选择结果');
    this.packname=e.bmc;
  }
  // onsearchpack(e){
  //   console.log(this.packname,this.packscopy,'搜索中');
  //   if(!e.target.value){
  //     this.packs=this.packscopy.slice();
  //     return;
  //   }

  //   let reg=new RegExp(`^${e.target.value}`,'i');
  //   this.packs=_.filter(this.packscopy,(item)=>{
  //         return reg.test(item.bmc)||reg.test(item.py_code);
  //   });
  //   console.log(this.packs,'this.packs'); 
  // }

  // selectpack(item,e){
  //    this.packname=item.bmc;
  //    this.showtopul=false;
  // }


 
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
  Search(){
    this.getpercent();
    // let packchose=_.find(this.packs,{'bmc':this.packname});
    // console.log('当前选定包',packchose);
    const data = {
      method: 'getsbdjList',
      service: 'MjService',
      "Sbdj":{bmc:this.packname?this.packname:'',kssj: this.toolservice.timepipe(this.formtimestart, 'yyyy-MM-dd') + ' 00:00:00',jssj:this.toolservice.timepipe(this.formtimeend, 'yyyy-MM-dd') + ' 23:59:59'},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        if(!res.returnValue.SbdjResultList){
          this.countlist=[];
           return;
         }
         this.countlist=[].concat(...res.returnValue.SbdjResultList);
       
        console.log(res, 'bug', 'seach数据');
        // this.metialers = res.returnValue.AA10List;
      }
    });
  }


  add(tplTitle, tplContent, tplFooter) {
     
      this.ifadd=true;
      this.clearall(); this.clearall();
      this.createchangepanModal(tplTitle, tplContent, tplFooter);

  }
  clearall(){
      this.pack2=null;
      this.timemodel=null;
      this.sterilizerType=null;
      this.settime=null;
      this.metialer=null;
      this.witstrong =null;
      this.witweight=null;
      this.witnum=null;
      this.findtype=null;
      this.speak=null;
      this.detail=null;
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
  onChosePack2(e){
    this.pack2=e;
    console.log(e,'modle 选择包');
  }
  sureaddmessage(){
    let chosesterilizerType=_.find(this.sterilizerTypes,{'aaa102':this.sterilizerType});
    let chosesettime=_.find(this.settimes,{'aaa102':this.settime});
    let chosemetialer=_.find(this.metialers,{'aaa102':this.metialer});
    // let chosepack=_.find(this.packs,{'bid':this.packnameone});
    let tempobj={
      djsj:this.toolservice.timepipe(this.timemodel,'yyyy-MM-dd HH:dd:ss'),
      bmc:this.pack2.bmc,
      bzcl:chosemetialer?chosemetialer.aaa103:'',
      mjfs:chosesterilizerType?chosesterilizerType.aaa103:'',
      sbsl:this.witnum,
      sbtj:this.witstrong,
      sbzl:this.witweight,
      sdsj:chosesettime?chosesettime.aaa103:'',
      fxfs:this.findtype,
      ms:this.speak, 
      remark:this.detail
    }
    // this.countlist.push(tempobj);
    if(this.ifadd){
      this.store(tempobj);
    }else{
      this.rechange(tempobj);
    }
    this.changepanmodal.destroy();
    //保存
  
  }
  store(val){
    if(!this.timemodel){
      this.toolservice.createMessage('warning','请选择时间');
      return;
    }
    if(!this.pack2){
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
