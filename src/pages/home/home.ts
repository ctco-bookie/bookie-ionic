import { Room } from '../../models/room';
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

  private rooms: Room[];
  public filteredRooms: Room[];
  private availabilityFilter: string;
  private roomSelected: number;
  private updateInProgress: boolean;

  constructor(public navCtrl: NavController, private bookingService: BookingService, private alertCtrl: AlertController) {
    this.roomSelected = 412; // "magic" room number
    this.updateRooms();
  }

  updateRooms() {
    this.updateInProgress = true;
    this.filteredRooms = null; //toggles "loading" spinner on UI
    this.bookingService.getMeetingRooms(this.roomSelected).subscribe(
      result => this.processData(result),
      err => { 
        this.showError(err);
      }
    );
  }

  processData(result: Room[]) {
    this.rooms = result;
    this.availabilityFilter = 'available';
    this.showAvailableRooms();
    //Vibration added to check integration with native functionality
    try {
      Vibration.vibrate(1000)
    }
    catch(e) {
      console.log('Vibration failed: '+ (<Error>e).message);
    };
    this.updateInProgress = false;
  }

  showError(err) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: err,
      buttons: ['Dismiss']
    });
    this.updateInProgress = false;
    return alert.present();
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
  
  openBookingPage(room: Room) {
    this.navCtrl.push(BookingPage, {room});
  }

  // Barcode scanning using native cordova plugin
  scanQRCode() {
    BarcodeScanner.scan().then(
      barcodeData => {
        let url = JSON.stringify(barcodeData.text);
        if (url.includes("http://bookie.ctco.lv/room/")) {
          let roomNumber = Number(url.substr(28, 3));
          if (roomNumber > 0) {
            this.roomSelected = roomNumber;
            this.updateRooms();
          } else {
            this.showError('Could not identify room number');
          }
        }
      }, 
      err => this.showError('Unknown error') 
    )}
}