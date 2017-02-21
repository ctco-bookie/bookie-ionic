import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams, Response } from '@angular/http';
import { AppConfig } from '../app/app.config';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

//Implemented for POC purpose. Selected room will not be displayed in results. To be changed to something reasonable.
const floorMasterRoomNumberQuery = 'query AvailableRoomsQuery($roomNumber: Int!) {  roomsOnFloor: rooms(floorMasterRoomNumber: $roomNumber) {    name    number    capacity    availability {      busy      availableFor      availableFrom      __typename    }    __typename  }}';

@Injectable()
export class BookingService {

    constructor(private http: Http) {
    }

    getMeetingRooms(roomSelected: number): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        let variables = {"roomNumber": roomSelected};
        params.set('query', floorMasterRoomNumberQuery);
        params.set('variables', JSON.stringify(variables));
        return this.http.get(AppConfig.apiEndpoint, { search: params })
            .map(this.extractData)
            .catch(this.handleError);;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw('connection error - '+ errMsg);
    }

}