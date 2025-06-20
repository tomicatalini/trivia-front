import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../model/Auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
})
export class HeaderComponent {
  userData?: Auth | null;
  
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userData = this.auth.getUserData();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
