import { Component, OnInit ,ViewChild,AfterViewInit} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { fromEvent } from 'rxjs';
import {LoginService} from '../../service/http/login.service';
import { Router }  from '@angular/router';
import storage from '../../service/storage';
import { BrokedataService } from 'src/app/service/state/wastage.service';
import { ToolsService } from 'src/app/service/tools/tools.service';
import * as _ from 'lodash';
import { PrintMakeService } from '../../service/http/printmake.service';
import { Observable, of } from 'rxjs';
import { PublicuseService } from '../../service/http/publicuse.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,AfterViewInit {
    @ViewChild('loginName')
    LoginName;

   public validateForm: FormGroup;
   public testvalue:string='123';
   public passworderror:boolean=false;
   public promptarr;
   public sign;
   public signshow:boolean=false;
   public palcevalue;
   public de_deptid='';
   public promptlist=[];
   public showpalcesign:boolean;
   private times;
   public serviceip;
   large='large';


    constructor(private fb: FormBuilder,private loginservice:LoginService,private router:Router,private brokedataservice:BrokedataService,private toolservice:ToolsService) {
      this.gethouse();
    }
  
    startLogin(logintype?): void {
      if(!this.validateForm.value.userName){
          document.getElementById('username').focus();
          return;
      }
        this.de_deptid=this.palcevalue;
        console.log(this.de_deptid);
        let parmas={
         "clientip":"",
        "req":{"args":{"LoginForm":{"deptId":this.de_deptid,"loginName":this.validateForm.value.userName,"password":this.validateForm.value.password}},"currentip":"","method":"loginIn","service":"EmurService"},"sign":"DA944624C718CAA806A5E5555D78ED9B","specialcode":"","ssoid":"","sysid":"android","web":"2018-12-05 10:16:38","v":"1.0"}
       if(logintype){
           Object.assign(parmas.req.args.LoginForm,{},{'loginType':'3'});
           parmas.req.args.LoginForm.loginName=parmas.req.args.LoginForm.loginName.replace(/^ZG|zg/,'');
           console.log(' parmas.req.args.LoginForm.loginName', parmas.req.args.LoginForm.loginName);
        } ;
        storage.setSession('password',this.validateForm.value.password);
        this.loginservice.userlogin(parmas).subscribe((res)=>{
            console.log(res,'res');
            if(res.status=='OK'){
              this.passworderror=false;
              this.loginservice.islogin=true;
              sessionStorage.setItem('islogin','true');
              console.log(res['returnValue'],'testvalue');
              const {LoginForm: userMessage} = res['returnValue'];
              storage.set('userMessage', userMessage);
              let redirect ='/home';
              this.router.navigate([redirect]);
            }
            if(res.status=="error"&&res.message=="密码不正确,请确认!"){
              this.passworderror=true;
            }
            if(res.status=="error"&&res.message=="输入的部门不存在,请确认!"){
              this.toolservice.createMessage('warning',res.message);
            }            
        })
    }
    ngOnInit(): void {
      this.validateForm = this.fb.group({       
        palce: '',
        userName: [ null, [ Validators.required ] ],
        password: [ null, [ Validators.required ] ],
        remember: [ true ]
      });
    //   document.getElementById('username').focus();
      console.log(this.LoginName.nativeElement,'123456');
    }
    ngAfterViewInit(){
        this.LoginName.nativeElement.focus();
    }
    onChosePack(e){
      console.log(e,'选择结果');
      if(!e){
        return;
      }
      this.palcevalue=e.deptid;
    }

    gethouse(){
      let params={"req":{"args":{"Department":{},"LoginForm":{}},"method":"getDepartmentList","service":"DepartmentService"},"sign":"DA944624C718CAA806A5E5555D78ED9B","sysid":"web","timestamp":"2018-09-05 13:34:45"}
      this.loginservice.getHouse(params).subscribe((res)=>{
        if(!res.returnValue&&!res.returnValue.DepartmentList){
          this.toolservice.createMessage('warning','科室数据失败');
          return;
        }
        this.promptarr=res.returnValue.DepartmentList;
        storage.set('promptarr',this.promptarr);
        console.log(res,'科室数据获取成功');       
      })
    }
    onKey(){
      //隐藏提示
      this.showpalcesign=false;
      // _.debounce(calculateLayout, 150)
      // var debounced=_.debounce(()=>{
      //   console.log(this.times,'点击次数');
      //   this.toolservice.createMessage('warning','科室数据未加载');
      // },3000)
      if(!this.promptarr&&!this.times){
        this.times=setTimeout(()=>{
          this.times=null;
          this.toolservice.createMessage('warning','科室数据未加载');
        },1000);

        return;
      }
      let listarr=this.promptarr.filter((item)=>{   
        let reg = new RegExp(`^${this.validateForm.value.palce}`,"i");
        return reg.test(item.de_alph)||reg.test(item.de_deptname);
      });
      this.promptlist=[...listarr];
      console.log(this.promptlist);
      if(this.promptlist.length>0){
        this.signshow=true;
      }
      else{
        this.signshow=false;
        this.de_deptid='';
      }    
    }
    hidelist(){
      this.signshow=false;
    }
    signchoose(item){
      this.palcevalue=item.de_deptname;
      this.de_deptid=item.de_deptid;
      this.signshow=false;
    }
    hiderror(e?){
      if(this.passworderror){
        this.passworderror=false;
      } 
      console.log(e);
      if(e){
        if((/^ZG/).test(this.validateForm.value.userName)||e.keyCode===13){
            console.log('enter');
            this.startLogin(true);
        }  
      }
      
    }
    getdeptid(){
      if(!this.promptarr){
        this.toolservice.createMessage('warning','科室数据加载中...')
        return;
      }
      let index=this.promptarr.filter((item)=>{return item.de_deptname==this.validateForm.value.palce});
      console.log(index);
      if(index.length>0){
        return index.pop().de_deptid;
      }else{
        return this.de_deptid;
      } 
    }
    test(){
        console.log('123');
    }
}
