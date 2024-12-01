// System Utils
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';

// Installed Utils
import { TranslateModule, TranslateService }     from '@ngx-translate/core';

// App Utils
import { AccountLayoutComponent } from '../../shared/layouts/account-layout/account-layout.component';
import { Title } from '@angular/platform-browser';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

// Configuration
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatListModule,
    AccountLayoutComponent,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

// Logic
export class DashboardComponent {

  // SideNav mark
  showSideNav = false;

  // Current user holder
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private title: Title,
    private translateService: TranslateService,
    private userService: UserService
  ) {
    // Set Page Title
    this.translateService.get('dashboard').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Get User's Data
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logOut() {
    this.router.navigate(['/auth/logout']);
  }

}
