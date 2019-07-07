import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import storage from '../storage';
import { ToolsService } from '../tools/tools.service';

@Injectable({
  providedIn: 'root'
})
export class WashService {

  constructor(
    public http: HttpClient,
    public tools: ToolsService,
    public service: BaseService
  ) {
  }
// 获取所有清洗机
  getwashersdata (data) {
    return this.service.postInfo(this.tools.requestwashFormat('QxService', 'getAllQxjState' , data));
  }
// 获取清洗程序
  getwashprogram(data){
    return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'getAa10ListForMobile' , data));
  }
//开始清洗
 startwash(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'startQx' , data));
 }
//获取清洗机明细
 getwasherdetail(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'getQxDtlList' , data));
 }
 //添加和撤销包
 cancleaddpackage(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'addQxDtl' , data));
 }
 //获取所有包并缓存
 getpackages(data){
  return this.service.postInfo(this.tools.requestwashFormat('BpzService', 'getBpzglByks' , data));
 }
//扫面清洗盘
 scanpan(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxpService', 'getQxpDtl' , data));
 }
 //作废
 cancellation(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'invQx' , data));
 }
 //获取清洗结果
 getresult(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'getQxResultList' , data));
 }
 //获取换锅原因
 getresons(data){
  return this.service.postInfo(this.tools.requestwashFormat('ParamService', 'getAa10ListForMobile' , data));
 }
 //确定换锅
 surechangepan(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'chgQx' , data));
 }
 //修改
 revise(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'modQx' , data));
 }
 //合格
 qualified(data){
  return this.service.postInfo(this.tools.requestwashFormat('QxService', 'addQxResult' , data));
 }
}
