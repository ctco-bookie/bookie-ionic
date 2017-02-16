import { BookingService } from '../../services/booking.service';
import { Component, ViewChild } from '@angular/core';
import { Content, NavController, AlertController } from 'ionic-angular';
import { BookingPage } from '../booking/booking';
import { Vibration, BarcodeScanner } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Content) content: Content;

  public rooms: any;
  public filteredRooms: any;
  private availabilityFilter: string;
  private roomSelected: number;

  constructor(public navCtrl: NavController, private bookingService: BookingService, private alertCtrl: AlertController) {
    this.roomSelected = 412; // "magic" room number
    this.updateRooms();
  }

  updateRooms() {
    this.filteredRooms = null; //toggles "loading" spinner on UI
    this.bookingService.getMeetingRooms(this.roomSelected).subscribe(
      result => this.processData(result)
    );
  }

  processData(result) {
    this.rooms = result.roomsOnFloor;
    this.availabilityFilter = 'available';
    this.showAvailableRooms();
    Vibration.vibrate(1000); //Vibration added to check integration with native functionality
  }

  showAvailableRooms() {
    this.filteredRooms = this.rooms.filter(room => room.availability.busy == false);
    this.content.scrollToTop();
  }

  showAllRooms() {
    this.filteredRooms = this.rooms;
    this.content.scrollToTop();
  }

  doRefresh(refresher) {
    this.updateRooms();
    refresher.complete();
  }
  
  openBookingPage(room) {
    this.navCtrl.push(BookingPage, { room: room });
  }


  // Barcode scanning using native cordova plugin
  scanQRCode() {
    BarcodeScanner.scan().then((barcodeData) => {
      let url = JSON.stringify(barcodeData.text);
      if (url.includes("http://bookie.ctco.lv/room/")) {
        let roomNumber = Number(url.substr(28, 3));
        if (roomNumber > 0) {
          this.roomSelected = roomNumber;
          this.updateRooms();
        } else {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Could not identify room number',
            buttons: ['Dismiss']
          });
          alert.present();
        }
      }
    }, (err) => {
        // An error occurred
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Unknown error',
            buttons: ['Dismiss']
          });
          alert.present();
    });
  }

  

}