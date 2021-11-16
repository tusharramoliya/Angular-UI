import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordCompareDirective } from './../../shared/directive/password-compare-directive';
import { PageHeaderModule } from '../../shared';
import { NgbdSortableHeader } from './Directive/sortable.directive';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        UsersRoutingModule,
        PageHeaderModule],
    declarations: [UsersComponent, NgbdSortableHeader, PasswordCompareDirective],
    exports: [PasswordCompareDirective]
})
export class UsersModule { }
