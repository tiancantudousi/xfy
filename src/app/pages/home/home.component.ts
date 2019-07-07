import { Component, OnInit ,ElementRef,ViewChild} from '@angular/core';

import {LoginService} from '../../service/http/login.service';

import { Router }  from '@angular/router';
import storage from './../../service/storage';
import {openurl} from './../../../assets/urlimpoty.js';
import { ToolsService } from 'src/app/service/tools/tools.service';
import {environment} from './../../../environments/environment';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { BrokedataService } from 'src/app/service/state/wastage.service';
import { WebSocketService } from 'src/app/service/http/websocket.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { PublicuseService } from 'src/app/service/http/publicuse.service';
import { RecoveryService } from 'src/app/service/http/recovery.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('template') template;
  private radius=300;
  private staticnum=265;
  public btnsrc1='/assets/images/配包打包.png'
  public btnsrcadd1='/assets/images/清洗检定.png'
  public btnsrc2='/assets/images/清洗.png'
  public btnsrc3='/assets/images/回收.png'
  public btnsrc4='/assets/images/灭菌.png'
  public btnsrcadd2='/assets/images/霉菌检定.png'
  public btnsrc5='/assets/images/上架按.png'
  public btnsrc6='/assets/images/发放.png'
  placement = 'bottomRight';
  BpzglList;
  userId;
  btnsrc2power;
  btnsrc3power;
  btnsrcadd1power;
  btnsrc1power;
  btnsrc4power;
  btnsrcadd2power;
  btnsrc6power;

  constructor(private loginservice: LoginService,private el:ElementRef,private router:Router,private powerservice:RecoveryService,
  private toolservice:ToolsService,private http:HttpClient,private brokedataservice:BrokedataService,private websocket:WebSocketService,
  private publicservice:PublicuseService,
  private notification: NzNotificationService) {
    const message = storage.get('userMessage');
    // this.BpzglList=this.publicservice.getulPackages();
    this.userId = message['userId'];
   }

  ngOnInit() {
    let pai=3.1415926;
    let signimg1X=Math.round(this.radius*Math.sin(pai/6.5));
    let signimg1Y=Math.round(this.radius*Math.cos(pai/6.5));
    this.el.nativeElement.querySelector('.signimg1').style.transform=`translate(-${signimg1X}px,-${signimg1Y}px)`;
    this.el.nativeElement.querySelector('.signimg2').style.transform=`translate(-${signimg1Y}px,-${signimg1X}px)`;
    this.el.nativeElement.querySelector('.signimg3').style.transform=`translate(-${signimg1Y}px,${signimg1X}px)`;
    this.el.nativeElement.querySelector('.signimg4').style.transform=`translate(-${signimg1X}px,${signimg1Y}px)`;
    this.el.nativeElement.querySelector('.signimg5').style.transform=`translate(${signimg1X}px,-${signimg1Y}px)`;
    this.el.nativeElement.querySelector('.signimg6').style.transform=`translate(${signimg1Y}px,-${signimg1X}px)`; 
    this.el.nativeElement.querySelector('.signimg7').style.transform=`translate(${signimg1Y}px,${signimg1X}px)`;
    this.el.nativeElement.querySelector('.signimg8').style.transform=`translate(${signimg1X}px,${signimg1Y}px)`;
    getYourIP();
    this.publicservice.getscoketip().subscribe(res=>{
      this.websocket.createObservableSocket(res['socket']).subscribe(res=>{
        console.log(res,'websocket');
        this.socketsend();
      })
    })
   
    this.publicservice.getulPackagesbetter().subscribe(res=>{
      this.BpzglList=res;
    });
    this.getpower();
  }

  getpower(){
    const data={"Metafunction":{"us_userid":this.userId,"me_appid":"PDA"}}
    this.powerservice.gethomepower(data).subscribe(res=>{
      let powerlist= res.returnValue.metalist.map((item)=>{
          return {me_metaid:item.me_metaid,me_metaname:item.me_metaname}
      })
      this.buildpower(powerlist);
      console.log(res,'getpower');
    })
  }

  buildpower(powerlist){
    //let basepower=['回收','清洗'];
    let basepower=['HS','QX','QXJG','PB','MJ','MJJG','BSJ','BFF'];
    if(!this.filterpower('HS',powerlist)){
      this.btnsrc3='/assets/images/回收按.png';
      this.btnsrc3power=false;
    }
     if(!this.filterpower('QX',powerlist)){
         this.btnsrc2='/assets/images/清洗按.png';
         this.btnsrc2power=false;
     }
     if(!this.filterpower('QXJG',powerlist)){
      this.btnsrcadd1='/assets/images/清洗检定按.png';
      this.btnsrcadd1power=false;
    }
    if(!this.filterpower('PB',powerlist)){
      this.btnsrc1='/assets/images/配包打包按.png'
      this.btnsrc1power=false;
    }
    if(!this.filterpower('MJ',powerlist)){
      this.btnsrc4='/assets/images/灭菌按.png';
      this.btnsrc4power=false;
    }
    if(!this.filterpower('MJJG',powerlist)){
      this.btnsrcadd2='/assets/images/霉菌检定按.png';
      this.btnsrcadd2power=false;
    }
    if(!this.filterpower('BFF',powerlist)){
      this.btnsrc6='/assets/images/发放按.png';
      this.btnsrc6power=false;      
    }
    
   

 }
 filterpower(name,powerlist){
   let temp=powerlist.find(item=>{
    return item.me_metaid==name
   })
   return temp;
 }
  gouseapply(){
   console.log('apply click');
    this.router.navigate(['apply/use-apply']);
  }
  socketsend(){
    // var socket = new WebSocket("ws://192.168.25.70:82/ylzlzz/websocket/125");
    // var message = {
    //     nickname: "benben_2015",
    //     email: "123456@qq.com",
    //     content: "I love programming"
    // };
    // //添加状态判断，当为OPEN时，发送消息
    // if (socket.readyState===1) {
    //     socket.send(JSON.stringify(message));
    // }else{
    //     //do something
    // }
    this.notification.config({
      nzPlacement:this.placement,
      nzDuration:0
    });
    this.notification.template(this.template);
    // this.notification.blank('Notification Title', 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',{
    //   nzStyle: {
    //     marginBottom: '20px'
    //   },
    // });
    // this.websocket.sendMessage('客户端请求');
  }


  btn1(){ 
    if(this.btnsrc1power===false){
      this.toolservice.createMessage('warning','您无此功能权限');
      return 
    }
    this.btnsrc1='/assets/images/配包打包按.png'
    let that=this;
    setTimeout(
      function(){that.router.navigate(['/printmake'])},500
    )
  }
  btn2(){ 
    if(this.btnsrcadd1power===false){
      this.toolservice.createMessage('warning','您无此功能权限');
      return 
    }
    this.btnsrcadd1='/assets/images/清洗检定按.png';
    let that=this;
    setTimeout(
      function(){ that.router.navigate(['/wash/wash-result']);},500
    )
  }
  btn3(){ 
    if(this.btnsrc2power===false){
      this.toolservice.createMessage('warning','您无此功能权限');
      return 
    }
    this.btnsrc2='/assets/images/清洗按.png';
    let that=this;
    setTimeout(
      function(){that.router.navigate(['/wash'])},500
    )
    
  }
  btn4(){ 
    if(this.btnsrc3power===false){
      this.toolservice.createMessage('warning','您无此功能权限');
      return 
    }
    this.btnsrc3='/assets/images/回收按.png';
    let that=this;
    setTimeout(
      function(){that.router.navigate(['/recovery'])},500
    )
  }
  btn5(){ 
    if(this.btnsrc4power===false){
      this.toolservice.createMessage('warning','您无此功能权限');
      return 
    }
    this.btnsrc4='/assets/images/灭菌按.png';
    let that=this;
    setTimeout(
      function(){that.router.navigate(['/steril'])},500
    )
  }

  btn6(){ 
    if(this.btnsrcadd2power===false){
      this.toolservice.createMessage('warning','您无此功能权限');
      return 
    }
    this.btnsrcadd2='/assets/images/霉菌检定按.png';
    let that=this;
    setTimeout(
        function(){that.router.navigate(['/steril/result'])},500
      )
  }
  btn7(){
    this.btnsrc5='/assets/images/上架按.png';
  
      this.toolservice.createMessage('warning','该功能暂未开放');
  }
  btn8(){
    if(this.btnsrc6power===false){
      this.toolservice.createMessage('warning','您无此功能权限');
      return 
    }
    this.btnsrc6='/assets/images/发放按.png';
    let that=this;
    setTimeout(
        function(){that.router.navigate(['/apply'])},500
      )
 }
  getstate() {
    console.log(this.loginservice.islogin);
  }
  logout(){
    sessionStorage.setItem('islogin','false'); 
    storage.set('userMessage', null);
    this.router.navigate(['/login']);
  }
  jump(){
    const message = storage.get('userMessage');
    let userName = message['userName'];
    let userId = message['userId'];
    let deptId = message['deptId'];
    let deptName = message['deptName'];
    let password=  storage.getSession('password');
    let httpdata=`method=userLogin&loginName=${userId}&password=${password}&deptid=${deptId}`;
    if(environment.production){
        let da= this.http.get('/api/products');
        da.subscribe((value)=>{
            let serviceprint=value['openurl'];
            window.open(serviceprint+"/ylzlzz/logonAction.do?"+httpdata);
            // setTimeout(()=>{location.reload();},1000)
        })
    }    
    else{
        window.open(openurl+"/ylzlzz/logonAction.do?"+httpdata);
    }
  }

}
