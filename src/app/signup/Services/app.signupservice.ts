import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserModel } from './../Modal/app.UserModel';

@Injectable({
    providedIn: 'root'
})

export class SignupService {
    public token: string;
    constructor(private _http: HttpClient, private _Route: Router) {

    }
    private apiUrl = environment.apiEndpoint + "/api/users/";

    public saveUserDetails(usermodel: UserModel) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.post<any>(this.apiUrl + 'createupdateuser', usermodel, { headers: headers })
            .pipe(tap(data => {

                return data;
            }),
                catchError(this.handleError)
            );
    }

    LogoutUser() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentAdminUser');
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
