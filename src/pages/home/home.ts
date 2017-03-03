import { Subject, Subscription } from 'rxjs/Rx';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { Room } from '../../models/room';
import { Component, ViewChild } from '@angular/core';
import { Content, NavController, AlertController } from 'ionic-angular';
import { BookingPage } from '../booking/booking';
import { Vibration, BarcodeScanner } from 'ionic-native';

import gql from 'graphql-tag';

const floorMasterRoomNumberQuery = gql`
        query AvailableRoomsQuery($roomNumber: Int!) 
        {  roomsOnFloor: rooms(floorMasterRoomNumber: $roomNumber) {    
            name
            number
            capacity
            availability {
                busy
                availableFor
                availableFrom
            }
        }
    }`
  ;

interface QueryResponse {
  roomsOnFloor: Room[];
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Content) content: Content;
  roomsObs: ApolloQueryObservable<any>;
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  availabilityFilter: string;
  floorMasterRoomNumber: Subject<number> = new Subject<number>();
  updateInProgress: boolean;
  roomSelected: number;
  roomsSubscription: Subscription;

  constructor(
    public navCtrl: NavController, 
    private apollo: Apollo, 
    private alertCtrl: AlertController
    ){} 

  //Ionic's alternative to ngOnInit()
  ionViewWillEnter() {  
    this.roomSelected = 412; //Magic room number - to be substituted with config
    this.updateInProgress = true;

    this.roomsObs = this.apollo.watchQuery<any>({
      query: floorMasterRoomNumberQuery,
      variables: {roomNumber: this.roomSelected}
      });
    
    this.roomsSubscription = this.roomsObs.subscribe(
      res => {
        this.processData(res)
        this.updateInProgress = false;
      },
      err => this.rooms = []
    );
  }
  
  //Ionic's alternative to ngOnInit()
  ionViewDidLeave() { 
    this.roomsSubscription.unsubscribe();
  }

  //Update rooms list, apply default filter, drop "sync in progress"
  processData(res, refresher?) {
    this.rooms = res.data.roomsOnFloor || []; 
    this.availabilityFilter = 'available';
    this.updateInProgress = false;
    this.showAvailableRooms();
    if (refresher !== undefined) {
      refresher.complete();
    }
  }
  
  //Alert modal window
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


  //Refresh spinner 
  doRefresh(refresher) {
    this.rooms = [];
    this.filteredRooms = [];
    this.roomsObs.refetch()
      .then(res => {
        this.processData(res, refresher);
      })
      .catch(err => { 
        this.showError(err); 
        refresher.complete() 
      });
  }

  openBookingPage(room: Room) {
    this.navCtrl.push(BookingPage, { room });
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
            this.roomsObs.refetch({roomNumber: roomNumber});
          } else {
            this.showError('Could not identify room number');
          }
        }
      },
      err => {
        this.showError('Unknown error');
      }
    )
  }

  //Vibration added to check integration with native functionality
  vibrate() {
    try {
      Vibration.vibrate(1000)
    }
    catch (e) {
      console.log('Vibration failed: ' + (<Error>e).message);
    };
  }
  
}