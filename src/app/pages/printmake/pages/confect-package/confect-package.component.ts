import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PublicuseService } from 'src/app/service/http/publicuse.service';
import { ToolsService } from 'src/app/service/tools/tools.service';
import storage from './../../../../service/storage'
import { PrintMakeService } from 'src/app/service/http/printmake.service';
import { RecoveryService } from 'src/app/service/http/recovery.service';
import { PrintmakeHelpComponent } from 'src/app/pages/printmake/component/printmake-help/printmake-help.component';


@Component({
  selector: 'app-confect-package',
  templateUrl: './confect-package.component.html',
  styleUrls: ['./confect-package.component.scss']
})
export class ConfectPackageComponent implements OnInit {
  // public confectState='confect';
  // @ViewChild('packageinput')
  // Packageinput:ElementRef;
  @ViewChild('child')
  child: PrintmakeHelpComponent;


  @ViewChild('pbrinput')
  Pbrinput: ElementRef;
  @ViewChild('qxptminput')
  Qxptminput: ElementRef;

  public sterilizer;
  public sterilizers = [];
  public sterilizationtimes;
  public dateFormat = "yyyy-MM-DD HH:mm:ss";
  public dateFormatd = "yyyy-MM-DD";
  public formtimestart;
  public formtimeend;
  public mertiral;//包装材质
  public mertirals = [];//包装材质
  public makePackagePerson;//配包人
  public killpisonPerson;
  public printType;
  public printTypes = [];
  public disabledDate;

  public configPerson;
  public configPersons;

  public showtopul = false;
  public packagename;
  private BpzglList;
  public chosenpackage;
  public slidelist;

  public sterilizerType;
  public sterilizerTypes = [];
  public washers = [];
  public washer;
  public packageplaces = [];
  public packageplace;

  public prePerson;
  private personid;
  public allChecked = true;
  public indeterminate = false;
  public size = 'default';
  public totalprint = 0;

