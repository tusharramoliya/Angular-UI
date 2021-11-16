import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { StripeAddressModel, StripePaymentModel } from './Modal/app.StripePaymentModel';
import { StripePaymentService } from './Services/app.stripeservice';

@Component({
    selector: 'app-stripe-payment',
    templateUrl: './stripe-payment.component.html',
    styleUrls: ['./stripe-payment.component.scss'],
    animations: [routerTransition()],
    providers: [StripePaymentService, DecimalPipe]
})
export class StripePaymentComponent implements OnInit {

    StripePaymentModel: StripePaymentModel = new StripePaymentModel();
    alertmessage: string;
    isshowmainalert: boolean = false;
    iserror: boolean = false;

    constructor(public service: StripePaymentService,
        private modalService: NgbModal) { }

    ngOnInit() {
        this.StripePaymentModel.address = new StripeAddressModel();
    }


    onSubmit(Userform) {
        if (!Userform.form.valid) {
            return false;
        }

        this.StripePaymentModel.amount = parseFloat(this.StripePaymentModel.amount.toLocaleString());

        this.service.saveStripeDetails(this.StripePaymentModel).subscribe(
            response => {
                this.hideAllAlert();

                if (response != null && response.success == false) {
                    this.showMainAlert(true, response.message);
                } else if (response != null && response.success) {
                    this.showMainAlert(false, response.message);
                    this.StripePaymentModel = new StripePaymentModel();
                    this.StripePaymentModel.address = new StripeAddressModel();
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
