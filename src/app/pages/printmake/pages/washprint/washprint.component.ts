import { Component, OnInit, ViewChild ,ElementRef} from '@angular/core';
import { PrintMakeService } from './../../../../service/http/printmake.service';
import storage from './../../../../service/storage';
import {ToolsService} from './../../../../service/tools/tools.service';
import { PublicuseService} from './../../../../service/http/publicuse.service';
import { Route,ActivatedRoute,Params} from '@angular/router';
import { PrintmakeHelpComponent} from './../../component/printmake-help/printmake-help.component';



@Component({
  selector: 'app-washprint',
  templateUrl: './washprint.component.html',
  styleUrls: ['./washprint.component.scss']
})
export class WashprintComponent implements OnInit {
  @ViewChild('child')
  child:PrintmakeHelpComponent;
  @ViewChild('packageinput')
  Packageinput:ElementRef;
  @ViewChild('packageinputcx')
  Packageinputcx:ElementRef;

  public printstate='isqxdy';
  public washprintlist=[];
  public size="default";
  private page=1;
  
  
  public sterilizer;
  public sterilizers=[];
  public sterilizationtimes;
  public dateFormat="yyyy-MM-DD HH:mm:ss";
  public dateFormatd="yyyy-MM-DD";
  public formtimestart;
  public formtimeend;
  public mertiral;//包装材质
  public mertirals=[];//包装材质
  public makePackagePerson;//配包人
  public killpisonPerson;
  public printType;
  public printTypes=[];

  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;
  public sterilizerType;
  public sterilizerTypes=[];
  public washers=[];
  public washer;
  public packageplaces=[];
  public packageplace;
  public disabledDate;

  //s搜索包的列表
  public slidelist=[];
  public packagename;
  public showtopul=false;
  private BpzglList;
  private chosenpackage;

  public allChecked=true;
  public indeterminate=false;
  public makePackagePersons;//打包人列表


  public totalprint=0;

  private chosefun;//选择调用不用的函数

  public barcode;
  
  

  constructor(
    private service:PrintMakeService,
    private toolservice:ToolsService,
    private publicuseservice:PublicuseService,
    private routerInfo:ActivatedRoute,
  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.disabledDate=this.toolservice.disableDate(new Date());
    // this.BpzglList=this.publicuseservice.getulPackages();
   }

  ngOnInit() {
    this.getwashers();
    this.getsterilizerType();
    this.getPackagePlace();
    this.routerInfo.params.subscribe((params:Params)=>{
       this.washprintlist=[].concat();
       this.chosefun=params.id=='1'?this.searchwashprint:this.reprint;
       this.printstate=params.id=='0'?'iscxdy':'isqxdy';
         console.log(params);
         if(this.printstate=='isqxdy'){
            
            // this.Packageinput.nativeElement.focus(); 
            this.formtimestart=null;
         }
         else{
             let that=this;
            //  setTimeout(()=>{
            //       that.Packageinputcx.nativeElement.focus();
            //  },0)
           
             this.allChecked=false;
             this.formtimestart=new Date();
         }
         this.searchwashprintnow();
       
     })
     console.log('this.Packageinputcx', this.Packageinput);
    //  this.Packageinput.nativeElement.focus(); 
   
  }
  onChosePack(e){
    console.log(e,'选择结果');
    this.packagename=e.bmc;
    this.chosenpackage=e;
  }

