import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import storage from '../storage';
import { ToolsService } from '../tools/tools.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    public http: HttpClient,
    public tools: ToolsService,
    public service: BaseService
  ) {
  }
// 获取所有清洗机
  getdata(data) {
    return this.service.postInfo(this.tools.requestAfterFormat(data));
  }
  autoSl(data) {
    return this.service.postInfo(this.tools.requestFormat('SlService', 'addSlAuto' , data));
  }
  // 设置包是否加急
  setPackageIsUrgent(data) {
    return this.service.postInfo(this.tools.requestFormat('TmxxService', 'dojj' , data));
  }

    // 获取 包 内容 物品通过bid
    getPackageMessagebybid (data) {
      return this.service.postInfo(this.tools.requestFormat('BpzService', 'getBnrPageList' , data));
    }

      //获取损耗类型
  getlossType(data){
    return this.service.postInfo(this.tools.requestFormat('ParamService', 'getAa10ListForMobile' , data));
  }
      //获取科室
      getksbyid(data){
        return this.service.postInfo(this.tools.requestFormat('DepartmentService', 'getDepartmentList' , data));
      }

    //损耗登记保存
    storageloss(data){
      return this.service.postInfo(this.tools.requestFormat('ShService', 'addSh' , data));
    }

  //无条码批量回收
  recoverheaderBynotmid(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'doHsBatchBynoTmid' , data));
  }
    //待回收接口
    Toberecover(data){
      return this.service.postInfo(this.tools.requestFormat('HsService', 'getTmxxListForHs' , data));
    }
      //今日回收数量
  todayrecovercount(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'getHsSl' , data));
  }
        //今日回收数量
  mjdbdj(data){
    return this.service.postInfo(this.tools.requestFormat('MjService', 'domjdbDj' , data));
  }
}
