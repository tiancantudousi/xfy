import { Component, OnInit } from '@angular/core';
import storage from './../../service/storage';
import {WashService } from './../../service/http/wash.service';
import {Router} from '@angular/router';
import {ToolsService} from './../../service/tools/tools.service'

@Component({
  selector: 'app-wash',
  templateUrl: './wash.component.html',
  styleUrls: ['./wash.component.scss']
})
export class WashComponent implements OnInit {
  public deptId;
  public deptName;
  public userId;
  public userName;
   
  constructor(private washservice:WashService,private router:Router,private toolservice:ToolsService) {
    const message = storage.get('userMessage');
    
        this.userName = message['userName'];
        this.userId = message['userId'];
        this.deptId = message['deptId'];
        this.deptName = message['deptName'];
  
   }

  ngOnInit() {
  }


}