  private userName: string;
  private userId: string;
  private deptId: string;
  private deptName: string;
  public qxptm: string;
  public washprintlist = [];
  dbperson;
  constructor(
    private publicservice: PublicuseService,
    private toolservice: ToolsService,
    private service: PrintMakeService,
    private recoverservice: RecoveryService

  ) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
    this.disabledDate = this.toolservice.disableDate(new Date());
    // this.BpzglList=this.publicservice.getulPackages();//获取包列表
    //this.prePerson = this.userName;
    this.personid = this.userId;

  }

  ngOnInit() {
    this.getwashers();
    this.getsterilizerType();
    this.getPackagePlace();
    this.Pbrinput.nativeElement.focus();
    this.confectPackageSearch();
    //this.confectPackageSearch();
    // this.Packageinput.nativeElement.focus();

  }
  focus(element, skip, input) {

    let zg = new RegExp('ZG', 'i');
    let qp = new RegExp('QP', 'i');
    if (zg.test(element)) {
      console.log(element);
      let index = element.indexOf('ZG');
      let oldinput = element.slice(0, index);
      this[input] = oldinput.length > 0 ? oldinput : '';
      this.Pbrinput.nativeElement.focus();
      this.prePerson = element.substring(index + 2, element.length);
      let e = { keyCode: 13 };
      if (skip != 'ZG') {
        this.personKeyUp(e);
        return false;
      }
    }
    if (qp.test(element)) {
      console.log(element);
      let index = element.indexOf('QP');
      let oldinput = element.slice(0, index);
      this[input] = oldinput.length > 0 ? oldinput : '';
      this.Qxptminput.nativeElement.focus();
      this.qxptm = element.substring(index + 2, element.length);
      let e = { keyCode: 13 };
      if (skip != 'BF') {
        this.confectPackageSearchpxp(e);
        return false;
      }
    }

    return true;
  }

  // 人员 回车 查询
  personKeyUp(e) {

    if (e.keyCode === 13) {
      let goon = this.focus(this.prePerson, 'ZG', 'prePerson');
      if (!goon) {
        return;
      }
      this.personid = this.prePerson;
      const data = {
        Userinfo: {
          us_userid: this.prePerson
        },
        LoginForm: {
          deptId: this.deptId,
          deptName: this.deptName,
          userId: this.userId,
          userName: this.userName
        }
      };
      this.recoverservice.getPersonMessageByPersonId(data).subscribe(res => {
        if (res['status'] === 'OK') {
          if (res['returnValue'] && res['returnValue']['Userinfo']) {
            console.log('res', res);
            const { us_username: name } = res['returnValue']['Userinfo'];
            this.dbperson = res['returnValue']['Userinfo'];
            this.prePerson = name;
          } else {
            this.prePerson = '';
          }
        } else {
          this.toolservice.createMessage('warning', res['message']);
        }
      });
    }
  }
  onChosePack(e) {
    console.log(e, '选择结果');
    if (!e) {
      this.packagename = '';
      this.chosenpackage = null;
      return;
    }
    this.packagename = e.bid;
    this.chosenpackage = e;
    // if(!e){
    //   this.tempdata=this.bodydata.slice();
    //   return;
    // }
    // this.tempdata=_.filter(this.bodydata,(item)=>{
    //     return e.bid==item.bid;
    // })
  }

  //搜索包
  packageidkeyup(e) {
    this.showtopul = this.packagename == '' ? false : true;//显示或影藏下拉列表
    console.log(this.BpzglList, this.packagename);
    let list = this.BpzglList.filter((item) => {
      let reg = new RegExp(`^${this.packagename}`, "i");
      return reg.test(item.bmc) || reg.test(item.py_code);
    });
    this.slidelist = list;
    console.log(this.slidelist, '111111111');
    if (this.slidelist.length == 1) {
      this.chosenpackage = this.slidelist[0];
    }
    if (this.packagename == '') {
      this.chosenpackage = null;
    }
    if (e.keyCode === 13 && this.packagename.trim()) {
      this.showtopul = false;
      let thisreg = new RegExp('^(BB|bb)');
      if (thisreg.test(this.packagename)) {
        this.packagename = this.packagename.slice(2, this.packagename.length);
      }
      //开始搜索
      this.confectPackageSearch();
    }



  }
  //配包
  confect(item) {

  }
  //选定下拉列表中的包
  choosepackage(item, e) {
    e.stopPropagation();
    this.showtopul = false;
    this.packagename = item.bmc;
    this.chosenpackage = item;
    console.log(item);
  }

  //获取灭菌机
  getwashers() {
    const data = {
      Sbxx: { did: this.deptId, is_inv: "1", sb_type: "1~2~9" },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getwashers(data).subscribe(res => {
      if (res['status'] === 'OK') {
        this.washers = [...res.returnValue.SbxxList];
        console.log(res, '获取清洗机成功');
      }
      else {
        this.toolservice.createMessage('warning', res.message + '获取灭菌机失败');
      }
    })
  }
  //获取灭菌方式
  getsterilizerType() {
    const data = {
      AA10: { aaa100: "XD_WAY" },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getsterilizerType(data).subscribe(res => {
      if (res['status'] === 'OK') {
        console.log(res, '获取灭菌方式成功');
        this.sterilizerTypes = [...res.returnValue.AA10List];
      }
      else {
        this.toolservice.createMessage('warning', res.message + '获取灭菌方式失败');
      }
    })
  }
  //获取打包位置
  getPackagePlace() {
    const data = {
      AA10: { aaa100: "DB_LOCATION" },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.getPackagePlace(data).subscribe(res => {
      if (res['status'] === 'OK') {
        console.log(res, '获取打包位置成功');
        this.packageplaces = [...res.returnValue.AA10List];

      }
      else {
        this.toolservice.createMessage('warning', res.message + '获取打包位置失败');
      }
    })
  }

  //清洗打印查询
  searchwashprint() {
    const data = {
      PageReq: {},
      Qx: {
        did: this.deptId,
        mj_dev_id: "",
        mj_d_gc: "",
        cz_id: "",
        pb_uid: "",
        db_uid: "",
        mj_uid: "",
        basket_id: "",
        dy_dyys: "",
        qx_dev_id: this.washer,
        bid: this.chosenpackage ? this.chosenpackage.bid : '',
        kssj: this.toolservice.timepipe(this.formtimestart, 'yyyy-MM-dd HH:mm:ss'),
        jssj: this.toolservice.timepipe(this.formtimeend, 'yyyy-MM-dd HH:mm:ss'),
        xd_way: this.sterilizerType,
        db_location: this.packageplace
      },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.searchwashprint(data).subscribe(res => {
      if (res['status'] === 'OK') {

      }
      else {
        this.toolservice.createMessage('warning', res.message + '查询失败');
      }
    })
  }
  confectPackageSearchpxp(e) {
    if (e.keyCode === 13) {
      let goon = this.focus(this.qxptm, 'QP', 'qxptm');
      if (!goon) {
        return;
      }

      this.confectPackageSearch();
    }
  }


  // 配包查询
  confectPackageSearch() {
    console.log(this.chosenpackage, 'ppp');
    let reg = new RegExp('QP', 'i');
    if (reg.test(this.qxptm)) {
      this.qxptm = this.qxptm.substr(2, this.qxptm.length - 2);
    }
    const data = {
      PageReq: {},
      Qx: {
        did: this.deptId,
        mj_dev_id: "",
        mj_d_gc: "",
        xq_start: "2018-09-21",
        cz_id: "",
        pb_uid: "",
        db_uid: "",
        mj_uid: "",
        basket_id: this.qxptm,
        dy_dyys: "",
        qx_dev_id: this.washer,
        bid: this.chosenpackage ? this.chosenpackage.bid : this.packagename,
        kssj: this.toolservice.timepipe(this.formtimestart, 'yyyy-MM-dd HH:mm:ss'),
        jssj: this.toolservice.timepipe(this.formtimeend, 'yyyy-MM-dd HH:mm:ss'),
        xd_way: this.sterilizerType,
        db_location: this.packageplace,
        is_pb: "1"
      },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.confectPackageSearch(data).subscribe(res => {
      this.packagename = '';
      if (res['status'] === 'OK') {
        if (res.returnValue.rows.length == 0) {
          this.washprintlist = []
          this.toolservice.createMessage('warning', '没有待配包的条码');
          return
        }
        this.qxptm = '';
        console.log(res, '配包list成功');
        // let totalnum=0;
        res.returnValue.rows.forEach(element => {



          element.temp_num = element.b_num;

          if (!(element.sycs >= element.ksycs && element.db_location == 'ycxwpdy')) {
            element.checked = true
          } else {
            element.checked = false;
          }
        });

        this.washprintlist = [].concat(res.returnValue.rows);
        // this.packageplaces=[...res.returnValue.AA10List];



      }
      else {
        this.washprintlist = []
        this.toolservice.createMessage('warning', res.message + '获取配包list失败');
      }
    })
  }
  //修改打印数量给提示
  numchange(item) {
    let reg = new RegExp(`^0[0-9]`, "i");
    if (Number(item.b_num) < Number(item.temp_num) || (reg.test(item.temp_num))) {
      item.warning = true;
    }
    else {
      item.warning = false;
    }
  }

  //点击配包
  confectPackage(item, all) {
    let ipajax = storage.get('machineip');
    // console.log(ipajax,'ipajas');
    // let ipajax='192.168.25.70';
    let machinename = storage.get('machinename');
    // let machinename='192.168.25.70'
    if (!ipajax || !machinename) {
      alert('请设置打印机ip');
      console.log(ipajax, machinename, '11233');
      return;
    }



    if (!this.prePerson) {
      this.toolservice.createMessage('warning', '请输入配包人');
      return;
    }
    if (item && item.warning) {
      this.toolservice.createMessage('warning', '数量超出');
      return;
    }
    let tempobj = [];


    console.log(item, 'asdas ')
    if (item) {
      tempobj = [{ bid: item.bid, qx_dev_id: item.qx_dev_id, qx_id: item.qx_id, pb_uid: this.personid, pb_name: this.prePerson, b_num: item.temp_num, temp_num: item.temp_num }]
    }
    else {
      tempobj = this.buildAllConfect(this.washprintlist);
    }
    if (tempobj.length == 0) {
      this.toolservice.createMessage('warning', '请选择包');
      return;
    }
    const data = {
      HsqxdyList: tempobj,
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.service.confectPackage(data).subscribe(res => {
      if (res['status'] === 'OK') {
        console.log(res, this.washprintlist, '配包成功');
        this.toolservice.createMessage('success', '配包成功');
        this.confectPackageSearch();
        this.waitprint(tempobj);
      }
      else {

        this.toolservice.createMessage('warning', res.message + '配包失败');
      }
    })
  }
  async waitprint(tempobj) {
    let promise = new Promise((reslove, reject) => {
      let formdata = this.child.getform();
      let now = this.toolservice.timepipe(new Date(), 'yyyy-MM-dd HH:mm:ss');
      console.log(tempobj, 'print bug');
      let printlist = tempobj;
      //let printlist=this.washprintlist.filter(item=>{return item.checked;})
      printlist.forEach((item) => {
        item['pb_name'] = this.dbperson.us_username;
        item['pb_uid'] = this.dbperson.us_userid;
        item['pb_dt'] = now;
      })
      this.publicservice.publicprint(printlist, formdata, 'isqxdy', reslove);
    })
    let waitvalue = await promise;
    this.prePerson = '';
    //配包完成后刷新页面
    //this.confectPackageSearch();
    this.washprintlist = []
    console.log(waitvalue, 'waitvalue');
  }
  //构造全部配包效果
  buildAllConfect(washprintlist) {
    let temparr = [];
    washprintlist.forEach((item) => {
      if (item.checked) {
        temparr = temparr.concat({ bid: item.bid, qx_dev_id: item.qx_dev_id, qx_id: item.qx_id, pb_uid: this.personid, pb_name: this.prePerson, b_num: item.temp_num, temp_num: item.temp_num });
      }
    })
    return temparr;
  }

  delete(item) {
    const data = {
      beo: { qx_id: item.qx_id, bid: item.bid },
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
    this.toolservice.createWarningDialog('是否删除', '', () => {
      this.service.delete(data).subscribe(res => {
        if (res['status'] === 'OK') {
          console.log(res, '删除成功');
          this.toolservice.createMessage('success', '删除成功');
          this.washprintlist = this.washprintlist.filter((value) => {
            return item != value;
          })
        }
        else {
          this.toolservice.createMessage('warning', res.message + '删除失败');
        }
      })
    }, null);

  }


  //全选效果
  updateAllChecked(): void {
    console.log(this.washprintlist, this.allChecked);
    this.indeterminate = false;
    if (this.allChecked) {
      this.washprintlist.forEach(item => {
        if (!(item.sycs >= item.ksycs && item.db_location == 'ycxwpdy')) {
          item.checked = true
        } else {
          item.checked = false;
        }
      });
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
  clearall() {
    this.washprintlist = [];
  }
  //打印所有
  // printall(single){


  // }

}
