import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from '../home/home';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
    constructor(private navController: NavController) {
    }
  onLink(url: string) {
      window.open(url);
  }
  public account = {
      username: "demo",
      password: "demo"
  }
  login() {
      console.log("Login " + this.account.username + " " + this.account.password);
      this.navController.push(HomePage, this.account);
  }
}
