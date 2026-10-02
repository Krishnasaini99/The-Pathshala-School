import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VIDEOS, VIDEO_CLASSES, VideoItem, ytSearch, thumbFor } from '../../videos';
import { StoreService } from '../../services/store.service';
import { MediaStore } from '../../services/media-store.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './videos.component.html',
})
export class VideosComponent implements OnInit {
  videoClasses = VIDEO_CLASSES;
  videoClass = VIDEO_CLASSES[0];
  localUrls: Record<string, string> = {};
  playItem: VideoItem | null = null;
  playLocal: { title: string; url: string } | null = null;

  constructor(public store: StoreService, private media: MediaStore, private san: DomSanitizer) {}

  async ngOnInit() {
    for (const v of this.store.db.customVideos) {
      if (v.localId && !this.localUrls[v.localId]) {
        const url = await this.media.videoUrl(v.localId);
        if (url) this.localUrls[v.localId] = url;
      }
    }
  }

  private toItem(cls: string, v: { title: string; subject: string; link: string; localId?: string }): VideoItem {
    return { title: v.title, subject: v.subject, query: '', thumb: thumbFor(cls), url: (v.localId && this.localUrls[v.localId]) || v.link };
  }

  listOf(cls: string): VideoItem[] {
    const base = VIDEOS[cls] || [];
    const custom = this.store.db.customVideos.filter((v) => v.cls === cls).map((v) => this.toItem(cls, v));
    return [...custom, ...base];
  }

  // Phone uploads section (ISI device)
  localOf(cls: string) {
    return this.store.db.customVideos
      .filter((v) => v.cls === cls && v.localId && this.localUrls[v.localId!])
      .map((v) => ({ title: v.title, subject: v.subject, url: this.localUrls[v.localId!] }));
  }

  isLocal(v: VideoItem) { return !!v.url && v.url.startsWith('blob:'); }
  isYoutube(v: VideoItem) { return !!v.url && !this.isLocal(v) && /youtube\.com|youtu\.be/.test(v.url); }
  ytEmbed(v: VideoItem): SafeResourceUrl | null {
    if (!v.url) return null;
    const m = v.url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    return m ? this.san.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + m[1]) : null;
  }
  playUrl(v: VideoItem) { return this.isLocal(v) ? v.url : this.watchUrl(v); }
  watchUrl(v: VideoItem) { return v.url || ytSearch(v.title + ' ' + v.query); }
}
