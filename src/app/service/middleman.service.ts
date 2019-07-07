import { Injectable,OnInit,EventEmitter } from '@angular/core';

@Injectable({providedIn: 'root'})
export class EmitService implements OnInit {
  public eventEmit:any;
  public eventEmittodayrecover:any;
  public eventEmittoberecovercount:any;
  public eventEmithaverecovercount:any;
  public eventEmithtotaltoday:any;
  public eventEmithcount:any;//发送清洗机数量到header
  public eventEmithmakepackage;//发送配包开始到header
  public eventEmitdifferntimes;
  public eventEmittempcount;
  public eventEmitChangePan;
  public eventEmittable;
  public recoverysuccess;
  public showloading;
  public hsr;
  public ffr;
  constructor() { 
    this.eventEmit=new EventEmitter();
    this.eventEmittodayrecover=new EventEmitter();
    this.eventEmittoberecovercount=new EventEmitter();
    this.eventEmithaverecovercount=new EventEmitter();
    this.eventEmithtotaltoday=new EventEmitter();
    this.eventEmithcount=new EventEmitter();
    this.eventEmithmakepackage=new EventEmitter();
    this.eventEmitdifferntimes=new EventEmitter();
    this.eventEmittempcount=new EventEmitter();
    this.eventEmitChangePan=new EventEmitter();
    this.eventEmittable=new EventEmitter();
    this.recoverysuccess=new EventEmitter();
    this.showloading=new EventEmitter();
    this.hsr=new EventEmitter();
    this.ffr=new EventEmitter();
  }
  ngOnInit(){

  }

}
