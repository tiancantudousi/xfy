import { Component, OnInit,Output,EventEmitter,Input ,Renderer2,ViewChild,ElementRef,AfterViewInit} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { HttpService } from 'src/app/service/http/http.service';
import storage from './../../service/storage';
import * as _ from 'lodash';

@Component({
  selector: 'app-search-kslist',
  templateUrl: './search-kslist.component.html',
  styleUrls: ['./search-kslist.component.scss']
})
export class SearchKslistComponent implements OnInit,AfterViewInit {
  @Input() chosefirst;
  choseonce=false;

  @Input() size;
  @Input() Width;
  @Output() ChosePack=new EventEmitter();
  @ViewChild('select') Select;
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
  constructor( private service: HttpService,private renderer:Renderer2) {
    // const message = storage.get('userMessage');
    // this.userName = message['userName'];
    // this.userId = message['userId'];
    // this.deptId = message['deptId'];
    // this.deptName = message['deptName'];
   }

  ngOnInit() {
    console.log('kslist size',this.size);
    const getRandomNameList = (name: string) => this.service.getdata(this.getparmas(name));
    const optionList$: Observable<string[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));

    optionList$.subscribe(data => {
      console.log('搜索返回结果',data,this.tempvalue);
      // if(!data['returnValue'].rows.length){
      //   let tempobj={bid:this.tempvalue,bmc:this.tempvalue};
      //   this.ChosePack.emit(tempobj)
      //   return;
      // }
      this.packs = data['returnValue'].rows;
      if(this.chosefirst&&!this.choseonce){
         this.choseonce=true;
         this.pack=this.packs[0].deptid
         this.emitEvent( this.pack);
      }
      this.total=Math.floor(data['returnValue'].total/10)+1;
      this.isLoading = false;
    });
  }
  ngAfterViewInit(){

    
    console.log(this.renderer,this.Width,this.Select.nativeElement,'this.renderer');
    this.renderer.setStyle(this.Select.nativeElement,'width',this.Width);
    this.renderer.setStyle(this.Select.nativeElement.getElementsByClassName('ant-select-selection--single')[0],'width',this.Width);
      // this.renderer
  }

  getparmas(val){
    return {
      method: 'getComboGrid',
      service: 'PopupService',
      Popup:{"type":"COMBOGRID_DEPARTMENT"},
      "PageReq":{page:this.nowindex,rows:"10",q:val}
      // LoginForm: {
      //   deptId: this.deptId,
      //   deptName: this.deptName,
      //   userId: this.userId,
      //   userName: this.userName
      // }
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
    let tempobj=_.find(this.packs,{'deptid':e})
    this.ChosePack.emit(tempobj)
    console.log('发射事件',this.pack,tempobj);
  }

}
