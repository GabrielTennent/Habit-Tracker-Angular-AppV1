import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BatteryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-battery',
  templateUrl: 'battery.html'
})
export class BatteryPage {
  //battery % counts
  private bedroomBat = 0;
  private kitchenBat = 0;
  private diningBat = 0;
  private toiletBat = 0;
  private livingBat = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.bedroomBat = this.navParams.get('bedroomBat');
    this.kitchenBat = this.navParams.get('kitchenBat');
    this.diningBat = this.navParams.get('diningBat');
    this.toiletBat = this.navParams.get('toiletBat');
    this.livingBat = this.navParams.get('livingBat');
  }
}
