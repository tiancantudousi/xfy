import { Injectable } from '@angular/core';
import storage from './../../service/storage';
import { Jsonp } from "@angular/http";    //注入Jsonp模块
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { BrokedataService } from './../../service/state/wastage.service'

import { PrintMakeService } from './printmake.service';
import { ToolsService } from './../tools/tools.service';
import { WashService } from 'src/app/service/http/wash.service';
import { environment } from './../../../environments/environment';
import { openurl } from './../../../assets/urlimpoty.js';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
// const testopen = "http://192.168.25.70:8080";

@Injectable({
  providedIn: 'root'
})
export class PublicuseService {

  // public openurl="http://192.168.22.23:8080";
  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;
  public serviceIp;

  constructor(
    // public tools: ToolsService,
    public service: WashService,
    public printmakeservice: PrintMakeService,
    private toolservice: ToolsService,
    private jsonp: Jsonp,
    private http: HttpClient,
    private state: BrokedataService,
    private router: Router
  ) {
    const messages = storage.get('userMessage');
    this.userName = messages['userName'];
    this.userId = messages['userId'];
    this.deptId = messages['deptId'];
    this.deptName = messages['deptName'];
  }
  //获取开关函数
  getSwitch(name) {
    // debugger;
      let observe=new Observable((resolve)=>{
        if (!environment.switch) {
          this.http.get(`/api/${name}`).subscribe(res=>{
             resolve.next(res);
          });
        }
        else {
          resolve.next({status:'OK',openif:environment[name]});
        }
      })
      return observe;

  }
  //获取websocket地址
  getscoketip() {
    // debugger;
      let observe=new Observable((resolve)=>{
        if (environment.production) {
          this.http.get(`/api/socket`).subscribe(res=>{
             resolve.next(res);
          });
        }
        else {
          resolve.next({status:'OK',socket:environment.socket});
        }
      })
      return observe;

  }

    //优化  获取包列表并缓存，有缓存读缓存，没缓存获取
    getulPackagesbetter():Observable<any>{
         let BpzglList=storage.getSession('BpzglList');

         if(BpzglList){
           return new Observable(observe=>{observe.next(BpzglList)});
         }

         const data = {
           Bpzgl:{"is_inv":"1","sycs":0},
           LoginForm: {
             deptId: this.deptId,
             deptName: this.deptName,
             userId: this.userId,
             userName: this.userName
           }
         };
         return new Observable(observe=>{this.service.getpackages(data).subscribe(res =>{
           if (res['status'] === 'OK') {
             storage.setSession('BpzglList',res.returnValue.BpzglList);
             observe.next(res.returnValue.BpzglList);
            //  return Promise.resolve(res.returnValue.BpzglList);
           }
           else{
            observe.next(null);
             this.toolservice.createMessage('warning',res.message+'包列表获取失败'); 
           }
         })})
       }

