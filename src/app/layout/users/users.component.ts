import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { routerTransition } from '../../router.animations';
import { NgbdSortableHeader, SortEvent } from './Directive/sortable.directive';
import { UserModel } from './Modal/app.UserModel';
import { UserService } from './Services/app.userService';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: [routerTransition()],
    providers: [UserService, DecimalPipe]
})
export class UsersComponent implements OnInit {

    userlist$: Observable<any>;
    total$: Observable<number>;
    closeResult: string;
    public UserAction: string = "Create New User";
    UserModel: UserModel = new UserModel();
    alertmessage: string;
    isshowpopupalert: boolean = false;
    isshowmainalert: boolean = false;
    iserror: boolean = false;
    deleteduser: string = '';

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

    constructor(public service: UserService,
        private modalService: NgbModal) {
        this.userlist$ = service.userlist$;
        this.total$ = service.total$;
    }

    onSort({ column, direction }: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.service.sortColumn = column;
        this.service.sortDirection = direction;
    }

    // events 
    ngOnInit() {

    }

    CreateUpdateUser(content) {
        this.UserAction = "Create New User";
        this.UserModel = new UserModel();
        this.openUserPopup(content);
    }

    UpdateUserPopup(content, usermodel) {
        this.UserAction = "Update User";
        this.UserModel = new UserModel();
        this.UserModel.id = usermodel.id;
        this.UserModel.firstname = usermodel.firstName;
        this.UserModel.lastname = usermodel.lastName;
        this.UserModel.email = usermodel.email;
        this.UserModel.password = usermodel.email;
        this.UserModel.message = usermodel.message;
        this.openUserPopup(content);
    }

    openUserPopup(content) {
        this.modalService.open(content).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    DeleteUserPopup(content, usermodel) {
        this.UserModel = new UserModel();
        this.UserModel.id = usermodel.id;
        this.UserModel.firstname = usermodel.firstName;
        this.UserModel.lastname = usermodel.lastName;
        this.UserModel.email = usermodel.email;
        this.UserModel.password = usermodel.email;
        this.deleteduser = usermodel.firstName + ' ' + usermodel.lastName;
        this.openUserPopup(content);
    }

    deleteUser() {
        this.service.deleteUserDetails(this.UserModel.id).subscribe(
            response => {
                this.hideAllAlert();
                this.modalService.dismissAll();

                if (response != null && response.issuccess == false) {
                    this.showMainAlert(true, response.message);
                } else if (response != null && response.issuccess) {
                    this.showMainAlert(false, response.message);
                    this.service.GetAllUserData();
                }

            });
    }

    onSubmit(Userform) {
        if (!Userform.form.valid) {
            return false;
        }

        this.service.saveUserDetails(this.UserModel).subscribe(
            response => {
                this.hideAllAlert();

                if (response != null && response.issuccess == false) {
                    this.showPopupAlert(true, response.message);
                } else if (response != null && response.issuccess) {
                    this.showMainAlert(false, response.message);
                    this.modalService.dismissAll();
                    this.service.GetAllUserData();
                }

            });
    }

    showMainAlert(alerttype: boolean, message: string) {
        this.iserror = alerttype;
        this.alertmessage = message;
        this.isshowmainalert = true;
        this.isshowpopupalert = false;
    }

    showPopupAlert(alerttype: boolean, message: string) {
        this.iserror = alerttype;
        this.alertmessage = message;
        this.isshowmainalert = false;
        this.isshowpopupalert = true;
    }

    hideAllAlert() {
        this.isshowmainalert = false;
        this.isshowpopupalert = false;
    }
}
