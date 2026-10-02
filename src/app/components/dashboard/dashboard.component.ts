import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { MediaStore } from '../../services/media-store.service';
import { CLASSES, Fee } from '../../models';

type Page = 'overview' | 'students' | 'staff' | 'attendance' | 'fees' | 'expenses' | 'noticesM' | 'enquiries' | 'backup' | 'media' | 'settings';

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
