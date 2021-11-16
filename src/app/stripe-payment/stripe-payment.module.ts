import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CompareDirective } from '../shared/directive/compare-directive';

import { StripePaymentRoutingModule } from './stripe-payment-routing.module';
import { StripePaymentComponent } from './stripe-payment.component';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        StripePaymentRoutingModule],
    declarations: [StripePaymentComponent, CompareDirective]
})
export class StripePaymentModule { }
