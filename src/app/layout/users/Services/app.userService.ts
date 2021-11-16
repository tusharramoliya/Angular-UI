
import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { CommonService } from '../../../shared/services/common.service';
import { UserModel } from '../Modal/app.UserModel';
import { environment } from './../../../../../src/environments/environment';
import { SortColumn, SortDirection } from './../Directive/sortable.directive';

interface SearchResult {
    userList: any;
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(users: any, column: SortColumn, direction: string): any {
    if (direction === '' || column === '') {
        return users;
    } else {
        return [...users].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(user: any, term: string, pipe: PipeTransform) {
    return user.firstName.toLowerCase().includes(term.toLowerCase())
        || user.lastName.toLowerCase().includes(term.toLowerCase())
        || user.email.toLowerCase().includes(term.toLowerCase())
        || user.role.toLowerCase().includes(term.toLowerCase());
}

@Injectable({ providedIn: 'root' })
export class UserService {
    public token: string;
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _userList$ = new BehaviorSubject<any>([]);
    private _total$ = new BehaviorSubject<number>(0);
    public alluserlist: any;
    private apiUrl = environment.apiEndpoint + "/api/users/";

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(private _http: HttpClient, private pipe: DecimalPipe, private commonservice: CommonService) {

        this.token = this.commonservice.GetCurrentUserToken();
        this.GetAllUserData();
    }

    get userlist$() { return this._userList$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // 1. sort
        let userlist = sort(this.alluserlist, sortColumn, sortDirection);

        // 2. filter
        userlist = userlist.filter(user => matches(user, searchTerm, this.pipe));
        const total = userlist.length;

        // 3. paginate
        userlist = userlist.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

        return of({ userList: userlist, total });
    }

    public saveUserDetails(usermodel: UserModel) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this._http.post<any>(this.apiUrl + 'createupdateuser', usermodel, { headers: headers })
            .pipe(tap(data => {

                return data;
            }),
                catchError(this.handleError)
            );
    }

    public deleteUserDetails(uderid: number) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this._http.delete<any>(this.apiUrl + 'deleteuser?id=' + uderid, { headers: headers })
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

    public GetAllUserData() {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);

        this._http.get(this.apiUrl + 'getalluser', { headers: headers })
            .subscribe(data => {

                this.alluserlist = data;

                this._search$.pipe(
                    tap(() => this._loading$.next(true)),
                    debounceTime(200),
                    switchMap(() => this._search()),
                    delay(200),
                    tap(() => this._loading$.next(false))
                ).subscribe(result => {

                    this._userList$.next(result.userList);
                    this._total$.next(result.total);
                });

                this._search$.next();
            });
    }
}
