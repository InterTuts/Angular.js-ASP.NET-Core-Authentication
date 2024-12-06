// System Utils
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App Utils
import { AccountGuard } from '../shared/guards/account.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '../shared/errors/not-found/not-found.component';

// Supported Routes
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AccountGuard]
  }, {
    path: '**',
    component: NotFoundComponent
  }
];

// Configuration
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

// Logic
export class AccountRoutingModule { }
