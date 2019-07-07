import { Component, OnInit,ViewChild,ElementRef,AfterViewInit } from '@angular/core';
import { PublicuseService } from 'src/app/service/http/publicuse.service';
import { ToolsService } from 'src/app/service/tools/tools.service';
import storage from './../../../../service/storage'
import { PrintMakeService } from 'src/app/service/http/printmake.service';
import { RecoveryService } from 'src/app/service/http/recovery.service';
import * as _ from 'lodash';
import { HttpService } from 'src/app/service/http/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit, AfterViewInit {

  // @ViewChild('packageinput')
  // Packageinput:ElementRef;

  public dateFormat="yyyy-MM-DD";
  public dateFormatd="yyyy-MM-DD";
  public formtimestart=new Date();
  public formtimeend=new Date();
  public packname;
  private packscopy=[];
  public packs=[];
  private resetobj;
  private timer;
  private timer2;
  public sterilizerType;//材料名称
  public sterilizerTypes=[];
  checkpercent;
  public size="default";
   
 

  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;

  public washprintlist=[];
  public countlist=[];
  makePackagePersons=[];
  makePackagePerson;
  broketype;
  borksolve; 
  borksolves=[];
  broketypes=[];
  ifqj='false';
  disabledDate;
  showtopul=false;
  searchChange$ = new BehaviorSubject('');
  isLoading=false;
  constructor(
    private publicservice:PublicuseService,
    private toolservice:ToolsService,
    private service: HttpService,
    private recoverservice:RecoveryService

  ) { 
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.disabledDate=this.toolservice.disableDate(new Date());

  }

  ngOnInit() {
    // this.getwashers();
    // this.getsterilizerType(null);
    // this.getPackagePlace();
    // this.confectPackageSearch();
    // this.Packageinput.nativeElement.focus();
    // this.publicservice.getulPackagesbetter().subscribe(res=>{
    //   this.packscopy=res.slice();
    //   this.packs=this.packscopy.slice();
    //   console.log(res,'包内容');
    // })
    //获取质检人
    let observer=new Observable((observer)=>{
      this.publicservice.getPackageMans(observer);
    })
    observer.subscribe((value)=>{
      this.makePackagePersons=value['arr'];
      console.log(value,this.makePackagePersons,'质检人列表');

    });
    const getRandomNameList = (name: string) => this.service.getdata(this.getparmas(name)).pipe(map((res: any) => res.returnValue.rows));
    const optionList$: Observable<string[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));
    optionList$.subscribe(data => {
      console.log('搜索返回结果',data);
      this.sterilizerTypes = data;
      this.isLoading = false;
    });
    this.getborketypes();
    this.getbrokeresole();
    this.Search();

  }
  ngAfterViewInit(){
    // this.Packageinput.nativeElement.addEventListener('focus',()=>{
    //   this.showtopul=true;
    //         console.log(this.showtopul,this.packs,'this.showtopul');
    //  })
    // console.log(this.Packageinput.nativeElement,'this.packgeinput');
  }
  onChosePack(e){
    console.log(e,'选择结果');
    this.packname=e.bid;
    // if(!e){
    //   this.tempdata=this.bodydata.slice();
    //   return;
    // }
    // this.tempdata=_.filter(this.bodydata,(item)=>{
    //     return e.bid==item.bid;
    // })
  }

  // packageidkeyup(e) {
 
  //   this.showtopul=true;
  //    this.packs=_.filter(this.packscopy,(item)=>{
  //       let reg = new RegExp(`^${this.packname}`,"i");      
  //       return reg.test(item.bmc)||reg.test(item.py_code);
  //    });
  //    console.log(this.packs,'this.packs');
  
  //  }
  //  showul(e){
  //    e.stopPropagation();
  //    this.showtopul=true;
  //  }
   choosepackage(item,e){
    this.packname=item.bmc;
    this.packchange();
    this.showtopul=false;
   }
  Searchpercent(){
    const data = {
      method: 'getQxzjHgl',
      service: 'QxService',
      Qx:{     "start_dt":this.toolservice.timepipe(this.formtimestart,'yyyy-MM-dd')+' 00:00:00',
      "end_dt":this.toolservice.timepipe(this.formtimeend,'yyyy-MM-dd')+' 23:59:59',
      "blb":this.ifqj=='true'?'qj':''},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        console.log(res,'bug', '质检合格率数据');
        this.checkpercent=Number(res.returnValue.qx[0].zjhgl)*100+'%';
        // this.sterilizerTypes=res.returnValue.rows.slice();
      }
    });
  }
  // getsterilizerType(e){
  //   console.log(this.sterilizerType,'this.sterilizerType');
  //   const data = {
  //     method: 'getComboGrid',
  //     service: 'PopupService',
  //     Popup:{"type":"COMBOGRID_CL"},
  //     "PageReq":{page:"1",rows:"10",q:e},
  //     LoginForm: {
  //       deptId: this.deptId,
  //       deptName: this.deptName,
  //       userId: this.userId,
  //       userName: this.userName
  //     }
  //   };
  //   this.service.getdata(data).subscribe(res => {
  //     if (res.status == "OK") {
  //       console.log(res,'bug', '材料数据');
  //       this.sterilizerTypes=res.returnValue.rows.slice();
  //     }
  //   });
  // }
  getparmas(val){
    return {
      method: 'getComboGrid',
      service: 'PopupService',
      Popup:{"type":"COMBOGRID_CL"},
      "PageReq":{page:"1",rows:"10",q:val},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
  }
  onSearch(e){
    this.isLoading = true;
    this.searchChange$.next(e);
  }

  packchange(){
    //保存第一次选定的值，用于第二次重置回去 
 
    if(this.resetobj){this.resetobj.name=this.resetobj.bmc+this.resetobj.py_code};
    if(this.timer){return;}
    this.timer=setTimeout(()=>{
      let choseitem=_.find(this.packscopy,{'bid':this.packname});
      if(!choseitem){
        return;
      }
      this.resetobj=choseitem;
      choseitem['name']=choseitem['bmc'];
      this.timer=null;
      // this.tempdata=_.filter(this.bodydata,(item)=>{
      //      console.log(item,choseitem);
      //       return choseitem.bid==item.bid;
      // })
    },200);
    console.log(this.packname,'packname');
  }
  Search(){
    this.getcountlist();
    this.Searchpercent();
  }
  //列表查询
  getcountlist(){
    let Afilter=this.filterall();
    console.log(this.ifqj,'this.ifqj');
    const data = {
      method: 'getZjtjList',
      service: 'CxtjService',
      PageReq:{},
      QxzjDtl:{"blb":this.ifqj=='true'?'qj':'',
      "ng_rea":Afilter['broketype']?Afilter['broketype'].aaa102:'',
      "ng_rea_name":Afilter['broketype']?Afilter['broketype'].aaa103:'',
      "proc_way":Afilter['borksolve']?Afilter['borksolve'].aaa102:'',
      "proc_way_name":Afilter['borksolve']?Afilter['borksolve'].aaa103:'',
      "bid": this.packname? this.packname:'',
      "clid":Afilter['sterilizerType']?Afilter['sterilizerType'].clid:'',
      // "cre_uid":this.makePackagePerson,
      "start_dt":this.formtimestart?this.toolservice.timepipe(this.formtimestart,'yyyy-MM-dd'):this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+' 00:00:00',
      "end_dt":this.formtimeend?this.toolservice.timepipe(this.formtimeend,'yyyy-MM-dd'):this.toolservice.timepipe(new Date(),'yyyy-MM-dd')+' 23:59:59',
      "dateType":"D"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        console.log(res,'bug', 'list 查询数据');
        this.countlist=res.returnValue.rows;
        // this.sterilizerTypes=res.returnValue.rows.slice();
      }
    });
  }
  filterall(){
      //   this.tempdata=_.filter(this.packs,(item)=>{
      //       return this.packname.bid==item.bid;
      // })
      let temppack=_.find(this.packs,{'bid':this.packname});
      let sterilizerType=_.find(this.sterilizerTypes,{'clid':this.sterilizerType});
      let broketype=_.find(this.broketypes,{'aaa102':this.broketype});
      let borksolve=_.find(this.borksolves,{'aaa102':this.borksolve});
      console.log({temppack:temppack,sterilizerType:sterilizerType,broketype:broketype,borksolve:borksolve});
      return {temppack:temppack,sterilizerType:sterilizerType,broketype:broketype,borksolve:borksolve};


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
   

}
