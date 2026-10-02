import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EBOOKS, EBOOK_CLASSES, EBook } from '../../books';

@Component({
  selector: 'app-ebooks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ebooks.component.html',
})
export class EbooksComponent {
  ebookClasses = EBOOK_CLASSES;
  ebookClass = EBOOK_CLASSES[0];
  openBook: EBook | null = null;

  booksOf(cls: string): EBook[] { return EBOOKS[cls] || []; }

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
}
