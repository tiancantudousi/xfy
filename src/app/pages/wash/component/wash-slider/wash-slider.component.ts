import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
// import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-wash-slider',
  templateUrl: './wash-slider.component.html',
  styleUrls: ['./wash-slider.component.scss']
})
export class WashSliderComponent implements OnInit {
  // public record:boolean=true;
  // public result:boolean=false;
  // public count:boolean=false;
  // public check:boolean=false;
  public showresult;
  public chooseobj={'record':false,'result':false,'count':false,'check':false}

  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {
    this.getactiveroute();
    console.log(this.route.children[0].routeConfig.path,'this.route.children[0].routeConfig.path');
    this.showresult=this.route.children[0].routeConfig.path=='wash-result'?true:false;
  }
  getwashers(){
    this.activebool('record',this.chooseobj);
    this.router.navigate(['/wash/wash-content']);
  }
  goresult(){
    // console.log(this.result);
    this.activebool('result',this.chooseobj);
    this.router.navigate(['/wash/wash-result']);
  }
  gocheck(){
    this.activebool('check',this.chooseobj);
    // this.router.navigate(['/wash/wash-check']);
  }
  gocount(){
    this.activebool('count',this.chooseobj);
    // this.router.navigate(['/wash/wash-count']);
  }
  activebool(item,thisobj){
    for(let key in thisobj){
       if(item==key){
          thisobj[key]=true;
       }
       else{
         thisobj[key]=false;
       }
    }
  }
  getactiveroute(){
    let url=location.href;
    let i=url.lastIndexOf('-');
    let active=url.slice(i+1,url.length);
    this.activebool(active,this.chooseobj);
  }

}
