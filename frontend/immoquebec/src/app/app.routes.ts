import {Routes} from '@angular/router';
import {AdsListComponent} from './components/ads-list/ads-list.component';
import {AddAdComponent} from './components/add-ad/add-ad.component';
import {AdComponent} from './components/ad/ad.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {HistoryListComponent} from './components/historique/historique.component';
import {AddHistoriqueComponent} from './components/add-historique/add-historique.component';

import {MessengerComponent} from './components/messenger/messenger.component';
import {AuthGuard} from './security/auth.guard';

export const routes: Routes = [{path: 'offers', component: AdsListComponent, canActivate: [AuthGuard]},
  {path: 'for-rent', component: AdsListComponent, canActivate: [AuthGuard]},
  {path: 'for-sale', component: AdsListComponent, canActivate: [AuthGuard]},
  {path: 'low-income', component: AdsListComponent, canActivate: [AuthGuard]},
  {path: 'history', component: HistoryListComponent, canActivate: [AuthGuard]},
  {path: 'add-history', component: AddHistoriqueComponent, canActivate: [AuthGuard]},
  {path: 'add-offer', component: AddAdComponent, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: AddAdComponent, canActivate: [AuthGuard]},
  {path: 'offers/:id', component: AdComponent, canActivate: [AuthGuard]},
  {path: 'search/:keyword', component: AdsListComponent, canActivate: [AuthGuard]},
  {path: 'favorites', component: AdsListComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, data: {registration: false}},
  {path: 'register', component: LoginComponent, data: {registration: true}},
  {path: 'full-info', component: RegistrationComponent, canActivate: [AuthGuard]},
  {path: 'update-info', component: RegistrationComponent, canActivate: [AuthGuard]},
  {path: 'messenger', component: MessengerComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/offers', pathMatch: 'full'},
  {path: '**', redirectTo: '/offers', pathMatch: 'full'}];
