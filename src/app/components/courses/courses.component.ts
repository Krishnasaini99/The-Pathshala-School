import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Course } from '../../courses';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './courses.component.html',
})
export class CoursesComponent {
  get courses() { return this.store.db.courses; }
  detail: Course | null = null;

  constructor(private route: ActivatedRoute, public store: StoreService) {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      this.detail = this.store.db.courses.find((c) => c.id === id) || null;
      window.scrollTo(0, 0);
    });
  }
}