  searchwashprintnow(){
     this.chosefun();
  }
  //重新查询打印接口
  reprint(){
    const data = {
      PageReq:{"page":'',"rows":''},
      Tmxx:{deptid:this.deptId,
      kssj:this.toolservice.timepipe(this.formtimestart,'yyyy-MM-dd')+' 00:00:00',
      jssj:this.toolservice.timepipe(this.formtimestart,'yyyy-MM-dd')+' 23:59:59',
      qx_dev_id:this.washer,
      bid:this.chosenpackage?this.chosenpackage.bid:'',
      tmid:this.barcode},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.reprint(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        console.log(res,'查询成功');
        this.page++;
        res.returnValue.rows.forEach((item)=>{
          item.checked=false;
        })
       this.washprintlist=[].concat(res.returnValue.rows);
      //  this.washprintlist.forEach((item)=>{
      //    item.temp_num=item.b_num;
      //  })
      }
      else{
        this.toolservice.createMessage('warning', res.message+'查询失败');        
      }
    })
   
  }

  //获取灭菌机
  getwashers(){
    const data = {
      Sbxx:{did:this.deptId,is_inv:"1",sb_type:"1~2~9"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getwashers(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        this.washers=[...res.returnValue.SbxxList];
        console.log(res,'获取清洗机成功');
      }
      else{
        this.toolservice.createMessage('warning', res.message+'获取清洗机失败');        
      }
    })
  }
  //获取灭菌方式
  getsterilizerType(){
    const data = {
      AA10:{aaa100:"XD_WAY"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getsterilizerType(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        console.log(res,'获取灭菌方式成功');
        this.sterilizerTypes=[...res.returnValue.AA10List];
      }
      else{
        this.toolservice.createMessage('warning', res.message+'获取灭菌方式失败');        
      }
    })
  }
  //获取打包位置
  getPackagePlace(){
    const data = {
      AA10:{aaa100:"DB_LOCATION"},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getPackagePlace(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        console.log(res,'获取打包位置成功');
        this.packageplaces=[...res.returnValue.AA10List];
      
      }
      else{
        this.toolservice.createMessage('warning', res.message+'获取打包位置失败');        
      }
    })
  }
  //清洗打印查询
  searchwashprint(){
    const data = {
      PageReq:{},
      Qx:{did:this.deptId,
        mj_dev_id:"",
        mj_d_gc:"",
        cz_id:"",
        pb_uid:"",
        db_uid:"",
        mj_uid:"",
        basket_id:"",
        dy_dyys:"",
        qx_dev_id:this.washer,
        bid:this.chosenpackage?this.chosenpackage.bid:'',
        kssj:this.toolservice.timepipe(this.formtimestart,'yyyy-MM-dd HH:mm:ss'),
        jssj:this.toolservice.timepipe(this.formtimeend,'yyyy-MM-dd HH:mm:ss'),
        xd_way:this.sterilizerType,
        db_location:this.packageplace},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.searchwashprint(data).subscribe(res =>{
      if (res['status'] === 'OK') {
        console.log(res,'查询成功');
       this.washprintlist=[].concat(res.returnValue.rows);
       this.washprintlist.forEach((item)=>{
         item.checked=true;
         item.temp_num=item.b_num;
       })
      }
      else{
        this.toolservice.createMessage('warning', res.message+'查询失败');        
      }
    })
  }
   //搜索包
  //  packageidkeyup(e) {
  //   this.chosenpackage=null;
  //   this.showtopul=this.packagename==''?false:true;//显示或影藏下拉列表
  //   let list=this.BpzglList.filter((item)=>{
  //       let reg = new RegExp(`^${this.packagename}`,"i");      
  //       return reg.test(item.bmc)||reg.test(item.py_code);
  //    });
  //    this.slidelist=list;
  //    console.log(this.slidelist,'this.slidelist');
  //    if (e.keyCode === 13 && this.packagename.trim()) {
  //      this.showtopul=false;
      
       
  //    }
  //  }
   //选定下拉列表中的包
  // choosepackage(item,e){
  //   e.stopPropagation();
  //   this.showtopul=false;
  //   this.packagename=item.bmc;
  //   this.chosenpackage=item;
  //   console.log(item);
  // }
  //修改打印数量给提示
  numchange(item){
    let reg = new RegExp(`^0[0-9]`,"i");
      if(Number(item.b_num)<Number(item.temp_num)||(reg.test(item.temp_num))){
        item.warning=true;
      }
      else{
        item.warning=false;
      }
  }
    //全选效果
    updateAllChecked(): void {
      console.log(this.washprintlist,this.allChecked);
      this.indeterminate = false;
      if (this.allChecked) {
        this.washprintlist.forEach(item => item.checked= true);
      } else {
        this.washprintlist.forEach(item => item.checked = false);
      }
    }
    //单选
    updateSingleChecked(): void {
      if (this.washprintlist.every(item => item.checked === false)) {
        this.allChecked = false;
        this.indeterminate = false;
      } else if (this.washprintlist.every(item => item.checked === true)) {
        this.allChecked = true;
        this.indeterminate = false;
      } else {
        this.indeterminate = true;
      }
    }
     //清除所有
     clearall(){
      this.washprintlist=[];
    }
    //打印所有
    printall(single){
      let formdata=this.child.getform();
      let choseChecked=[];
 
    
      if(single){
        choseChecked.push(single);
      }
      else{
        choseChecked=this.washprintlist.filter((item)=>{
          return item.checked;
        });
      }
      if(choseChecked.length==0){
          this.toolservice.createMessage('warning','请勾选打印项');
          return;
      }
      this.publicuseservice.publicprint(choseChecked,formdata,this.printstate); 
      
    }
    // delete(item){
    //     console.log(item);
   
    // }
    //删除接口
    delete(item){
        const data = {
          beo:{qx_id:item.qx_id,bid:item.bid},
          LoginForm: {
            deptId: this.deptId,
            deptName: this.deptName,
            userId: this.userId,
            userName: this.userName
          }
        };
        this.toolservice.createWarningDialog('是否删除','',()=>{
            this.service.delete(data).subscribe(res =>{
                if (res['status'] === 'OK') {
                  console.log(res,'删除成功');
                  this.toolservice.createMessage('success', '删除成功');     
                  this.washprintlist=this.washprintlist.filter((value)=>{
                        return item!=value;
                  })
                }
                else{
                  this.toolservice.createMessage('warning', res.message+'删除失败');        
                }
              })
        },null);
       
      }

    
   


}
