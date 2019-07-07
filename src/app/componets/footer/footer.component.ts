import { Component, OnInit } from '@angular/core';
import { ToolsService} from './../../service/tools/tools.service';
import storage from './../../service/storage';
import { Router }  from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public timenow;
  public userName: string;
  public userId: string;
  public deptId: string;
  public deptName: string;

  constructor(
    private toolservice:ToolsService,
    private router:Router
  ) {

    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
   }

  ngOnInit() {
    this.countdown();
  }
  countdown(){
    let timer;
    
    let that=this;
    timer = setInterval(()=>{
      let now=new Date();
      that.timenow=that.toolservice.timepipe(now,'yyyy-MM-dd HH:mm:ss');
    },1000);
  }
  loginout(){
    storage.set('userMessage',null);
    this.router.navigate(['/login']);
  }

}
