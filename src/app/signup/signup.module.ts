import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CompareDirective } from '../shared/directive/compare-directive';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        SignupRoutingModule],
    declarations: [SignupComponent, CompareDirective]
})
export class SignupModule { }
