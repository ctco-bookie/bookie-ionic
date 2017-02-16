import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html'
})
export class BookingPage {
  
  room: any;
  time: any;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.room = navParams.get('room');
  }

  //Note: booking functionality not implemented in scope of POC

}