  //获取打包人
  getPackageMans(observer) {
    let PackageMans = storage.getSession('PackageMans');
    console.log(PackageMans, 'PackageMans');
    if (PackageMans) {
      observer.next({ arr: PackageMans });
      return;
    }
    const data = {
      PageReq: {},
      Popup: { type: "COMBOGRID_USER", para1: this.deptId },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.printmakeservice.getPackageMans(data).subscribe(res => {
      if (res['status'] === 'OK') {
        console.log(res, '打包人222');
        if (observer) {
          observer.next({ arr: res.returnValue.rows });
        }
        storage.setSession('PackageMans', res.returnValue.rows);
      }
      else {
        this.toolservice.createMessage('warning', res.message + '打包人获取失败');
      }
    })
  }

  //获取灭菌机列表
  getmertirals(resolve) {
    let mertirals = storage.getSession('mertirals');
    console.log(mertirals, 'mertirals');
    if (mertirals) {
      resolve(mertirals);
    }
    const data = {
      AA10: { aaa100: "BZCZ" },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.printmakeservice.getmertirals(data).subscribe(res => {
      if (res['status'] === 'OK') {
        console.log(res, '获取灭菌机列表获取成功');
        storage.setSession('mertirals', res.returnValue.AA10List);
        if (resolve) {
          resolve(res.returnValue.AA10List);
        }

      }
      else {
        this.toolservice.createMessage('warning', '灭菌机获取失败');
      }
    })
  }
  //过滤前缀函数
  pipestart(str, start) {
    let reg = new RegExp(`^${start}`, "i");
    str = str.replace(reg, '');
    return str;
  }
  //检索函数
  checkbid(arr, name, value) {
    let temp;
    arr.forEach((item, i) => {
      //  console.log(item,'item'); 
      if (item[name] == value) {
        temp = item;
        Object.assign(temp, {}, { index: i });
      }
    });
    if (temp) {
      return temp;
    }
    else {
      return false;
    }

  }
  //公共打印函数
  publicprint(printlist, formdata, type, resolve?) {
    let templist = [];
        // let ipajax=res.returnValue.ip;
    let ipajax = storage.get('machineip');
        // console.log(ipajax,'ipajas');
        // let ipajax='192.168.25.70';
    let machinename =  storage.get('machinename');
        // let machinename='192.168.25.70'
    if (!ipajax) {
          
          alert('请设置打印机ip');
          return;
    }
    if (!machinename) {
    
     alert('请设置打印机名称');
     return;
    }

    switch (type) {
      case 'iszjdy': printlist.forEach((item) => {
        let thisobj = { bid: item.key, print_num: item.num, bmc: item.title }
        templist.push(thisobj);
      }); break;
      case 'iscxdy':

        printlist.forEach((item) => {
          let thisobj = { tmid: item.tmid }
          templist.push(thisobj);
        });
        ; break;
      case 'isqxdy':
        printlist.forEach((item) => {
          let thisobj = {
            "qx_id": item.qx_id,
            "bid": item.bid,
            "print_num": item.temp_num,
            "qx_dev_id": item.qx_dev_id,
            "qx_dev_name": item.qx_dev_name,
            "qx_uid": item.qx_uid,
            "qx_uname": item.qx_uname,
            "qx_start_dt": item.qx_start_dt,
            "qx_end_dt": item.qx_end_dt,
            "qx_result": item.qx_result,
            "b_type": item.b_type,
            "qx_d_gc": item.qx_d_gc,
            "qx_t_gc": item.qx_t_gc,
            "pb_name1": item.pb_name,
            "pb_uid1": item.pb_uid,
            "pb_dt1": item.pb_dt
          }

          templist.push(thisobj);
        });
        ; break;
        // case 'iswlbdy':
        // printlist.forEach((item) => {
        //   console.log(item,'外来包数据');
        //   let thisobj = {
        //     "wlb_id":item.id
        //   }

        //   templist.push(thisobj);
        // });
        // ; break;
        

    }

    const data = {
      tmlist: templist,
      tmxx: {}
    };
    Object.assign(data.tmxx, {}, formdata);

    if (type == 'iscxdy') {
      Object.assign(data.tmxx, {}, { iscxdy: '1' });
    }
    if (type=="iswlbdyf") {
      Object.assign(data.tmxx, {}, { iscxdy: '0',wlb_id:printlist[0].id });
    }
    if (type=="iswlbdyr") {
      Object.assign(data.tmxx, {}, { iscxdy: '1',wlb_id:printlist[0].id });
    }
 
    console.log(data, 'printdata');

    let LoginForm = { "deptId": this.deptId, "deptName": this.deptName, "userId": this.userId, "userName": this.userName };
    let httpdata = `tmlist=${JSON.stringify(templist)}&&tmxx=${JSON.stringify(data.tmxx)}&&LoginForm=${JSON.stringify(LoginForm)}`;
    let postdata = { LoginForm: LoginForm, tmlist: templist, tmxx: data.tmxx };

    // 获取打印urlenvironment.production
    //  console.log(environment.production,'环境');
    //   if(environment.production){
    //       let da= this.http.get('/api/products');
    //       da.subscribe((value)=>{
    //           let serviceprint=value['openurl'];
    //           window.open(serviceprint+"/ylzlzz/cssd/dy/pdaprint/TyTmdy5530_0011.jsp?"+httpdata);
    //           setTimeout(()=>{location.reload();},1000)
    //       })
    //   }    
    //   else{
    //       window.open(openurl+"/ylzlzz/cssd/dy/pdaprint/TyTmdy5530_0011.jsp?"+httpdata);
    //   }
    let that = this;
    let observer = new Observable((observer) => { this.getServiceIp(observer); }).subscribe((value) => {
      console.log(value, 'value');
      let ip = value;
      this.printmakeservice.printnew(postdata).subscribe(res => {
       if (res['status'] === 'OK') {
        console.log(res, res.returnValue.ip, '打印成功');

        // let data=
        //   {
        //     // callback:'printCallBack', //回调函数 
        //     printer:'GK-888T', //打印机名称 'AGFA-AccuSet v52.3' 'ZDesigner GK888t' 'Foxit PDF Printer' 'HP LaserJet 3050 PCL5'
        //     preview:false,  //是否预览，只有网页打印支持预览，直接打印没有预览
        //     portrait:'2',   //打印方向  1：横向 其它：纵向
        //     pagetype: '50*30', //纸张类型  如 A4  A3 tmdy_5*3 等 A4,A3这种默认的纸张可以不传宽，高,其它认为是自定义纸张 
        //     pagewidth: 50,  //自定义纸张 宽度  RAW(printtype=1)方式时也用这个 单位mm
        //     pageheight: 30, //自定义纸张 高度
        //     printtype:'2',  //打印类型 1：RAW 直接打印 2：网页打印
        //     printinfo: '<div>zhangfeng</div>'  //$("#output").getPrintArea()   //打印内容，页面html或局部div内容
        //   }
        //   this.printmakeservice.printtest(data).subscribe(res=>{
        //       console.log(res,'测试打印');
        //   })
        // let item=res.returnValue.list[0];
        let table = '';
        let i=0;
        _.forEach(res.returnValue.list, (item,index) => {
          console.log(res.returnValue.wlbList,index,'wlbList');
          item.wlb_fhs_name=res.returnValue.wlbList[index].fhs_name;
          // i++;
          // if(i>1){
          //   table += `<table margin-top:1px;width: 65mm;height: 50mm;border-collapse:collapse;" border="0" cellpadding="0" cellspacing="0">`
          // }else{
            table += `<table style="width: 65mm;height: 50mm;border-collapse:collapse;" border="0" cellpadding="0" cellspacing="0">`
          //}
          table +=`<tr>
                          <td style="padding-left:10pt;width:100%;font-weight:bold;font-size: 14pt">
                          ${item.bmc}
                          </td>
                          <td colspan="2" rowspan="2">
                          <span style="float:right;margin-right:40px"><img src="${ip}/ylzlzz/barcode?msg=TM${item.tmid}&type=datamatrix&qz=disable" height="40" width="40" /></span>
                          </td>
                      </tr>
                      <tr>
                                  <td style="padding-left:10pt;width:100%;font-weight:bold;font-size: 10pt">
                                      ${item.wlb_fhs_name?item.wlb_fhs_name:item.bdname}
                                  </td>
                      </tr>
                      <tr>
                        <td colspan="4" style="margin:0;padding-left:10pt;padding-right:10pt;">
                            <div class="rightDiv" style="text-align: left;">
                            <ul class="show-list" style="list-style: none;list-style-type:none;margin:0;padding:0;">
                                <li class="item"> 
                                    <span class="leftLi">灭菌日期:</span><span class="rightLi">${item.cre_dt?item.cre_dt.substr(0,10):''}</span>
                                </li>
                                <li class="item"> 
                                  <span class="leftLi">失效日期:</span><span class="rightLi">${item.xq_end?item.xq_end.substr(0,10):''}</span>
                                </li>
                                <li class="item last">
                                <span>配包人:${item.pb_uname}</span>
                                <span>&nbsp;&nbsp;打包人:${item.db_uname}</span>
                                </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr>
                                <td  colspan="2" style="padding-left:10pt;width:100%;margin:0;">
                                  <div class="flex-dom" style="text-align: left;">
                                      <span class="font_normal">${item.tmid}</span>
                                      <img src="${ip}/ylzlzz/barcode?msg=TM${item.tmid}&type=code128&qz=disable&hrp=none" style="width:30mm;height:5mm;"/>
                                        <span class="font_normal">回收<br/>追溯</span>       
                                  </div>
                                  <div class="flex-dom" style="text-align: left;">
                                      <span class="font_normal">${item.tmid}</span>
                                      <img src="${ip}/ylzlzz/barcode?msg=TM${item.tmid}&type=code128&qz=disable&hrp=none" style="width:30mm;height:5mm;"/>
                                      <span class="font_normal">病历<br/>记录</span>
                                    </div>
                                  <div class="flex-dom" style="text-align: left;">
                                      <span class="font_normal">${item.tmid}</span>
                                      <img src="${ip}/ylzlzz/barcode?msg=TM${item.tmid}&type=code128&qz=disable&hrp=none" style="width:30mm;height:5mm;"/>
                                      <span class="font_normal">手术<br/>记录</span>
                                  </div>	
                                </td>
                      </tr>
            </table>`
        })
        console.log(ip, 'ip');
        let vm = `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0, user-scalable=no" />
              <title>打印</title>
              <style>
              body {
                font-family: "宋体";
                margin: 0;
                padding: 0;
              }
              td{
                margin:0;
                padding:0;
              }
              .font_normal{
                display:inline-block;
                font-size: 6pt;
                text-align: center;
              }
              .font_blod{
                font-size: 12pt;
                font-weight: bold;
                font-family:"黑体";
              }
              .font_blod1{
                font-size: 10pt;
                font-weight: bold;
                font-family:"黑体";
                display:block;
              }
              .sxys{
                font-weight: bold;
                font-size: 10pt;
                font-family:"黑体";
              }
              .rightDiv{
                padding: 0;
                clear: both;
                font-size:8pt;
              }
              .rightDiv ul{
                padding:0px;
                margin:0px;
              }
              .barcode2{
                float: left;
              }
              .rightDiv ul li{
                list-style-type: none;
              }
              .rightDiv .leftLi{
                width: 36mm;
                display: inline-block;
              }
              .rightDiv .centerLi{
                width: 43mm;
                display: inline-block;
              }
              .rightDiv .rightLi{
                display: inline-block;
                text-align:center;
              }
              .show-list {
                font-size: 10pt;
                border-right: 0pt solid #333;
              }
              .show-list .item {
                padding: 1pt 0;
                border-top: 0pt solid #333;
              }
              .show-list .item.last {
                border-bottom: 0pt solid #333;
              }
              .flex-dom {
                display: flex;
                -webkit-align-items: center;
                -webkit-justify-content: space-between;
              }
            
              </style>
          
            </head>
          
            <body>
              ${table}
            </body>
            <script>
          
                     
            </script>
          
          </html>`
        this.state.previewdata = table;

        $.ajax({
          type: 'post',
          url: `http://${ipajax}:8008/print`,
          data: {
            // callback:'printCallBack', //回调函数 
            printer: machinename + '', //打印机名称 'AGFA-AccuSet v52.3' 'ZDesigner GK888t' 'Foxit PDF Printer' 'HP LaserJet 3050 PCL5'
            preview: false,  //是否预览，只有网页打印支持预览，直接打印没有预览
            portrait: '2',   //打印方向  1：横向 其它：纵向
            pagetype: '65*50', //纸张类型  如 A4  A3 tmdy_5*3 等 A4,A3这种默认的纸张可以不传宽，高,其它认为是自定义纸张 
            pagewidth: 65,  //自定义纸张 宽度  RAW(printtype=1)方式时也用这个 单位mm
            pageheight: 50, //自定义纸张 高度
            printtype: '2',  //打印类型 1：RAW 直接打印 2：网页打印
            printinfo: vm   //$("#output").getPrintArea()   //打印内容，页面html或局部div内容
          },
          dataType: "jsonp",//跨域访问
          crossDomain: true,
          contentType: "application/json;charset=utf-8", //必须有
          async: false,  //(默认: true) 默认设置下，所有请求均为异步请求.
          //timeout: 1000, //设置请求超时时间（毫秒）。此设置将覆盖全局设置。
          complete: function (data, status) {
          },
          success: function (data, status) {
            console.log('测试打印成功', that);
          
            let url = URL.createObjectURL(new Blob([vm], { type: 'text/html' }));
            if(resolve){
              resolve('123');
            }
            window.open(url);
            // location.reload();

            // that.router.navigate(['/preview'])
            // window.open
            // var div=document.createElement('div');
            // div.innerHTML='打印成功';
            // document.body.appendChild(div)
            // setTimeout(function(){
            //   // window.close();
            // },1000)
          },
          error: function (data, status) {
            alert("error:" + status);
            return false;
          }
        });
      }else{
        this.toolservice.createMessage('warning',res.message);
      }




        // }
        // else{
        //   this.toolservice.createMessage('warning', res.message+'打印失败');        
        // }
      })


    });
  }

 getip(observerip){
   let ip;
  let observer=new Observable((observer)=>{this.getServiceIp(observer);}).subscribe((value)=>{
    ip=value;
  });
  $.ajax({
    type:'post',
    url:ip+'/ylzlzz/dyAction.do?method=getIp',
    success:function(data){
      console.log(data,'date')
      if(data!=null){
        var obj = eval('('+data+')');
        if(obj.resultflag=="0"){
          console.log(obj.resultmsg)
          observerip.next(obj.resultmsg);
        }
      }
  },error:function(data) {
    alert("程序出错，请联系管理员！");

  }


    //   console.log(data)
    //   observerip.next(data);
    // },error:function(data) {
    //   observerip.next('');
    // }
  });
}

  //获取服务器ip服务

  getServiceIp(observer) {
    // debugger;
    if (this.serviceIp) {
      observer.next(this.serviceIp);
    }
    else {
      if (environment.production) {
        let da = this.http.get('/api/products');
        da.subscribe((value) => {
          this.serviceIp = value['openurl'];
          observer.next(value['openurl']);
        })
      }
      else {
        observer.next(openurl);
      }
    }

  }







}

