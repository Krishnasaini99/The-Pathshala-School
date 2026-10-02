import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StoreService } from '../../services/store.service';
import { MediaStore } from '../../services/media-store.service';

const DEFAULT_VIDEO = 'https://videos.pexels.com/video-files/8926913/8926913-hd_1280_720_25fps.mp4';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  defaultVideo = DEFAULT_VIDEO;
  localVideoUrl: string | null = null;
  ytEmbed: SafeResourceUrl | null = null;

  constructor(public store: StoreService, private media: MediaStore, private san: DomSanitizer) {}

  async ngOnInit() {
    const hv = this.store.db.homeVideo;
    if (hv?.mode === 'youtube' && hv.url) {
      const id = this.ytId(hv.url);
      if (id) this.ytEmbed = this.san.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + id);
    } else if (hv?.mode === 'file') {
      const url = await this.media.videoUrl('home-video');
      if (url) this.localVideoUrl = url;
    }
  }

  private ytId(u: string): string | null {
    const m = u.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  }

  get attendToday(): string {
    const att = this.store.db.attendance[this.store.today()] || {};
    const p = Object.values(att).filter((v) => v === 'P').length;
    return this.store.db.students.length ? `${p}/${this.store.db.students.length}` : '—';
  }
}
