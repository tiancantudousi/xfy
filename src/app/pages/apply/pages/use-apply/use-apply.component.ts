import { Component, OnInit ,TemplateRef,Output,EventEmitter,ViewChild,ElementRef} from '@angular/core';
import storage from './../../../../service/storage';
import {ToolsService} from './../../../../service/tools/tools.service'
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import {DatePipe} from "@angular/common";
import { PublicuseService} from './../../../../service/http/publicuse.service';
import { EmitService} from './../../../../service/middleman.service';
import { HttpService } from 'src/app/service/http/http.service';
import { LoginService } from 'src/app/service/http/login.service';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-use-apply',
  templateUrl: './use-apply.component.html',
  styleUrls: ['./use-apply.component.scss']
})
export class UseApplyComponent implements OnInit {
  // @ViewChild('packageinput')
  // Packageinput:ElementRef
  public userName: string;
  public userId: string;
  public deptId: string;
  public deptName: string;
  private Loginform;
  public formtimestart=new Date();
  public formtimeend=new Date();
  disabledDate;
  public dateFormat="yyyy-MM-DD";


  public promptlist=[];
  public signshow;
  public showpalcesign;
  public chosenks;
  public packageid;
  public showkslist=false;
  dataList=[];
  searchChange$ = new BehaviorSubject('');
  type;
  optionList$:Observable<any>;

  // public packageList=[];
  // packList=[];
  // placement = 'bottomRight';

constructor(
  private service:HttpService,
  private toolservice:ToolsService,
  private loginservice:LoginService,
  private modalService: NzModalService,
  
) {
  const message = storage.get('userMessage');
  this.userName = message['userName'];
  this.userId = message['userId'];
  this.deptId = message['deptId'];
  this.deptName = message['deptName'];
  this.Loginform= {deptId: this.deptId,deptName: this.deptName,userId: this.userId,userName: this.userName};
  // this.promptarr=storage.get('promptarr');
  this.disabledDate=this.toolservice.disableDate(new Date());
 }

ngOnInit() {
    // if(!this.promptarr){
    //     this.promptarr=this.getPromptarr();
    // }
    // this.Packageinput.nativeElement.focus();
    const getRandomNameList = (name: string) => this.service.getdata(this.getparams(name)).pipe(map((res: any) => res.returnValue.rows));
    const optionList$: Observable<string[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));
    optionList$.subscribe(data => {
      this.dataList=[].concat(data);
      console.log('搜索返回结果',data);
    });
    this.type='0';

    
}
// startsearch(){
//   this.optionList$.subscribe(res => {
//       console.log(res,'查询返回数据');
//   });
// }
onChosePack(e){
  this.chosenks=e.deptid;
  console.log(e,'选定科室');
  // this.chosenks=e;
}

search(){
  console.log('1',this.chosenks);
  this.searchChange$.next(this.chosenks);
  // this.startsearch();
}
getparams(name){
  // let ksid;
  // if(!this.chosenks){
  //   ksid=''
  // }else{
  //   ksid=this.chosenks['de_deptid'];
  // }
  // console.log(ksid,'bug here');
  // console.log(ksid,choseks,'ksid');
  console.log(name,'bug here')
  let  postdata={  
    method: 'getSysqList',
    service: 'TmxxService',
    PageReq:{},
    Tmxx:{"bsq_status":this.type,"bsq_ksid":name,"start_dt":this.toolservice.timepipe(this.formtimestart,'yyyy-MM-dd')+' 00:00:00',"end_dt":this.toolservice.timepipe(this.formtimeend,'yyyy-MM-dd')+' 23:59:59',"dateType":"D"},
    LoginForm: {
      deptId: this.deptId,
      deptName: this.deptName,
      userId: this.userId,
      userName: this.userName
    }
  };
  return postdata;

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
// getPromptarr(){
//   let params={"req":{"args":{"Department":{},"LoginForm":{}},"method":"getDepartmentList","service":"DepartmentService"},"sign":"DA944624C718CAA806A5E5555D78ED9B","sysid":"web","timestamp":"2018-09-05 13:34:45"}
//   this.loginservice.getHouse(params).subscribe((res)=>{
//     return res.returnValue.DepartmentList;
//   })
// }
//点击选定的科室

  // signchoose(item){
  //     console.log(item);
  //     this.palcevalue=item.de_deptname;
  //     this.chosenks=item;
  //     this.showkslist=false;
  // }


hideul(e){
    e.stopPropagation();
    if(this.showkslist){
      this.showkslist=false;
    }
}

toggle(item,e){
     item.show=!item.show;
}
charthttp(val){
  const getRandomNameList = (name: string) => this.service.getdata(this.getparams(name)).pipe(map((res: any) => res.returnValue.rows));
  const chartobserve$: Observable<string[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));
  return chartobserve$;
}
chart(item){
  const data={  
    method: 'doConfsysq',
    service: 'TmxxService',
    PageReq:{},
    Tmxx:{"tmid":item.tmid},
    LoginForm: {
      deptId: this.deptId,
      deptName: this.deptName,
      userId: this.userId,
      userName: this.userName
    }
  };
  this.modalService.confirm({
    nzTitle: '温馨提示?',
    nzContent: '<b style="color: red;">确定要审核[' + item.tmid + ']吗</b>',
    nzOkText: '确定',
    nzOkType: 'danger',
    nzOnOk: () => {
      this.service.getdata(data).subscribe(res=>{
        if(res.status=="OK"){
          this.toolservice.createMessage('success','审核成功');
          this.search();
        }
        else{
          this.toolservice.createMessage('warning',res.message+'审核失败');
        }
        console.log(res,'审核接口')
     })

    },
    nzCancelText: '取消',
    nzOnCancel: () => {
      console.log('取消')
    }
  });

 
}
waste(item){
  const data={  
    method: 'doInvsysq',
    service: 'TmxxService',
    PageReq:{},
    Tmxx:{"tmid":item.tmid},
    LoginForm: {
      deptId: this.deptId,
      deptName: this.deptName,
      userId: this.userId,
      userName: this.userName
    }
  };
  this.modalService.confirm({
    nzTitle: '温馨提示?',
    nzContent: '<b style="color: red;">确定要作废[' + item.tmid + ']吗</b>',
    nzOkText: '确定',
    nzOkType: 'danger',
    nzOnOk: () => {
      this.service.getdata(data).subscribe(res=>{
        if(res.status=="OK"){
          this.toolservice.createMessage('success','作废成功');
          this.search();
        }
        else{
          this.toolservice.createMessage('warning',res.message+'作废失败');
        }
        console.log(res,'作废接口')
     })

    },
    nzCancelText: '取消',
    nzOnCancel: () => {
      console.log('取消')
    }
  });
}









}
