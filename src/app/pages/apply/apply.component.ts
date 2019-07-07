import { Component, OnInit ,ViewChild,Renderer2} from '@angular/core';
import { Router ,ActivatedRoute,NavigationEnd} from '@angular/router';
import { BrokedataService } from 'src/app/service/state/wastage.service';
import { EmitService } from 'src/app/service/middleman.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  @ViewChild('apply') apply;
  @ViewChild('direct') direct;
  @ViewChild('useapply') useapply;


    public todayapply;
    
  
    constructor(
      private router:Router,
      private emitservice:EmitService,
      private routerinfo:ActivatedRoute,
      private renderder:Renderer2,
      private state:BrokedataService
      
    ) { }
  
    ngOnInit() {
      this.state.dbperson=null;
      this.emitservice.eventEmitdifferntimes.subscribe((obj)=>{

        console.log(obj);
      })
      this.emitservice.hsr.emit({'ffrname':'','ffrid':''});
      this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event:NavigationEnd) => {
        console.log(this.routerinfo.children[0].routeConfig.path,this.routerinfo,'header 当前路由');
          switch(this.routerinfo.children[0].routeConfig.path){
            case 'content':this.renderder.addClass(this.apply.nativeElement,'selfactive');break;
            case 'dirct':this.renderder.addClass(this.direct.nativeElement,'selfactive');console.log(this.direct.nativeElement,'native');break;
            case 'use-apply':this.renderder.addClass(this.useapply.nativeElement,'selfactive');break;
          }
      });
    }
    goteril(){
      this.router.navigate(['/apply/content']);
    }
    goresult(){
      this.router.navigate(['/apply/dirct']);
    }
    getalltimes(value){
      console.log(value,'diffentimes');
    }
    gouseapply(){
      this.router.navigate(['/apply/use-apply']);
    }
}
