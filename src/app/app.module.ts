import { BookingPage } from '../pages/booking/booking';
import { BookingService } from '../services/booking.service';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BookingPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BookingPage
  ],
  providers: [
    { 
      provide: ErrorHandler, 
      useClass: IonicErrorHandler 
    },
    BookingService
  ]
})
export class AppModule { }
