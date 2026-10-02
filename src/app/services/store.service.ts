import { Injectable } from '@angular/core';
import { DB } from '../models';

const KEY = 'pathshala_db_v1';
const today = () => new Date().toISOString().slice(0, 10);

function seed(): DB {
  return {
    students: [
      { name: 'Aarav Sharma', cls: 'Class 6-8', roll: '101', gender: 'Boy', phone: '9876543210', addr: 'Saragaon' },
      { name: 'Diya Verma', cls: 'Class 1-5', roll: '45', gender: 'Girl', phone: '9876501234', addr: 'Raipur' },
      { name: 'Kabir Nayak', cls: 'Class 9-10', roll: '12', gender: 'Boy', phone: '9988776655', addr: 'Baronda' },
    ],
    staff: [
      { name: 'Mrs. Kiran Nayak', role: 'Principal', sub: 'Management', phone: '8871626560', sal: 45000 },
      { name: 'N.D. Nayak', role: 'Teacher', sub: 'Maths/Computer', phone: '8871626561', sal: 30000 },
      { name: 'Mrs. Isha Verma', role: 'Teacher', sub: 'English', phone: '8871626562', sal: 28000 },
    ],
    fees: [{ date: today(), student: 'Aarav Sharma', amt: 2500, month: 'Sept 2026', status: 'paid' }],
    expenses: [{ date: today(), title: 'Electricity Bill', cat: 'Utilities', amt: 3200 }],
    attendance: {},
    notices: [
      { t: '📢 Admission 2026-27 open — Nursery to Class 11. Last date: 31 March.', d: today() },
      { t: '📝 Unit Test 2 Date Sheet class 6-10 ke liye notice board par lag gayi hai.', d: today() },
      { t: '🏆 Annual Sports Day — 15 December ko school ground me.', d: today() },
    ],
    enquiries: [],
    customGallery: [],
    customVideos: [],
    homeVideo: { mode: 'default', url: '' },
  };
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  db: DB;
  constructor() { this.db = this.load(); this.migrate(); }
  today = today;
  rs(n: number | string) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

  private migrate() {
    if (!this.db.customGallery) this.db.customGallery = [];
    if (!this.db.customVideos) this.db.customVideos = [];
    if (!this.db.homeVideo) this.db.homeVideo = { mode: 'default', url: '' };
  }
  private load(): DB {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw) as DB;
    } catch { /* seed */ }
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }
  save() { localStorage.setItem(KEY, JSON.stringify(this.db)); }
  reset() { this.db = seed(); this.save(); }
  exportJson(): string { return JSON.stringify(this.db, null, 2); }
  exportEncrypted(): string { return btoa(unescape(encodeURIComponent(JSON.stringify(this.db)))); }
  importText(t: string): boolean {
    try {
      const txt = t.trim();
      const obj = JSON.parse(txt.startsWith('{') ? txt : decodeURIComponent(escape(atob(txt))));
      if (!obj.students) return false;
      this.db = obj as DB;
      this.save();
      return true;
    } catch { return false; }
  }
  feesCollected() { return this.db.fees.filter((f) => f.status === 'paid').reduce((a, b) => a + +b.amt, 0); }
  feesPending() { return this.db.fees.filter((f) => f.status === 'pending').reduce((a, b) => a + +b.amt, 0); }
  totalExpense() { return this.db.expenses.reduce((a, b) => a + +b.amt, 0); }
}
