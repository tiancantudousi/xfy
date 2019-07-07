import { Component, OnInit } from '@angular/core';
import storage from './../../../../service/storage';
import {Router} from '@angular/router';
import {EmitService} from './../../../../service/middleman.service';
import { HttpService } from 'src/app/service/http/http.service';

@Component({
  selector: 'app-wash-header',
  templateUrl: './wash-header.component.html',
  styleUrls: ['./wash-header.component.scss']
})
export class WashHeaderComponent implements OnInit {
  private name:string;

  public userName: string="李岚 0232";
  public userId: string;
  public deptId: string;
  public deptName: string;
  public todayrecovery:number=0;
  public todaytotalnum=0;

  public totalnum:number=0;//总锅次
  public nownum:number=0;//日锅次
  tobewash;
  havewash;
  constructor(
    private router:Router,
    private emitservice:EmitService,
    private service:HttpService
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
  }
  gobackhome(){
    this.router.navigate(['/home']);
  }
  loginout(){
    sessionStorage.setItem('islogin','false'); 
    storage.set('userMessage', null);
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.emitservice.eventEmithtotaltoday.subscribe((value)=>{
      // console.log(value,'当前总锅次');
       this.todaytotalnum=value;
    });
    this.emitservice.eventEmithcount.subscribe((value)=>{
      console.log(value,'当前总锅次');
      this.nownum=value.d_gc;
      this.totalnum=value.t_gc;
      //  this.todaytotalnum=value;
    });
    this.gettobewash();
    this.gethavewash();
  }
  gettobewash(){
    const data = {
      method: 'getDhsBsl',
      service: 'QxService',
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.tobewash=res.returnValue.qx;
        console.log(res, 'bug', '待清洗返回数据');
      }
    });
    
  }
  gethavewash(){
    const data = {
      method: 'getJrqxs',
      service: 'QxService',
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getdata(data).subscribe(res => {
      if (res.status == "OK") {
        this.havewash=res.returnValue.qx;
        console.log(res, 'bug', '已清洗返回数据');
      
      }
    });
    
  }

}
