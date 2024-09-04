import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { AddListingComponent } from './pages/add-listing/add-listing.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthguardService } from './service/authguard.service';
import { MyListingsComponent } from './pages/my-listings/my-listings.component';
import { MyListingDetailsComponent } from './pages/my-listing-details/my-listing-details.component';
import { ListingDetailsComponent } from './pages/listing-details/listing-details.component';
import { MyListingEditComponent } from './pages/my-listing-edit/my-listing-edit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DataPanelComponent } from './pages/data-panel/data-panel.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardService],
    children: [
      {
        path: 'add-listing',
        component: AddListingComponent,
        canActivate: [AuthguardService],
      },
      {
        path: 'listing-details',
        component: ListingDetailsComponent,
        canActivate: [AuthguardService],
      },
    ],
  },
  {
    path: 'my-listings',
    component: MyListingsComponent,
    canActivate: [AuthguardService],
    children: [
      {
        path: 'details',
        component: MyListingDetailsComponent,
        canActivate: [AuthguardService],
      },
      {
        path: 'edit',
        component: MyListingEditComponent,
        canActivate: [AuthguardService],
      },
    ],
  },
  { path: 'data-panel', component: DataPanelComponent, canActivate: [AuthguardService] },
];
