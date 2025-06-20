import { Routes } from '@angular/router';
import { HomeComponent } from '../../features/pages/home/home.component';
import { SetupComponent } from '../../features/pages/setup/setup.component';
import { TopResultsComponent } from '../../features/pages/top-results/top-results.component';
import { HowToComponent } from '../../features/pages/how-to/how-to.component';
import { PlayComponent } from '../../features/pages/play/play.component';
import { DashboardComponent } from '../../features/pages/dashboard/dashboard.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'setup', component: SetupComponent },
      { path: 'top', component: TopResultsComponent },
      { path: 'how-to', component: HowToComponent },
      { path: 'play', component: PlayComponent },
    ]
  }
];
