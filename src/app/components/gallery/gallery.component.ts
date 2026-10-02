import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { DEFAULT_GALLERY } from '../../site-data';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
})
export class GalleryComponent {
  tab: 'notices' | 'gallery' = 'notices';
  zoom: { img: string; title: string; desc: string } | null = null;
  constructor(public store: StoreService) {}
  get gallery() { return [...this.store.db.customGallery, ...DEFAULT_GALLERY]; }
}
