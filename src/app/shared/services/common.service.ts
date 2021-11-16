import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class CommonService {
    private data: any;
    public token: string;

    constructor(private _http: HttpClient, private _Route: Router) {
        this.data = this.GetCurrentUser();
        this.token = this.data.token;
    }

    private apiUrl = environment.apiEndpoint + "/api/users/";

    public GetLoginUserDetails() {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this._http.get<any>(this.apiUrl + 'getuserdetails', { headers: headers })
            .pipe(tap(data => {

                return data;

            }),
                catchError(this.handleError)
            );
    }

    public GetCurrentUser() {
        var user = localStorage.getItem('currentUser');
        if (user == null || user == undefined) {
            user = localStorage.getItem('currentAdminUser');
        }

        return JSON.parse(user);
    }

    public GetCurrentUserToken() {
        var user = localStorage.getItem('currentUser');
        if (user == null || user == undefined) {
            user = localStorage.getItem('currentAdminUser');
        }

        var userdetails = JSON.parse(user);

        return userdetails.token;
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    };
}