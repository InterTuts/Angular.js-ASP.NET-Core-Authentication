// System Utils
import { Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {

  // SideNav mark
  showSideNav = false;

  // Current user holder
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private title: Title,
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('dashboard').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Get User's Data
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });

  }

  getTime(): string {

    // Date object
    const date = new Date();

    // Array of day names
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get the day name
    const dayName = days[date.getDay()];

    // Array of month names
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get the month name
    const monthName = months[date.getMonth()];

    return dayName + ', ' + monthName + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  logOut() {
    this.router.navigate(['/auth/logout']);
  }

}
