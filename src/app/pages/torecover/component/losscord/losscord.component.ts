import { Component, OnInit } from '@angular/core';
import { EmitService } from './../../../../service/middleman.service'
import { BrokedataService } from './../../../../service/state/wastage.service'
import storage from './../../../../service/storage'
import { ToolsService } from 'src/app/service/tools/tools.service';

@Component({
  selector: 'app-losscord',
  templateUrl: './losscord.component.html',
  styleUrls: ['./losscord.component.css']
})
export class LosscordComponent implements OnInit {

  public count:number=0;
  public reducecolor;
  public addcolor;
  public temp;
  public temp2;
  public listcontent;
  public lossdata;
  public Tmxx;
  constructor(private emitService:EmitService,private brokedataservice:BrokedataService,private toolservice:ToolsService) {
      this.lossdata= storage.get('losscordres');

      this.listcontent=this.lossdata.transformdata.rows;   
      this.brokedataservice.bmc= this.lossdata.Tmxx.bmc;  
      this.brokedataservice.bid= this.lossdata.Tmxx.bid; 
      this.brokedataservice.brokematerial=this.listcontent[0];
      this.brokedataservice.broketype=this.lossdata.AA10List[0];
      console.log('transformdata',this.lossdata);
   }

  ngOnInit() {
    this.listcontent.map((item)=>{
         item['check']=false;
         return item;
    })
    this.lossdata.AA10List.map((item)=>{
      item.check=false;
      return item;
   })
   this.lossdata.AA10List[0].check=true;
   this.temp2=this.lossdata.AA10List[0];
   this.listcontent[0].check=true;
   this.temp=this.listcontent[0];
  }

  

  add(){
      if(this.count>=this.temp.cl_num){
          this.toolservice.createMessage('warning',`该器械总数为${this.temp.cl_num}`)
          return;
      }
    this.count++;
    this.brokedataservice.brokenum=this.count;
    this.emitService.eventEmit.emit(this.count);
    this.addcolor=true;
    let that=this;
    setTimeout(function(){
      that.addcolor=false;
    },200)
    
  }
  reduce(){
    this.reducecolor=true;
    let that=this;
    setTimeout(function(){
      that.reducecolor=false;
    },200)
    if(this.count==0){
      return;
    }
    this.count--;
    this.brokedataservice.brokenum=this.count;
    this.emitService.eventEmit.emit(this.count);
   
  }

  checkmaterial(item,i){
    if(this.temp){
      this.temp['check']=false;
    }
    this.temp=item;
    console.log(item);
    this.brokedataservice.brokematerial=item;
    item.check=true;
  }
  btntypeclick(item){
      //单选
    if(this.temp2){
      this.temp2['check']=false;
    }
    this.temp2=item;
    this.brokedataservice.broketype=item;
    item.check=true;
    //多选
    // this.brokedataservice.broketype=item;
    // item.check=item.check?!item.check:true;
     console.log(item);
  }



}
