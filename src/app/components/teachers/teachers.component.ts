import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';

const px = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teachers.component.html',
})
export class TeachersComponent {
  teacherImg = [px('8613120'), px('22616347'), px('34195649')];
  teacherBio = [
    'M.Sc, B.Ed — 15 saal ka teaching anubhav. School ki founder-principal, har bachche ko naam se jaanti hain. Full-time faculty.',
    'MSc, MCA — Maths aur Computer teacher. Olympiad aur coding club ke mentor. Same teacher day one se.',
    'M.A, B.Ed — English teacher. Spoken English club aur annual function ki incharge.',
  ];
  tPhoto(i: number) { return this.teacherImg[i % this.teacherImg.length]; }
  tBio(i: number) { return this.teacherBio[i % this.teacherBio.length]; }

  constructor(public store: StoreService) {}
}
