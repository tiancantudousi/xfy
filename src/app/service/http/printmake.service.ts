import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
// import storage from '../storage';
import { ToolsService } from '../tools/tools.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintMakeService {

  constructor(
    // public http: HttpClient,
    public tools: ToolsService,
    public service: BaseService
  ) {
  }
  printtest(data){
       return this.service.testinfo(data);
  }
// 获取所有包
  getPackages (data) {
    return this.service.postInfo(this.tools.requestwashFormat('BTreeService', 'getDyTree' , data));
  }
// //获取下拉列表所有包
//   getulPackages(data) {
//     return this.service.postInfo(this.tools.requestwashFormat('PopupService', 'getComboGrid' , data));
//   }
//获取灭菌机列表
  getsterilizers(data) {
    return this.service.postInfo(this.tools.requestwashFormat('SbxxService', 'getSbxxListForMobile' , data));
  }
  //获取单个灭菌机数量默认值
  getsterilizer(data){
    return this.service.postInfo(this.tools.requestwashFormat('MjService', 'getAllMjjState' , data));
  }
  //获取包装材质列表
  getmertirals(data){
    return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'getAa10ListForMobile' , data));
  }
  //获取打印样式列表
  getprintTypes(data){
    return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'getAa10ListForMobile' , data));
  }
  //获取清洗机
  getwashers(data){
    return this.service.postInfo(this.tools.requestwashFormat('SbxxService', 'getSbxxListForMobile' , data));
  }
  //获取灭菌方式
  getsterilizerType(data){
    return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'getAa10ListForMobile' , data));
  }
   //获取打包位置
   getPackagePlace(data){
    return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'getAa10ListForMobile' , data));
  }
  //清洗打印查询
  searchwashprint(data){
    return this.service.postInfo(this.tools.requestwashFormat('DyService', 'getQxdyTmxx' , data));
  }
  //获取打包人
  getPackageMans(data){
    return this.service.postInfo(this.tools.requestwashFormat('PopupService', 'getComboGrid' , data));
  }
  //清洗打印所有
  washprintall(data){
    return this.service.printInfo(data);
  }
  //重新打印查询接口
  reprint(data){
    return this.service.postInfo(this.tools.requestwashFormat('DyService', 'getCxdyTmxx' , data));
  }

  //打包
  buildPackage(data){
    return this.service.postInfo(this.tools.requestwashFormat('DbService', 'doDb' , data));
  }
  //直接配包
  directConfect(data){
    return this.service.postInfo(this.tools.requestwashFormat('PbService', 'doPb' , data));
  }
  //撤销直接配包
  cancleDirectPackage(data){
    return this.service.postInfo(this.tools.requestwashFormat('PbService', 'revPb' , data));
  }
  //撤销
  canclePackage(data){
    return this.service.postInfo(this.tools.requestwashFormat('DbService', 'revDb' , data));
  }
 
  //配包
  confectPackage(data){
    return this.service.postInfo(this.tools.requestwashFormat('DbService', 'doPbAsPc' , data));
  }
  //配包查询
  confectPackageSearch(data){
    return this.service.postInfo(this.tools.requestwashFormat('DyService', 'getQxdyTmxx' , data));
  }
  //删除接口
  delete(data){
    return this.service.postInfo(this.tools.requestwashFormat('DyService', 'delQxdyb' , data));
  }
    //加aa10表
    addAa10(data){
      return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'addAa10' , data));
    }
  //修改aa10表
  updateAa10(data){
   return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'updateAa10' , data));
    }
    //查aa10表
    selectAa10List(data){
      return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'selectAa10List' , data));
    }


  //打印服务 printInfo
  printnew(data){
    return this.service.postInfo(this.tools.requestwashFormat('QxService', 'dyys' , data));
  }

}
