import { Component, OnInit } from '@angular/core';
import storage from './../../service/storage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userName: string="李岚 0232";
  public userId: string;
  public deptId: string;
  public deptName: string;

  constructor(
    private router:Router
  ) { 
    const message = storage.get('userMessage');
    this.userName = message['userName'];
    this.userId = message['userId'];
    this.deptId = message['deptId'];
    this.deptName = message['deptName'];
  }

  ngOnInit() {
  }
  gobackhome(){
    this.router.navigate(['/home']);
  }
  loginout(){
    sessionStorage.setItem('islogin','false'); 
    storage.set('userMessage', null);
    this.router.navigate(['/login']);
  }

}
