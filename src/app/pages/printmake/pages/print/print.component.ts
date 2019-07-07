import { Component, OnInit,ViewChild } from '@angular/core';
import { NzTreeNode } from 'ng-zorro-antd';
import { PrintMakeService } from './../../../../service/http/printmake.service';
import storage from './../../../../service/storage';
import {ToolsService} from './../../../../service/tools/tools.service';
import { PublicuseService} from './../../../../service/http/publicuse.service';
import {Router,ActivatedRoute,ParamMap} from '@angular/router';
import { PrintmakeHelpComponent } from 'src/app/pages/printmake/component/printmake-help/printmake-help.component';
import { BaseService } from 'src/app/service/http/base.service';



@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  @ViewChild('childone')
  childone:PrintmakeHelpComponent;

  // public listheader=[`<label nz-checkbox [(ngModel)]="checked">Checkbox</label>`,'包名称','打印数量','操作'];
  public allChecked=false;
  public printlist=[];

  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;
  public nodes=[];
  public shownodes=true;
  public selectedValue;
  public slidelist=[];
  private BpzglList;
  public showtopul=false;
  private tempSelectPackage;
  public selectshow=false;
  public indeterminate;
  public totalprint=0;

  public size="default";

  // public sterilizer;
  // public sterilizers=[];
  // public sterilizationtimes;
  // public dateFormat="yyyy-MM-DD HH:mm:ss";
  // public formtimestart;
  // public mertiral;//包装材质
  // public mertirals=[];//包装材质
  // public makePackagePerson;//配包人
  // public killpisonPerson;
  // public printType;
  // public printTypes=[];

  public clearallbtn="default";
  public printallbtn="primary";
  constructor(
    private service:PrintMakeService,
    private toolservice:ToolsService,
    private publicuseservice:PublicuseService,
    private routerinfo:ActivatedRoute,
    private printUrlservice:BaseService,

  ) { 
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
  }
  
    ngOnInit() {
      this.getPackages();
      // this.BpzglList=this.publicuseservice.getulPackages();//获取下拉列表
      console.log(this.routerinfo,this.routerinfo.snapshot.paramMap.get('id'),'routerinfo');
      // let promise=new Promise((resolve,reject)=>{
      //     this.publicuseservice.getmertirals(resolve);
      // })
      // promise.then(reject=>{
      //   this.mertirals=[].concat(reject);
      // })
      // this.getprintTypes();
  }

  //获取所有包
  getPackages(){
    const data = {
      Dytree:{},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getPackages(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        console.log(res,'添加包');
        this.buildtree(res.returnValue.children);
      }
      else{
        this.toolservice.createMessage('warning', '包列表获取失败');        
      }
    })
  }
  //构造树形结构
  buildtree(packages){

    let nodesobj=[]
    packages.forEach(element => {
       if(element.pid=='0'){
        nodesobj.push({title:element.text,key:element.id,children:[]});
       }
       else{
        nodesobj.forEach((item)=>{
             if(item.key==element.pid){
               item.children.push({title:element.text,key:element.attributes['bid'],isLeaf: true})
             }
        })
       }
    });
    nodesobj.forEach((item)=>{
      this.nodes.push(new NzTreeNode(item));
    })
  }
  //搜索包
  searchPackage(e){

    this.showtopul=this.selectedValue==''?false:true;
    if(this.selectedValue==''){
      this.selectshow=false;
      this.shownodes=true;
    }
    else{
      this.shownodes=false;
    }
    //模糊匹配
    console.log(this.BpzglList,this.selectedValue,'this.BpzglList');
    let list=this.BpzglList.filter((item)=>{
      let reg = new RegExp(`^${this.selectedValue}`,"i");      
      return reg.test(item.bmc)||reg.test(item.py_code);
   });
   console.log(list,'list');
   this.slidelist=[...list];
    if (e.keyCode === 13 && this.selectedValue.trim()) {

    }
  }
  
  // getulPackages(){
  //   const data = {
  //     PageReq:{},
  //     Popup:{type:"COMBOGRID_BPZ",yxbz:""},
  //     LoginForm: {
  //       deptId: this.deptId,
  //       deptName: this.deptName,
  //       userId: this.userId,
  //       userName: this.userName
  //     }
  //   };
  //   this.service.getulPackages(data).subscribe(res =>{
  //     if (res['status'] === 'OK') {
  //       console.log(res,'包列表');
  //       this.BpzglList=res.returnValue.rows;
  //     }
  //     else{
  //       this.toolservice.createMessage('warning', '包列表获取失败');        
  //     }
  //   })
  // }
  choosepackage(item,e){
    this.showtopul=false;
    // this.tempSelectPackage=item;
    // this.selectshow=true;
    this.selectedValue=item.bmc;
   
    let tempitem={checked:true,key:item.bid,num:1,title:item.bmc};
    console.log(item,this.printlist,tempitem);
    this.addPackageList(tempitem);
    this.countall();
  }

  expandKeys = [ '1001', '10001' ];

  



  mouseAction(name: string, e: any): void {
    console.log(name, e.node.origin);
    this.addPackageList(e.node.origin);
  }
  //添加包到选中包列表
  addPackageList(item){
    if(item.children){//不是父节点就添加
      return;
    }
    let choseitemindex;
    if(this.printlist.length==0){
     Object.assign(item,{},{num:0,checked:true});
     this.printlist=this.printlist.concat(item);
    }
     const {0:index}=this.printlist.filter((value,i)=>{
           if(value.key==item.key){
            choseitemindex=i;
           }
          return value.key==item.key;
     })
     if(!index){
      Object.assign(item,{},{num:1,checked:true});
      this.printlist=this.printlist.concat(item);
     }
     else{
      this.printlist[choseitemindex].num++
     }
     this.countall();
     console.log(index,this.printlist,'index');
  }
  //全选效果
  updateAllChecked(): void {
    console.log(this.printlist,this.allChecked);
    this.indeterminate = false;
    if (this.allChecked) {
      this.printlist.forEach(item => item.checked= true);
    } else {
      this.printlist.forEach(item => item.checked = false);
    }
  }
  //单选
  updateSingleChecked(): void {
    if (this.printlist.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.printlist.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  //删除项
  delete(item){
      this.toolservice.createWarningDialog('是否删除','',()=>{
        let index;
        this.printlist.forEach((value,i)=>{
          if(value.key==item.key){
               index=i;
          }
        });
        this.printlist.splice(index,1);
        this.countall();
      },null)
  
  }
  //更新汇总
  countall(){
    let total=0;
    this.printlist.forEach((item)=>{
         total+=Number(item.num);
    });
    this.totalprint=total;
  }
  //手动修改包数量
  numchange(){
    console.log(this.printlist);
    this.countall();
  }

  clearall(){
    this.clearallbtn="primary";
    this.printallbtn="default";
    let arr=[];
    this.printlist=arr.concat();
  }
  printall(single){
 
    //   this.printUrlservice.printInfotwo().subscribe((res)=>{
    //       alert('dayinfanhui');
    //       if(res.status=="OK"){
    //         alert("123");
    //         // console.log(res);
    //       }
        
    //   })

    this.clearallbtn="default";
    this.printallbtn="primary";
    let formdata=this.childone.getform();
    let temparr=[];

  
    if(single){
      temparr.push(single);
    }
    else{
      temparr=this.printlist.filter((item)=>{
        return item.checked;
      });
    }
    if(temparr.length==0){
        this.toolservice.createMessage('warning','请勾选打印项');
        return;
    }
    this.publicuseservice.publicprint(temparr,formdata,'iszjdy');
   
  }
 

 

}
