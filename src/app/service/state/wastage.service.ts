import { Injectable,OnInit,EventEmitter } from '@angular/core';

@Injectable({providedIn: 'root'})
export class BrokedataService implements OnInit {
  public tmid:any;
  public bid:any;
  public bmc:any;
  public brokematerial:any;
  public broketype:any;
  public brokenum:number;
  public today:any;
  public ksname:any;
  public ksid:any;
  public loginpassword;
  public targetWash;
  public previewdata;
  public dbperson;

  // public openurl:'http://192.168.25.70:8080';

  public toberecoverdata;
  constructor() { 
   
  }
  ngOnInit(){

  }

}
