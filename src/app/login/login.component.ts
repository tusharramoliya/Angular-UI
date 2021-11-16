import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { LoginModel } from './Model/app.LoginModel';
import { LoginService } from './Services/app.LoginService';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    LoginModel: LoginModel = new LoginModel();

    iserrorShow: boolean = false;
    errorMessage: String = "";
    actionButtonLabel: string = 'Retry';
    action: boolean = false;
    setAutoHide: boolean = true;
    autoHide: number = 2000;

    ngOnInit() {
        localStorage.clear();
        this.iserrorShow = false;
    }

    private _loginservice: LoginService;
    output: any;

    constructor(public router: Router, loginservice: LoginService) {
        this._loginservice = loginservice;
    }

    onSubmit(event: NgForm) {
        this._loginservice.validateLoginUser(this.LoginModel).subscribe(
            response => {

                if (response == null || response.Token == null || response.Token == undefined) {
                    this.errorMessage = response.message;
                    this.iserrorShow = true;
                }
                localStorage.setItem('UserDashMessage', response.message);
                localStorage.setItem('UserFirstName', response.firstname);
                localStorage.setItem('UserLastName', response.lastname);
                this.router.navigate(['dashboard']);
            });

    }

    closeAlert() {
        this.iserrorShow = false;
        this.errorMessage = null;
    }
}
