import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { MediaStore } from '../../services/media-store.service';
import { CLASSES, Fee, ExploreCard } from '../../models';
import { CMSField } from '../../school-info';
import { EBOOK_CLASSES, EBook } from '../../books';

type Page = 'overview' | 'students' | 'staff' | 'attendance' | 'fees' | 'expenses' | 'noticesM' | 'enquiries' | 'backup' | 'media' | 'settings' | 'cms' | 'cards';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  page: Page = 'overview';
  classes = CLASSES;
  // students
  sSearch = '';
  sForm = { name: '', cls: CLASSES[0], roll: '', gender: 'Boy', phone: '', addr: '' };
  editS = -1;
  // staff
  tForm = { name: '', role: '', sub: '', phone: '', sal: 0 as number };
  editT = -1;
  // attendance
  aDate = new Date().toISOString().slice(0, 10);
  attend: Record<number, string> = {};
  // fees
  fForm = { student: '', amt: null as number | null, month: '', status: 'paid' as Fee['status'] };
  // expenses
  eForm = { title: '', cat: '', amt: null as number | null, date: '' };
  // notices
  nText = '';
  // backup
  backupText = '';
  // media upload
  photoForm = { title: '', desc: '', info: '' };
  photoData = '';
  videoForm = { cls: CLASSES[0], title: '', subject: '', link: '' };
  videoFile: File | null = null;
  // CMS content editor
  cmsSearch = '';
  cmsGroup = '';
  cmsGroups(): string[] { return [...new Set(this.store.db.cms.map((f) => f.group))]; }
  cmsFiltered(): CMSField[] {
    const q = this.cmsSearch.toLowerCase();
    return this.store.db.cms.filter(
      (f) => (!this.cmsGroup || f.group === this.cmsGroup) &&
             (!q || f.label.toLowerCase().includes(q) || f.key.toLowerCase().includes(q) || f.value.toLowerCase().includes(q))
    );
  }
  saveCms(f: CMSField) { this.store.cmsSet(f.key, f.value); alert('✅ Save ho gaya — website par dikhega'); }

  // ============ 🧩 CONTENT MANAGER (site ke cards edit) ============
  cardsPage: 'explore' | 'courses' | 'ebooks' | 'videos' | 'teachers' | 'gallery' | 'contact' = 'explore';
  msg = '';
  private flash(m: string) { this.msg = m; setTimeout(() => { if (this.msg === m) this.msg = ''; }, 2500); }
  ebookCls = EBOOK_CLASSES[0];
  ebookClassList = EBOOK_CLASSES;
  videoCls = CLASSES[0];
  contactForm = { address: '', phone: '', timing: '', footer: '' };
  loadContact() {
    this.contactForm = {
      address: this.store.cmsGet('addressText', ''),
      phone: this.store.cmsGet('phoneText', ''),
      timing: this.store.cmsGet('timingText', ''),
      footer: this.store.cmsGet('footerNote', ''),
    };
  }
  restoreBackup() {
    if (!confirm('Purana local data wapas laayein? Abhi ka data cloud me safe rahega.')) return;
    if (this.store.restoreLocalBackup()) {
      this.loadContact();
      this.flash('✅ Purana data wapas aa gaya — cloud par bhi save ho gaya');
      alert('✅ Purana data wapas aa gaya.\n\nWebsite kholo (Ctrl+F5) — address/phone wahi purana dikhega.');
    } else {
      alert('❌ Is browser me purana backup nahi mila.');
    }
  }
  saveContact() {
    try {
      this.store.cmsSet('addressText', this.contactForm.address);
      this.store.cmsSet('phoneText', this.contactForm.phone);
      this.store.cmsSet('timingText', this.contactForm.timing);
      this.store.cmsSet('footerNote', this.contactForm.footer);
      this.flash('✅ Address save ho gaya — Contact page + footer par dikhega');
    } catch {
      alert('❌ Storage full hai — address save nahi hua. Backup lekar kuch photos delete karo.');
    }
  }
  private readImage(ev: Event): Promise<string> {
    return new Promise((res, rej) => {
      const f = (ev.target as HTMLInputElement).files?.[0];
      if (!f) return rej('no file');
      const rd = new FileReader();
      rd.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 700;
          const sc = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * sc);
          c.height = Math.round(img.height * sc);
          c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = () => rej('bad image');
        img.src = rd.result as string;
      };
      rd.onerror = () => rej('read fail');
      rd.readAsDataURL(f);
    });
  }

  /** Save karo — storage full ho to saaf message do (silent fail nahi) */
  private saveSafe(): boolean {
    try {
      this.store.save();
      return true;
    } catch {
      alert('❌ Browser storage full hai — photo save nahi hui.\n\nUpay: Dashboard → Backup se JSON export karo, phir kuch purani photos delete karke dobara try karo. Ya chhoti photo chuno.');
      return false;
    }
  }
  storageKB(): number {
    try { return Math.round((localStorage.getItem('pathshala_db_v1') || '').length / 1024); } catch { return 0; }
  }

  // ---- Home: Explore cards ----
  editEx = -1;
  exForm: ExploreCard = { icon: '📚', title: '', desc: '', link: '/courses', img: '' };
  editExplore(i: number) { this.editEx = i; this.exForm = { ...this.store.db.explore[i] }; }
  newExplore() { this.editEx = -1; this.exForm = { icon: '✨', title: '', desc: '', link: '/courses', img: '' }; }
  saveExplore() {
    if (!this.exForm.title.trim()) { this.flash('❌ Title zaroori hai'); return; }
    const o: ExploreCard = { ...this.exForm, title: this.exForm.title.trim(), desc: this.exForm.desc.trim() };
    if (this.editEx >= 0) this.store.db.explore[this.editEx] = o;
    else this.store.db.explore.push(o);
    if (!this.saveSafe()) return;
    this.newExplore(); this.flash('✅ Explore card save ho gaya');
  }
  delExplore(i: number) { if (confirm('Card delete?')) { this.store.db.explore.splice(i, 1); this.store.save(); } }
  async exImg(ev: Event) {
    try {
      this.exForm.img = await this.readImage(ev);
      if (this.editEx >= 0) {
        this.store.db.explore[this.editEx].img = this.exForm.img;
        if (this.saveSafe()) this.flash('✅ Photo save ho gayi — website par dikhegi');
      } else this.flash('✅ Photo ready — ab Save Card dabao');
    } catch { this.flash('❌ Image read nahi hui'); }
  }

  // ---- Courses cards ----
  editCo = -1;
  coForm: any = { id: '', title: '', short: '', mode: 'Offline', duration: '', teacher: '', level: '', modules: '', highlights: '', img: '' };
  editCourse(i: number) {
    this.editCo = i;
    const c = this.store.db.courses[i];
    this.coForm = { ...c, modules: c.modules.join('\n'), highlights: c.highlights.join('\n') };
  }
  newCourse() {
    this.editCo = -1;
    this.coForm = { id: '', title: '', short: '', mode: 'Offline', duration: '1 Year', teacher: '', level: '', modules: '', highlights: '', img: '' };
  }
  saveCourse() {
    if (!this.coForm.title.trim()) { this.flash('❌ Title zaroori hai'); return; }
    const id = this.coForm.id.trim() || this.coForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'course-' + Date.now();
    const o = {
      ...this.coForm, id,
      title: this.coForm.title.trim(), short: this.coForm.short.trim(),
      modules: this.coForm.modules.split('\n').map((s: string) => s.trim()).filter(Boolean),
      highlights: this.coForm.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean),
    };
    if (this.editCo >= 0) this.store.db.courses[this.editCo] = o;
    else this.store.db.courses.push(o);
    if (!this.saveSafe()) return;
    this.newCourse(); this.flash('✅ Course card save ho gaya');
  }
  delCourse(i: number) { if (confirm('Course delete?')) { this.store.db.courses.splice(i, 1); this.store.save(); } }
  async coImg(ev: Event) {
    try {
      this.coForm.img = await this.readImage(ev);
      if (this.editCo >= 0) {
        this.store.db.courses[this.editCo].img = this.coForm.img;
        if (this.saveSafe()) this.flash('✅ Photo save ho gayi — website par dikhegi');
      } else this.flash('✅ Photo ready — ab Save dabao');
    } catch { this.flash('❌ Image read nahi hui'); }
  }

  // ---- E-Books ----
  editEb: { cls: string; i: number } | null = null;
  ebForm: any = { title: '', subject: '', pages: 20, file: '', chapters: [] };
  booksOf(cls: string): EBook[] { return this.store.db.ebooks?.[cls] || []; }
  editBook(cls: string, i: number) {
    this.editEb = { cls, i };
    const b = this.store.db.ebooks[cls][i];
    this.ebForm = {
      title: b.title, subject: b.subject, pages: b.pages, file: b.file || '', img: b.img || '',
      chapters: b.chapters.map((c) => ({ t: c.t, body: c.body.join('\n') })),
    };
  }
  newBook() {
    this.editEb = null;
    this.ebForm = { title: '', subject: '', pages: 20, file: '', img: '', chapters: [{ t: 'Chapter 1', body: '' }] };
  }
  addChapter() { this.ebForm.chapters.push({ t: 'Chapter ' + (this.ebForm.chapters.length + 1), body: '' }); }
  delChapter(i: number) { this.ebForm.chapters.splice(i, 1); }
  saveBook() {
    if (!this.ebForm.title.trim()) { this.flash('❌ Book title zaroori hai'); return; }
    const b: EBook = {
      title: this.ebForm.title.trim(), subject: this.ebForm.subject.trim() || 'General',
      pages: +this.ebForm.pages || 0, file: this.ebForm.file.trim() || undefined,
      img: this.ebForm.img || undefined,
      chapters: this.ebForm.chapters
        .map((c: any) => ({ t: (c.t || 'Chapter').trim(), body: String(c.body ?? '').split('\n').map((x: string) => x.trim()) }))
        .filter((c: any) => c.body.length),
    };
    if (!this.store.db.ebooks[this.ebookCls]) this.store.db.ebooks[this.ebookCls] = [];
    if (this.editEb) this.store.db.ebooks[this.editEb.cls][this.editEb.i] = b;
    else this.store.db.ebooks[this.ebookCls].push(b);
    if (!this.saveSafe()) return;
    this.newBook(); this.flash('✅ E-Book save ho gaya — ' + this.ebookCls);
  }
  delBook(cls: string, i: number) { if (confirm('Book delete?')) { this.store.db.ebooks[cls].splice(i, 1); this.store.save(); } }
  async ebImg(ev: Event) {
    try {
      this.ebForm.img = await this.readImage(ev);
      if (this.editEb) {
        this.store.db.ebooks[this.editEb.cls][this.editEb.i].img = this.ebForm.img;
        if (this.saveSafe()) this.flash('✅ Cover save ho gaya — website par dikhega');
      } else this.flash('✅ Cover ready — ab Save Book dabao');
    } catch { this.flash('❌ Image read nahi hui'); }
  }

  // ---- Videos ----
  editVi: { cls: string; i: number } | null = null;
  viForm: any = { title: '', subject: '', url: '', thumb: '', query: '' };
  editVideo(cls: string, i: number) {
    this.editVi = { cls, i };
    const v = this.store.db.videos[cls][i];
    this.viForm = { title: v.title, subject: v.subject, url: v.url || '', thumb: v.thumb || '', query: v.query || '' };
  }
  newVideo() {
    this.editVi = null;
    this.viForm = { title: '', subject: '', url: '', thumb: '', query: '' };
  }
  saveVideoCard() {
    if (!this.viForm.title.trim()) { this.flash('❌ Video title zaroori hai'); return; }
    const v = {
      title: this.viForm.title.trim(), subject: this.viForm.subject.trim() || 'General',
      url: this.viForm.url.trim() || undefined, thumb: this.viForm.thumb, query: this.viForm.query.trim(),
    };
    if (!this.store.db.videos[this.videoCls]) this.store.db.videos[this.videoCls] = [];
    if (this.editVi) this.store.db.videos[this.editVi.cls][this.editVi.i] = v as any;
    else this.store.db.videos[this.videoCls].push(v as any);
    if (!this.saveSafe()) return;
    this.newVideo(); this.flash('✅ Video card save ho gaya — ' + this.videoCls);
  }
  delVideoItem(cls: string, i: number) { if (confirm('Video delete?')) { this.store.db.videos[cls].splice(i, 1); this.store.save(); } }
  async viThumb(ev: Event) {
    try {
      this.viForm.thumb = await this.readImage(ev);
      if (this.editVi) {
        this.store.db.videos[this.editVi.cls][this.editVi.i].thumb = this.viForm.thumb;
        if (this.saveSafe()) this.flash('✅ Thumbnail save ho gaya');
      } else this.flash('✅ Thumbnail ready — ab Save dabao');
    } catch { this.flash('❌ Image read nahi hui'); }
  }

  // ---- Teachers (Staff card photo + bio) ----
  saveTeacherCard(i: number) { if (this.saveSafe()) this.flash('✅ Teacher card save ho gaya'); }
  async tPhoto(ev: Event, i: number) {
    try {
      this.store.db.staff[i].photo = await this.readImage(ev);
      if (this.saveSafe()) this.flash('✅ Photo update ho gayi — website par dikhegi');
    } catch { this.flash('❌ Image read nahi hui'); }
  }
  delTeacher(i: number) { if (confirm('Teacher delete?')) { this.store.db.staff.splice(i, 1); this.store.save(); } }
  newTeacher() { this.store.db.staff.push({ name: 'Naya Teacher', role: 'Teacher', sub: '', phone: '', sal: 0, photo: '', bio: '' }); this.store.save(); }

  // ---- Gallery (default gallery items) ----
  editGa = -1;
  gaForm: any = { t: '', d: '', info: '', img: '' };
  editGal(i: number) { this.editGa = i; this.gaForm = { ...this.store.db.gallery[i] }; }
  newGal() { this.editGa = -1; this.gaForm = { t: '', d: '', info: '', img: '' }; }
  saveGal() {
    if (!this.gaForm.t.trim()) { this.flash('❌ Title zaroori hai'); return; }
    const o = { ...this.gaForm, t: this.gaForm.t.trim(), d: this.gaForm.d.trim(), info: this.gaForm.info.trim() || this.gaForm.t.trim() };
    if (this.editGa >= 0) this.store.db.gallery[this.editGa] = o;
    else this.store.db.gallery.push(o);
    if (!this.saveSafe()) return;
    this.newGal(); this.flash('✅ Gallery card save ho gaya');
  }
  delGal(i: number) { if (confirm('Photo delete?')) { this.store.db.gallery.splice(i, 1); this.store.save(); } }
  async gaImg(ev: Event) {
    try {
      this.gaForm.img = await this.readImage(ev);
      if (this.editGa >= 0) {
        this.store.db.gallery[this.editGa].img = this.gaForm.img;
        if (this.saveSafe()) this.flash('✅ Photo save ho gayi — gallery me dikhegi');
      } else this.flash('✅ Photo ready — ab Save dabao');
    } catch { this.flash('❌ Image read nahi hui'); }
  }

  // home page video (Media se change)
  hvMode: 'default' | 'youtube' | 'file' = 'default';
  hvUrl = '';
  hvFile: File | null = null;
  // login settings (Instagram jaisa)
  setUser = '';
  setPass = '';
  setNewPass = '';
  credMsg = '';

  constructor(public store: StoreService, public auth: AuthService, private media: MediaStore) {
    this.loadAttend();
    const c = this.auth.creds();
    this.setUser = c.u;
    this.hvMode = this.store.db.homeVideo?.mode || 'default';
    this.hvUrl = this.store.db.homeVideo?.url || '';
    this.loadContact();
    if (this.store.db.students.length) this.fForm.student = this.store.db.students[0].name;
  }

  get newEqCount() { return this.store.db.enquiries.filter((e) => e.status === 'new').length; }
  filteredStudents() {
    const q = this.sSearch.toLowerCase();
    return this.store.db.students.filter((s) => (s.name + s.roll + s.cls).toLowerCase().includes(q));
  }

  // Students
  saveStudent() {
    if (!this.sForm.name.trim()) { alert('Name zaroori hai'); return; }
    if (this.editS >= 0) this.store.db.students[this.editS] = { ...this.sForm };
    else this.store.db.students.push({ ...this.sForm });
    this.store.save(); this.cancelStudent();
  }
  editStudent(i: number) { this.editS = i; this.sForm = { ...this.store.db.students[i] }; }
  cancelStudent() { this.editS = -1; this.sForm = { name: '', cls: CLASSES[0], roll: '', gender: 'Boy', phone: '', addr: '' }; }
  delStudent(i: number) { if (confirm('Delete student?')) { this.store.db.students.splice(i, 1); this.store.save(); } }
  csv() {
    const c = 'Name,Class,Roll,Phone\n' + this.store.db.students.map((s) => `"${s.name}","${s.cls}","${s.roll}","${s.phone}"`).join('\n');
    this.download(c, 'students.csv', 'text/csv');
  }

  // Staff
  saveStaff() {
    if (!this.tForm.name.trim()) { alert('Name zaroori hai'); return; }
    const o = { ...this.tForm, role: this.tForm.role || 'Teacher', sal: +this.tForm.sal || 0 };
    if (this.editT >= 0) this.store.db.staff[this.editT] = o;
    else this.store.db.staff.push(o);
    this.store.save(); this.cancelStaff();
  }
  editStaff(i: number) { this.editT = i; this.tForm = { ...this.store.db.staff[i] }; }
  cancelStaff() { this.editT = -1; this.tForm = { name: '', role: '', sub: '', phone: '', sal: 0 }; }
  delStaff(i: number) { if (confirm('Delete staff?')) { this.store.db.staff.splice(i, 1); this.store.save(); } }

  // Attendance
  loadAttend() { this.attend = { ...(this.store.db.attendance[this.aDate] || {}) }; }
  setAtt(i: number, v: string) { this.attend[i] = v; }
  allPresent() { this.store.db.students.forEach((_, i) => (this.attend[i] = 'P')); }
  saveAttend() { this.store.db.attendance[this.aDate] = { ...this.attend }; this.store.save(); alert('Attendance saved: ' + this.aDate); }

  // Fees
  saveFee() {
    if (!this.fForm.amt) { alert('Amount zaroori hai'); return; }
    this.store.db.fees.push({ date: this.store.today(), student: this.fForm.student, amt: +this.fForm.amt, month: this.fForm.month || 'Sept 2026', status: this.fForm.status });
    this.store.save(); this.fForm.amt = null; this.fForm.month = '';
  }
  delFee(i: number) { if (confirm('Delete fee record?')) { this.store.db.fees.splice(i, 1); this.store.save(); } }

  // Expenses
  saveExp() {
    if (!this.eForm.title.trim() || !this.eForm.amt) { alert('Title + Amount zaroori'); return; }
    this.store.db.expenses.push({ date: this.eForm.date || this.store.today(), title: this.eForm.title.trim(), cat: this.eForm.cat.trim(), amt: +this.eForm.amt });
    this.store.save(); this.eForm = { title: '', cat: '', amt: null, date: '' };
  }
  delExp(i: number) { if (confirm('Delete expense?')) { this.store.db.expenses.splice(i, 1); this.store.save(); } }

  // Notices
  publishNotice() {
    if (!this.nText.trim()) return;
    this.store.db.notices.unshift({ t: this.nText.trim(), d: this.store.today() });
    this.store.save(); this.nText = '';
  }
  delNotice(i: number) { if (confirm('Delete notice?')) { this.store.db.notices.splice(i, 1); this.store.save(); } }

  // Enquiries
  setQ(i: number, v: string) { this.store.db.enquiries[i].status = v as never; this.store.save(); }
  delQ(i: number) { this.store.db.enquiries.splice(i, 1); this.store.save(); }

  // Backup
  exportJson() { this.download(this.store.exportJson(), 'pathshala-backup.json', 'application/json'); }
  enc() { this.backupText = this.store.exportEncrypted(); alert('Encrypted text ready — copy karke Google Drive me rakhein'); }

  // Media upload (Gallery photos + Videos)
  onPhotoFile(ev: Event) {
    const f = (ev.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * sc);
        c.height = Math.round(img.height * sc);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        this.photoData = c.toDataURL('image/jpeg', 0.72);
      };
      img.src = rd.result as string;
    };
    rd.readAsDataURL(f);
  }
  savePhoto() {
    if (!this.photoData) { alert('Pehle photo file chuno'); return; }
    if (!this.photoForm.title.trim()) { alert('Title likho'); return; }
    try {
      this.store.db.customGallery.unshift({ img: this.photoData, t: this.photoForm.title.trim(), d: this.photoForm.desc.trim() || 'School gallery', info: this.photoForm.info.trim() || this.photoForm.title.trim() });
      this.store.save();
      this.photoForm = { title: '', desc: '', info: '' };
      this.photoData = '';
      alert('Photo gallery me add ho gayi ✅');
    } catch { alert('❌ Storage full hai — purani backup export karke clear karo'); }
  }
  delPhoto(i: number) { if (confirm('Delete photo?')) { this.store.db.customGallery.splice(i, 1); this.store.save(); } }
  onVideoFile(ev: Event) { this.videoFile = (ev.target as HTMLInputElement).files?.[0] || null; }
  async saveVideo() {
    if (!this.videoForm.title.trim()) { alert('Title likho'); return; }
    if (this.videoFile) {
      // Direct mobile/gallery video → IndexedDB me save (bina YouTube)
      try {
        const id = 'lv' + Date.now();
        await this.media.saveVideo(id, this.videoFile);
        this.store.db.customVideos.push({ cls: this.videoForm.cls, title: this.videoForm.title.trim(), subject: this.videoForm.subject.trim() || 'General', link: '', localId: id });
        this.store.save();
        this.videoForm = { cls: CLASSES[0], title: '', subject: '', link: '' };
        this.videoFile = null;
        alert('Video upload ho gayi ✅ — Video page par chalegi');
      } catch { alert('❌ Video save nahi hui — file bahut badi ho sakti hai'); }
      return;
    }
    if (!this.videoForm.link.trim()) { alert('Video file chuno YA YouTube link dalo'); return; }
    this.store.db.customVideos.push({ cls: this.videoForm.cls, title: this.videoForm.title.trim(), subject: this.videoForm.subject.trim() || 'General', link: this.videoForm.link.trim() });
    this.store.save();
    this.videoForm = { cls: CLASSES[0], title: '', subject: '', link: '' };
    alert('Video add ho gayi ✅');
  }
  onHvFile(ev: Event) { this.hvFile = (ev.target as HTMLInputElement).files?.[0] || null; }
  async saveHomeVideo() {
    if (this.hvMode === 'youtube' && !this.hvUrl.trim()) { alert('YouTube link dalo'); return; }
    if (this.hvMode === 'file' && !this.hvFile) { alert('Video file chuno'); return; }
    try {
      if (this.hvMode === 'file' && this.hvFile) await this.media.saveVideo('home-video', this.hvFile);
      this.store.db.homeVideo = { mode: this.hvMode, url: this.hvUrl.trim() };
      this.store.save();
      this.hvFile = null;
      alert('✅ Home page video update ho gaya!');
    } catch { alert('❌ Save fail — file bahut badi ho sakti hai'); }
  }
  async delVideo(i: number) {
    if (!confirm('Delete video?')) return;
    const v = this.store.db.customVideos[i];
    if (v.localId) { try { await this.media.delVideo(v.localId); } catch { /* ignore */ } }
    this.store.db.customVideos.splice(i, 1);
    this.store.save();
  }
  saveCreds() {
    const c = this.auth.creds();
    if (this.setPass !== c.p) { this.credMsg = '❌ Purana password galat hai.'; return; }
    if (this.auth.updateCreds(this.setUser, this.setNewPass)) {
      this.credMsg = '✅ Login ID-Password update ho gaya! Agli baar naye se login karna.';
      this.setPass = ''; this.setNewPass = '';
    } else this.credMsg = '❌ ID min 3 aur naya password min 4 characters rakho.';
  }
  imp() {
    if (this.store.importText(this.backupText)) { this.loadAttend(); alert('Backup restored ✅'); }
    else alert('❌ Invalid backup');
  }
  wipe() { if (confirm('Saara data delete?')) { this.store.reset(); this.loadAttend(); } }

  download(content: string, name: string, type: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
  }
}
