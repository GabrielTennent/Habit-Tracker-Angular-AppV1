import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { seniorStatus } from '../seniorStatus/seniorStatus';
import { Content, Select, Option, Button } from 'ionic-angular';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public clientList: string[];
  public connectedClient: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.clientList = ['tennengabr123', 'oldman2', 'oldwoman3'];
  }

  connectToClient(clientCon) {
    this.navCtrl.push(seniorStatus, { cliendId: this.connectedClient });
  }
}
