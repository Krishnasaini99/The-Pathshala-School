import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { SCHOOL } from './school-info';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  social = SCHOOL;
  dark = localStorage.getItem('ps_theme') === 'dark';
  menuOpen = false;
  showLogin = false;
  user = 'admin';
  pass = 'pathshala123';
  err = false;

  constructor(public auth: AuthService, private router: Router) {
    this.applyTheme();
  }
  applyTheme() {
    document.documentElement.dataset['theme'] = this.dark ? 'dark' : 'light';
    localStorage.setItem('ps_theme', this.dark ? 'dark' : 'light');
  }
  toggleTheme() { this.dark = !this.dark; this.applyTheme(); }
  goLogin() {
    if (this.auth.loggedIn) this.router.navigate(['/dashboard']);
    else { this.showLogin = true; this.err = false; }
  }
  doLogin() {
    if (this.auth.login(this.user, this.pass)) {
      this.showLogin = false;
      this.router.navigate(['/dashboard']);
    } else this.err = true;
  }
  logout() { this.auth.logout(); this.router.navigate(['/']); }
}
