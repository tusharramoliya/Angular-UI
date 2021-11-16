import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { UserModel } from './Modal/app.UserModel';
import { SignupService } from './Services/app.signupservice';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()],
    providers: [SignupService, DecimalPipe]
})
export class SignupComponent implements OnInit {

    UserModel: UserModel = new UserModel();
    alertmessage: string;
    isshowmainalert: boolean = false;
    iserror: boolean = false;

    constructor(public service: SignupService,
        private modalService: NgbModal) { }

    ngOnInit() { }


    onSubmit(Userform) {
        if (!Userform.form.valid) {
            return false;
        }

        this.service.saveUserDetails(this.UserModel).subscribe(
            response => {
                this.hideAllAlert();

                if (response != null && response.issuccess == false) {
                    this.showMainAlert(true, response.message);
                } else if (response != null && response.issuccess) {
                    this.showMainAlert(false, response.message);
                    this.UserModel = new UserModel();
                }

            });
    }

    hideAllAlert() {
        this.isshowmainalert = false;
    }

    showMainAlert(alerttype: boolean, message: string) {
        this.iserror = alerttype;
        this.alertmessage = message;
        this.isshowmainalert = true;
    }

}
