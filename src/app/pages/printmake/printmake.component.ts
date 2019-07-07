import { Component, OnInit ,AfterViewInit,ViewChild} from '@angular/core';
import storage from './../../service/storage';
import {WashService } from './../../service/http/wash.service';
import {Router} from '@angular/router';
import { PrintMakeService } from '../../service/http/printmake.service';
import { PublicuseService } from '../../service/http/publicuse.service';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-printmake',
  templateUrl: './printmake.component.html',
  styleUrls: ['./printmake.component.scss']
})
export class PrintmakeComponent implements OnInit {

  private deptId;
  private deptName;
  private userId;
  private userName;
  private serviceip;
  
  constructor(private washservice:WashService,private router:Router, private service:PrintMakeService, private publicservice:PublicuseService) {
    const message = storage.get('userMessage');
    
        this.userName = message['userName'];
        this.userId = message['userId'];
        this.deptId = message['deptId'];
        this.deptName = message['deptName'];
  
   }

  ngOnInit() {
   this.serviceip= sessionStorage.getItem('ip');
   console.log(this.serviceip);
    this.sure();
  }

  sure(){

    console.log(this.serviceip)
    const data = {
      // "service":"ParamService","method":"addAa10"
      AA10:{"aaa100":"PC_DYIP","aaa102":this.serviceip},
    };
    this.service.selectAa10List(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        if(res['returnValue']&&res['returnValue']['AA10List']&&res['returnValue']['AA10List'][0]){
          storage.set('machineip',res['returnValue']['AA10List'][0].aaa103)
          this.getmachinename();
        }else{
          // storage.remove('machineip');
          // storage.remove('machinename');
        }
      }
    })

  }
  getmachinename(){
    const data = {
      // "service":"ParamService","method":"addAa10"
      AA10:{"aaa100":"PC_DYNAME","aaa102":this.serviceip},
    };
    this.service.selectAa10List(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        if(res['returnValue']&&res['returnValue']['AA10List']&&res['returnValue']['AA10List'][0]&&res['returnValue']&&res['returnValue']['AA10List']&&res['returnValue']['AA10List'][0].aaa103){
          storage.set('machinename',res['returnValue']['AA10List'][0].aaa103)
        }else{
          // storage.remove('machineip');
          // storage.remove('machinename');
        }
      }
    })
  }

}
