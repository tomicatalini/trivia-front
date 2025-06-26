import { Routes } from '@angular/router';
import { HomeComponent } from '../../features/pages/home/home.component';
import { SetupComponent } from '../../features/pages/setup/setup.component';
import { HowToComponent } from '../../features/pages/how-to/how-to.component';
import { PlayComponent } from '../../features/pages/play/play.component';
import { DashboardComponent } from '../../features/pages/dashboard/dashboard.component';
import { ResumeComponent } from '../../features/pages/resume/resume.component';
import { RankingComponent } from '../../features/pages/ranking/ranking.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'setup', component: SetupComponent },
      { path: 'ranking', component: RankingComponent },
      { path: 'how-to', component: HowToComponent },
      { path: 'play', component: PlayComponent },
      { path: 'resume', component: ResumeComponent },
    ]
  }
];
