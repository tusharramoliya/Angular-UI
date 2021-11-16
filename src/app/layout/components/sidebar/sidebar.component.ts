import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './../../../shared/services/common.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    public _commonservice: CommonService;
    public LoginUserDetails: any;
    public isadmin: boolean = false;

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private translate: TranslateService,
        public router: Router,
        public commonervice: CommonService) {
        this._commonservice = commonervice;
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
        var getuserdata = localStorage.getItem('currentAdminUser');

        if (getuserdata != null && getuserdata != undefined) {
            this.isadmin = true;
        }
    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        this.getLoginUserDetails();
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
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

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentAdminUser');
    }

    getLoginUserDetails() {
        this._commonservice.GetLoginUserDetails().subscribe(
            response => {
                this.LoginUserDetails = response;
            });
    }
}
