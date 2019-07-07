import { Component, OnInit } from '@angular/core';
import { PublicuseService} from './../../../../service/http/publicuse.service';
import {ToolsService} from './../../../../service/tools/tools.service';
// import {PrintMakeService} from './../../../../service/http/printmake.service';
import storage from './../../../../service/storage';
import { PrintMakeService } from 'src/app/service/http/printmake.service';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-printmake-help',
  templateUrl: './printmake-help.component.html',
  styleUrls: ['./printmake-help.component.scss']
})
export class PrintmakeHelpComponent implements OnInit {


  public sterilizer;
  public sterilizers=[];
  public sterilizationtimes;
  public dateFormat="yyyy-MM-DD HH:mm:ss";
  public formtimestart=new Date();
  public mertiral;//包装材质
  public mertirals=[];//包装材质
  public makePackagePerson;//配包人
  public makePackagePersons;
  public killpisonPerson;
  public printType;
  public printTypes=[];
  public disabledDate;
 

  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;

  public size="default";

  private tempmertiral;

  constructor(
    private publicuseservice:PublicuseService,
    private toolservice:ToolsService,
    private service:PrintMakeService
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
  }

  ngOnInit() {
      this.disabledDate=this.toolservice.disableDate(new Date());
      let promise=new Promise((resolve,reject)=>{
           this.publicuseservice.getmertirals(resolve);
      })
      promise.then(reject=>{
        this.mertirals=[].concat(reject);//包装材质
      });
      this.getprintTypes();
      this.getsterilizers();

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

   //获取灭菌机列表
   getsterilizers(){
    const data = {
      Sbxx:{did:this.deptId,is_inv:"1",sb_type:"3~4~5"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getsterilizers(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        console.log(res,'灭菌机列表');
        this.sterilizers=this.sterilizers.concat(res.returnValue.SbxxList);
      }
      else{
        this.toolservice.createMessage('warning', '灭菌机列表获取失败');        
      }
    })
  }
  //灭菌机改变时
  sterilizerchange(){
    this.getsterilizer(this.sterilizer);
    console.log(this.sterilizer,this.sterilizers)
  }
  //获取单个灭菌机状态
  getsterilizer(sterilizerid){
    const data = {
      Mj:{dev_id:sterilizerid},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getsterilizer(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        this.sterilizationtimes=res.returnValue.mjjStateList[0].d_gc;
        console.log(res,'灭菌机');
        // this.sterilizers=[...res.returnValue.SbxxList];
      }
      else{
        this.toolservice.createMessage('warning', '灭菌机获取失败');        
      }
    })
  }
 
  //获取打印样式列表
  getprintTypes(){
    const data = {
      AA10:{aaa100:"DY_DYYS"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getprintTypes(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        this.printTypes=res.returnValue.AA10List;
        // this.mertirals=res.returnValue.AA10List;
        console.log(res,'打印样式获取成功');
      }
      else{
        this.toolservice.createMessage('warning', '灭菌机获取失败');        
      }
    })
  }
  //
  getform(){
    let tempobj=this.publicuseservice.checkbid(this.mertirals,'aaa102',this.mertiral);
    return {
      "xq_start":this.formtimestart,
      "cz_id":this.mertiral,
      "pb_uid":this.makePackagePerson,
      "mj_dev_id":this.sterilizer,
      "mj_d_gc":this.sterilizationtimes,
      "mj_uid":this.killpisonPerson,
      "qx_uid":"",
      "basket_id":"",
      "dy_dyys":this.printType,
      "cz_name":tempobj.aaa103
    }
    
  }
  

}
