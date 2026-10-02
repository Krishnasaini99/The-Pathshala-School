import { Injectable } from '@angular/core';

const KEY = 'ps_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  get loggedIn() { return sessionStorage.getItem('ps_login') === '1'; }

  creds(): { u: string; p: string } {
    try {
      const o = JSON.parse(localStorage.getItem(KEY) || '');
      if (o && typeof o.u === 'string') return { u: o.u, p: o.p || '' };
    } catch { /* default */ }
    return { u: 'admin', p: 'pathshala123' };
  }

  login(u: string, p: string): boolean {
    const c = this.creds();
    if (u.trim() === c.u && p === c.p) {
      sessionStorage.setItem('ps_login', '1');
      return true;
    }
    return false;
  }

  // Instagram settings jaisa — ID/password khud badlo. False = validation fail.
  updateCreds(u: string, p: string): boolean {
    if (u.trim().length < 3 || p.length < 4) return false;
    localStorage.setItem(KEY, JSON.stringify({ u: u.trim(), p }));
    return true;
  }

  logout() { sessionStorage.removeItem('ps_login'); }
}
