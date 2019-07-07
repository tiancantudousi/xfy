import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import storage from '../storage';
import { ToolsService } from '../tools/tools.service';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {

  constructor(
    public http: HttpClient,
    public tools: ToolsService,
    public service: BaseService
  ) {
  }
  // 获取当天回收未绑定盘
  getUncollectedPacaageOnToday (data) {
    return this.service.postInfo(this.tools.requestFormat('HsService', 'getHsTmxxByWbd' , data));
  }

  // 设置包是否加急
  setPackageIsUrgent(data) {
    return this.service.postInfo(this.tools.requestFormat('TmxxService', 'dojj' , data));
  }

  // 获得人员信息
  getPersonMessageByPersonId (data) {
    return this.service.postInfo(this.tools.requestFormat('UserinfoService', 'getOneUserinfo' , data));
  }
  // 回收条码
  recoveryBarCode (data) {
    return this.service.postInfo(this.tools.requestFormat('HsService', 'addHsLog' , data));
  }

  // 撤销回收
  cancelRecovery (data) {
    return this.service.postInfo(this.tools.requestFormat('HsService', 'revokeHs' , data));
  }

  // 获取 包 内容 物品
  getPackageMessage (data) {
    return this.service.postInfo(this.tools.requestFormat('TmxxService', 'getBnrbyBidorTmid' , data));
  }
  //待回收接口
  Toberecover(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'getTmxxListForHs' , data));
  }
  //获取损耗类型
  getlossType(data){
    return this.service.postInfo(this.tools.requestFormat('ParamService', 'getAa10ListForMobile' , data));
  }
  //损耗登记保存
  storageloss(data){
    return this.service.postInfo(this.tools.requestFormat('ShService', 'addSh' , data));
  }
  //搜索清洗盘
  // searchpalte(data){
  //   return this.service.postInfo(this.tools.requestFormat('HsService', 'getQxpMx' , data));
  // }
  //今日回收数量
  todayrecovercount(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'getHsSl' , data));
  }
  //绑定清洗盘
  bindclean(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'doQxpBd' , data));
  }
  //点击清洗盘接口
  getPanData(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'getQxpNrMx' , data));  
  }
  //点击清洗盘接口
  cancelPackage(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'revQxpBd' , data));  
  }
  //回收接口unchart
  recoverheader(data){
    return this.service.postInfo(this.tools.requestFormat('HsService', 'doHsBatch' , data));
  }
  unchart(data){
    return this.service.postInfo(this.tools.requestFormat('HsService','modHsqxdyBhgyy', data));
  }
  


  getPlateFromPackage (data) {
    return this.service.postInfo(this.tools.requestFormat('HsService', 'getQxpMx' , data));
  }
  gethomepower (data) {
    return this.service.postInfo(this.tools.requestFormat('PermissionService', 'getUserMetaList' , data));
  }
}
