import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  constructor(public store: StoreService) {}

  aboutList(): string[] {
    return this.store.cmsGet('aboutList', '✅ CGBSE Pattern - English Medium\n✅ Smart Classes & Computer Lab\n✅ Sports, Music, Art & Dance\n✅ School Bus Facility\n✅ Scholarship for Meritorious Students').split('\n');
  }
}
