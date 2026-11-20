import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const BASE = 'https://the-pathshala-school-web.web.app';
const OG_IMAGE =
  'https://images.pexels.com/photos/8617938/pexels-photo-8617938.jpeg?auto=compress&cs=tinysrgb&w=1200';

interface PageSeo {
  title: string;
  desc: string;
  keywords?: string;
}

/** Har page ka apna title + description (Google ke liye) */
const PAGES: Record<string, PageSeo> = {
  '': {
    title: 'The PathShala School, Raipur — Nursery se Class 12 | Admission 2026-27',
    desc: 'The PathShala School, Saragaon Raipur — Nursery se Class 12 tak English-medium education, smart classes, computer lab, sports, arts, E-Books aur video library. Admission 2026-27 open.',
    keywords: 'PathShala School Raipur, best school in Raipur, Saragaon school, English medium school Raipur, admission 2026-27, CGBSE school',
  },
  about: {
    title: 'About Us — The PathShala School, Saragaon Raipur',
    desc: 'The PathShala School ke baare me — hamara mission, vision, teaching approach aur school ki values. Padhai, Sanskar aur Ujjwal Bhavishya.',
    keywords: 'about PathShala School, school mission Raipur, Saragaon school information',
  },
  courses: {
    title: 'Courses & Classes (Nursery – Class 12) — The PathShala School Raipur',
    desc: 'Pre-Primary, Primary, Middle aur Secondary — har class ke liye complete course, curriculum, activities aur timing. CGBSE pattern English-medium.',
    keywords: 'school courses Raipur, nursery admission, class 1 to 12 school, CGBSE syllabus, pre primary school Raipur',
  },
  teachers: {
    title: 'Our Teachers & Faculty — The PathShala School Raipur',
    desc: 'Anubhavi aur caring teachers — qualified faculty jo har bachche ko naam se jaanti hai. Principal, Maths, English, Science aur Computer teachers.',
    keywords: 'school teachers Raipur, best faculty Saragaon, qualified teachers Chhattisgarh',
  },
  gallery: {
    title: 'Gallery & Notice Board — The PathShala School Raipur',
    desc: 'School ki photos — annual function, sports day, science exhibition, art & craft, educational trips aur computer lab. Latest notices aur updates.',
    keywords: 'school gallery Raipur, annual function photos, sports day school, school notices',
  },
  contact: {
    title: 'Contact & Admission Enquiry — The PathShala School, Saragaon Raipur',
    desc: 'Admission enquiry, fees aur kisi bhi sawal ke liye contact karo. Address, phone number, school timing aur online admission form.',
    keywords: 'school contact Raipur, admission form, school fees enquiry, Saragaon school address, school phone number Raipur',
  },
  ebooks: {
    title: 'Free E-Books & PDF Library (Class-wise) — The PathShala School',
    desc: 'Class-wise free E-Books aur PDF notes — Hindi, English, Maths, Science aur SST. Ghar baithe padho, download karo, bilkul free.',
    keywords: 'free school ebooks, class wise pdf notes, CGBSE books pdf, online study material Hindi',
  },
  videos: {
    title: 'Learning Videos (Class-wise) — The PathShala School Raipur',
    desc: 'Har class ke liye learning videos — Maths, Science, English aur Computer. School ke teachers ke banaye videos, site par hi dekho.',
    keywords: 'school learning videos, online classes Raipur, maths video class, science video class Hindi',
  },
  dashboard: {
    title: 'School Dashboard — The PathShala School',
    desc: 'Admin dashboard — students, staff, fees, attendance aur website content.',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);
  private router = inject(Router);
  private started = false;

  /** AppComponent se ek baar call hota hai */
  start() {
    if (this.started) return;
    this.started = true;
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.apply(e.urlAfterRedirects || e.url));
    this.apply(this.router.url);
  }

  private apply(url: string) {
    const path = url.split('?')[0].split('#')[0];
    const seg = path.split('/').filter(Boolean)[0] || '';
    const isDash = seg === 'dashboard';
    const page = PAGES[seg] || PAGES[''];
    const title = isDash ? PAGES['dashboard'].title : page.title;
    const desc = isDash ? PAGES['dashboard'].desc : page.desc;
    const canonical = BASE + (seg ? '/' + seg : '/');

    this.title.setTitle(title);

    if (isDash) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    }
    this.meta.updateTag({ name: 'description', content: desc });
    if (page.keywords) this.meta.updateTag({ name: 'keywords', content: page.keywords });

    // Open Graph (WhatsApp / Facebook / LinkedIn share)
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:locale', content: 'hi_IN' });

    // Twitter / X
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });

    this.setCanonical(canonical);
    this.setBreadcrumb(seg, page.title);
  }

  private setCanonical(href: string) {
    let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  /** Breadcrumb structured data (Google me page hierarchy dikhti hai) */
  private setBreadcrumb(seg: string, title: string) {
    const id = 'ps-breadcrumb-ld';
    let el = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = this.doc.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      this.doc.head.appendChild(el);
    }
    if (!seg || seg === 'dashboard') {
      el.textContent = '';
      return;
    }
    const name = title.split('—')[0].trim();
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
        { '@type': 'ListItem', position: 2, name, item: BASE + '/' + seg },
      ],
    });
  }
}
