import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { DEFAULT_TEACHER_PHOTOS, DEFAULT_TEACHER_BIOS } from '../../defaults';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teachers.component.html',
})
export class TeachersComponent {
  defPhotos = DEFAULT_TEACHER_PHOTOS;
  defBios = DEFAULT_TEACHER_BIOS;

  /** Staff record se photo/bio — dashboard → Staff me edit hota hai */
  tPhoto(i: number) {
    const s = this.store.db.staff[i];
    return s?.photo || this.defPhotos[i % this.defPhotos.length];
  }
  tBio(i: number) {
    const s = this.store.db.staff[i];
    return s?.bio || this.defBios[i % this.defBios.length];
  }

  constructor(public store: StoreService) {}
}
