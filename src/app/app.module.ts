import { AppConfig } from './app.config';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { BookingPage } from '../pages/booking/booking';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';


// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: AppConfig.apiEndpoint
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BookingPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ApolloModule.forRoot(provideClient)
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
      useClass: IonicErrorHandler,
    },
  ]
})
export class AppModule { }
