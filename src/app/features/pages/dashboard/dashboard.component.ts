import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  standalone: true
})
export class DashboardComponent {

  constructor(
    private router: Router
  ) {}

  go(path: string) {
    this.router.navigate([`/home/${path}`]);
  }

}
