// System Utils
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App Utils
import { AccountGuard } from '../shared/guards/account.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

// Supported Routes
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AccountGuard]
  }
];

// Configuration
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

// Logic
export class AccountRoutingModule { }
