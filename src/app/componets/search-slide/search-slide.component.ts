import { Component, OnInit,Output,EventEmitter,Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { HttpService } from 'src/app/service/http/http.service';
import storage from './../../service/storage';
import * as _ from 'lodash';


@Component({
  selector: 'app-search-slide',
  templateUrl: './search-slide.component.html',
  styleUrls: ['./search-slide.component.scss']
})
export class SearchSlideComponent implements OnInit {
  @Output() ChosePack=new EventEmitter();
  @Input() size;

  searchChange$ = new BehaviorSubject('');
  isLoading=false;
  pack;
  packs;
  userName: string;
  userId: string;
  deptId: string;
  deptName: string;
  nowindex=1;
  total=1;
  tempvalue;
  // @Input() chosepack;
  // set chosepack(name){
  //   // this.packs=[].concat(name);
  //   // this.pack=name.bid;
  //    console.log(name,this,this.packs,this.pack,'set');
  // }
  constructor( private service: HttpService) {
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
   }

  ngOnInit() {
    // this.chosepack.subscribe(value=>{
    //   console.log(value,'输入包改变');
    // })
    // if(this.chosepack){
    //   this.packs=[].concat(this.chosepack);
    //   this.pack=this.chosepack.bid;
    // }
    console.log(this.packs,'ceshi');
    const getRandomNameList = (name: string) => this.service.getdata(this.getparmas(name));
    const optionList$: Observable<string[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));

    optionList$.subscribe(data => {
      console.log('搜索返回结果',data,this.tempvalue);
      if(data['returnValue']){
        this.packs = data['returnValue'].rows;
      }else{
        this.packs = [];
      }
      
    
      this.total=Math.floor(data['returnValue'].total/10)+1;
      this.isLoading = false;
    });
  }


  getparmas(val){
    return {
      method: 'getComboGrid',
      service: 'PopupService',
      Popup:{"type":"COMBOGRID_BPZ"},
      "PageReq":{page:this.nowindex,rows:"10",q:val},
      LoginForm: {
        deptId: this.deptId,
        deptName: this.deptName,
        userId: this.userId,
        userName: this.userName
      }
    };
  }
  onSearch(e){
    this.isLoading = true;
  
    // let thisreg=new RegExp('^(BB|bb)'); 
    // if(thisreg.test(e)){
    //   e=e.slice(2,e.length);
    // }
    // this.tempvalue=e;
    console.log(this.tempvalue,'this.tempvalue');
    this.searchChange$.next(e);
  }
  indexchange(e){
    this.nowindex=e;
    this.searchChange$.next(this.pack);
    console.log(e,'index change');
  }
  stop(e){
    console.log('阻止冒泡');
    e.stopPropagation();
  }
  emitEvent(e){
    let tempobj=_.find(this.packs,{'bid':e})
    this.ChosePack.emit(tempobj)
    console.log('发射事件',tempobj);
  }
}
