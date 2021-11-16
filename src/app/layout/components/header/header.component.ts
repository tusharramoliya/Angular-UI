import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './../../../shared/services/common.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;
    public _commonservice: CommonService;
    public LoginUserDetails: any;
    public FirstName: any;
    public LastName: any;

    constructor(private translate: TranslateService,
        public router: Router,
        public commonservice: CommonService) {
        this._commonservice = commonservice;
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });

        this.FirstName = localStorage.getItem('UserFirstName');
        this.LastName = localStorage.getItem('UserLastName');
        // this.getLoginUserDetails();
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentAdminUser');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    // getLoginUserDetails() {
    //     this._commonservice.GetLoginUserDetails().subscribe(
    //         response => {
    //             this.LoginUserDetails = response;
    //             localStorage.setItem('UserDashMessage', response.message);
    //         });
    // }
}
