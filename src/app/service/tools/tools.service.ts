import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { WarningDialogComponent } from '../../componets/dialog/warning-dialog/warning-dialog.component';
import {DatePipe} from "@angular/common";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';


@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(
    public modal: NzModalService,
    private message: NzMessageService,
    public datepipe:DatePipe,
 
  ) {

  }

  fromDate(isFull = false) {
    const today = new Date();
    const year = today.getFullYear();
    let month = '' + (today.getMonth() + 1);
    let day = '' + today.getDate();
    let hours = '' + today.getHours();
    let mints = '' + today.getMinutes();
    let sec = '' + today.getSeconds();

    month.length < 2 ? month = '0' + month : month = month;
    day.length < 2 ? day = '0' + day : day = day;
    hours.length < 2 ? hours = '0' + hours :  hours = hours;
    mints.length < 2 ? mints = '0' + mints : mints = mints;
    sec.length < 2 ? sec = '0' + sec : sec = sec;
    if (isFull) {
      return year + '-' + month + '-' + day + ' ' + hours + ':' + mints + ':' + sec;
    }
    return year + '-' + month + '-' + day;
  }
  
  requestFormat(service, mehtod, data) {
    return {
      'sysid': 'web',
      'sign': 'DA944624C718CAA806A5E5555D78ED9B',
      'timestamp': data.posttime?data.posttime:this.fromDate(true),
      'req': {
        'service': service,
        'method': mehtod,
        'args': data
      }
    };
  }
  requestwashFormat(service, mehtod, data) {
    return {
      'sysid': 'web',
      'sign': 'DA944624C718CAA806A5E5555D78ED9B',
      'timestamp': data.posttime?data.posttime:this.fromDate(true),
      'req': {
        'service': service,
        'method': mehtod,
        'args': data
      },
      "v":"1.0"
    };
  }

  requestAfterFormat(data) {
    return {
      'sysid': 'web',
      'sign': 'DA944624C718CAA806A5E5555D78ED9B',
      'timestamp': data.posttime?data.posttime:this.fromDate(true),
      'req': {
        'service':data.service,
        'method': data.method,
        'args': data
      },
      "v":"1.0"
    };
  }

  createWarningDialog(title, content, ok, cancel = null) {
    this.modal.warning({
      nzTitle     : title,
      nzContent   : content,
      nzOkText    : '是',
      nzOkType    : 'primary',
      nzOnOk      : () => {
        if (ok) {
          ok();
        }
      },
      nzCancelText: '否',
      nzOnCancel  : () => {
        if (cancel) {
          cancel();
        }
      }
    });
  }
  // 创建message
  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
   //时间转化函数
   timepipe(time,type){
    let nowday=this.datepipe.transform(time,type);
    return nowday;
  }
  //日期限制函数
  disableDate(today){
   return (current: Date): boolean => {
      // Can not select days before today and today
      return differenceInCalendarDays(current,today) > 0;
    };
  }
    //检索函数
 checkbid(arr,name,value){
        let temp;
        arr.forEach((item,i)=>{    
         //  console.log(item,'item'); 
            if(item[name]==value){       
              temp=item;
              Object.assign(temp,{},{index:i});
            }
         });
         if(temp){
           return temp;
         }
         else{
           return false;
         }
         
  }



}
