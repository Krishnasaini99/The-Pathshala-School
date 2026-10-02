import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { CLASSES } from '../../models';
import { EBOOKS, EBOOK_CLASSES, EBook } from '../../books';

const px = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './site.component.html',
})
export class SiteComponent {
  tab: 'notices' | 'gallery' = 'notices';
  classes = CLASSES;
  eq = { name: '', phone: '', cls: CLASSES[0], msg: '' };
  eqOk = false;

  // Programs with real Indian photos + detail info
  programs = [
    { img: px('35745596'), t: 'Pre-Primary (Nursery-UKG)', d: 'Khel-khel me seekhna, phonics, rhymes aur activity based learning.', info: 'Nursery-UKG me activity-based learning hota hai: phonics, rhymes, drawing aur khel. Har class me max 25 bachche aur 2 teachers. Timing: subah 8:30 - 12:30.' },
    { img: px('8617938'), t: 'Primary (1-5)', d: 'Strong foundation in Maths, English, Hindi, EVS + Computer.', info: 'Class 1-5 me Maths, English, Hindi, EVS ke saath Computer classes. Weekly tests, smart classes aur spoken English par vishesh dhyan.' },
    { img: px('8617994'), t: 'Middle (6-8)', d: 'Science labs, Olympiad, spoken English aur project work.', info: 'Class 6-8 me science lab practicals, Olympiad training, project work aur English speaking club. Career guidance ki shuruaat yahin se.' },
    { img: px('32148974'), t: 'Secondary (9-12)', d: 'Board preparation, career counselling, JEE/NEET foundation.', info: 'Class 9-12 me board exam ki taiyari ke saath JEE/NEET foundation, career counselling, doubt-clearing rooms aur regular test series.' },
    { img: px('7207355'), t: 'Sports', d: 'Cricket, Football, Kho-Kho, Athletics aur annual sports day.', info: 'Cricket, football, kho-kho aur athletics trained coaches ke saath. Annual Sports Day har saal 15 December ko school ground me.' },
    { img: px('30481579'), t: 'Arts & Culture', d: 'Music, Dance, Drawing, Drama aur educational trips.', info: 'Classical dance, music, drawing aur drama ki regular classes. Annual function me har bachche ko stage par perform karne ka mauka milta hai.' },
  ];

  // Teachers photos (seed order: Principal, Maths, English) + bio
  teacherImg = [px('8613120'), px('22616347'), px('34195649')];
  teacherBio = [
    'M.Sc, B.Ed — 15 saal ka teaching anubhav. School ki founder-principal, har bachche ko naam se jaanti hain.',
    'MSc, MCA — Maths aur Computer teacher. Olympiad aur coding club ke mentor.',
    'M.A, B.Ed — English teacher. Spoken English club aur annual function ki incharge.',
  ];
  tPhoto(i: number) { return this.teacherImg[i % this.teacherImg.length]; }
  tBio(i: number) { return this.teacherBio[i % this.teacherBio.length]; }

  // Gallery with detail info (defaults + admin uploads first)
  defaultGallery = [
    { img: px('28389321'), t: 'Annual Function', d: 'Sanskritik कार्यक्रम की झलक', info: 'Annual function me traditional dance, drama aur music — har class ke bachche stage par perform karte hain. Parents ke liye sabse bada din.' },
    { img: px('5896791'), t: 'Sports Day', d: '15 December — school ground', info: 'Annual Sports Day: 100m race, relay, kho-kho aur March-past. Winners ko medals aur certificates milte hain.' },
    { img: px('26593312'), t: 'Science Exhibition', d: 'Students ke projects', info: 'Science exhibition me working models, charts aur experiments. Best 3 projects ko district level par bheja jata hai.' },
    { img: px('35243021'), t: 'Art & Craft', d: 'Drawing competition', info: 'Drawing, painting aur craft competition har term me. Best artworks school notice board aur annual magazine me chhapte hain.' },
    { img: px('22616346'), t: 'Educational Trip', d: 'Museum learning tour', info: 'Har saal educational trip: museum, science centre aur historical places. Padhai classroom se bahar, asli duniya me.' },
    { img: px('10638069'), t: 'Computer Lab', d: 'Smart classes', info: 'Modern computer lab me har bachche ko weekly practical. Typing, painting, coding basics aur internet safety sikhayi jati hai.' },
  ];
  get gallery() { return [...this.store.db.customGallery, ...this.defaultGallery]; }

  // Image lightbox (click any photo → detail)
  zoom: { img: string; title: string; desc: string } | null = null;
  showZoom(img: string, title: string, desc: string) { this.zoom = { img, title, desc }; }

  // EBook cover colour by subject
  coverClass(sub: string) {
    const s = sub.toLowerCase();
    if (s.includes('hindi')) return 'c-hindi';
    if (s.includes('english')) return 'c-english';
    if (s.includes('math')) return 'c-maths';
    if (s.includes('science') || s.includes('physics')) return 'c-science';
    if (s.includes('chem')) return 'c-chem';
    if (s.includes('sst')) return 'c-sst';
    return 'c-career';
  }

  // EBooks
  ebookClasses = EBOOK_CLASSES;
  ebookClass = EBOOK_CLASSES[0];
  openBook: EBook | null = null;

  booksOf(cls: string): EBook[] { return EBOOKS[cls] || []; }

  constructor(public store: StoreService, private router: Router) {}

  get attendToday(): string {
    const att = this.store.db.attendance[this.store.today()] || {};
    const p = Object.values(att).filter((v) => v === 'P').length;
    return this.store.db.students.length ? `${p}/${this.store.db.students.length}` : '—';
  }
  openDashboard() { this.router.navigate(['/dashboard']); }
  submitEq() {
    if (!this.eq.name.trim() || this.eq.phone.length !== 10) { alert('Naam aur 10-digit mobile zaroori hai'); return; }
    this.store.db.enquiries.push({ d: this.store.today(), name: this.eq.name.trim(), phone: this.eq.phone.trim(), cls: this.eq.cls, msg: this.eq.msg, status: 'new' });
    this.store.save();
    this.eq = { name: '', phone: '', cls: CLASSES[0], msg: '' };
    this.eqOk = true;
    setTimeout(() => (this.eqOk = false), 4000);
  }
}
