import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StripePaymentModel } from '../Modal/app.StripePaymentModel';

@Injectable({
    providedIn: 'root'
})

export class StripePaymentService {
    public token: string;
    constructor(private _http: HttpClient, private _Route: Router) {

    }
    private apiUrl = environment.apiEndpoint + "/api/stripe/";

    public saveStripeDetails(stripemodel: StripePaymentModel) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.post<any>(this.apiUrl + 'createcard', stripemodel, { headers: headers })
            .pipe(tap(data => {

                return data;
            }),
                catchError(this.handleError)
            );
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
