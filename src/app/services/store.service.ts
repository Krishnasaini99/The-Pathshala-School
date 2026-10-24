import { Injectable } from '@angular/core';
import { DB } from '../models';
import { CMS_DEFAULTS } from '../school-info';
import { defaultCourses, defaultEbooks, defaultVideos, defaultGallery, defaultExplore, DEFAULT_TEACHER_PHOTOS, DEFAULT_TEACHER_BIOS } from '../defaults';

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
    cms: CMS_DEFAULTS.map((f) => ({ ...f })),
    explore: defaultExplore(),
    courses: defaultCourses(),
    ebooks: defaultEbooks(),
    videos: defaultVideos(),
    gallery: defaultGallery(),
  };
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  db: DB;
  constructor() { this.db = this.load(); this.migrate(); }
  today = today;
  rs(n: number | string) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

  private migrate() {
    let changed = false;
    const need = <T,>(v: T | undefined | null | '' | any[] | Record<string, any>): boolean =>
      !v || (Array.isArray(v) && !v.length) || (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length);
    if (need(this.db.customGallery)) { this.db.customGallery = []; changed = true; }
    if (need(this.db.customVideos)) { this.db.customVideos = []; changed = true; }
    if (!this.db.homeVideo) { this.db.homeVideo = { mode: 'default', url: '' }; changed = true; }
    if (!this.db.cms || !this.db.cms.length) { this.db.cms = CMS_DEFAULTS.map((f) => ({ ...f })); changed = true; }
    else {
      // Naye CMS fields purane DB me add karo (warna Save silently fail hota tha)
      const have = new Set(this.db.cms.map((c) => c.key));
      for (const f of CMS_DEFAULTS) if (!have.has(f.key)) { this.db.cms.push({ ...f }); changed = true; }
    }
    // New: editable website cards — purane DB me ye fields nahi thi, default se bhar do
    if (need(this.db.explore)) { this.db.explore = defaultExplore(); changed = true; }
    if (need(this.db.courses)) { this.db.courses = defaultCourses(); changed = true; }
    if (need(this.db.ebooks)) { this.db.ebooks = defaultEbooks(); changed = true; }
    if (need(this.db.videos)) { this.db.videos = defaultVideos(); changed = true; }
    if (need(this.db.gallery)) { this.db.gallery = defaultGallery(); changed = true; }
    // Teacher cards: har staff ko photo + bio do (default se)
    (this.db.staff || []).forEach((s, i) => {
      if (!s.photo) { s.photo = DEFAULT_TEACHER_PHOTOS[i % DEFAULT_TEACHER_PHOTOS.length]; changed = true; }
      if (!s.bio) { s.bio = DEFAULT_TEACHER_BIOS[i % DEFAULT_TEACHER_BIOS.length]; changed = true; }
    });
    if (changed) this.save();
  }
  cmsGet(key: string, fallback: string): string {
    const f = this.db.cms?.find((c) => c.key === key);
    return f && f.value.trim() ? f.value : fallback;
  }
  cmsSet(key: string, value: string) {
    const f = this.db.cms?.find((c) => c.key === key);
    if (f) f.value = value;
    else {
      this.db.cms = this.db.cms || [];
      this.db.cms.push({ key, label: key, group: 'Custom', type: 'text', value });
    }
    this.save();
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
