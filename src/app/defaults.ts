import { COURSES, Course } from './courses';
import { EBOOKS, EBOOK_CLASSES, EBook } from './books';
import { VIDEOS, VideoItem } from './videos';
import { DEFAULT_GALLERY, GalleryItem, px } from './site-data';
import { ExploreCard } from './models';

/** Home page — Explore PathShala cards (default) */
export const DEFAULT_EXPLORE: ExploreCard[] = [
  { icon: '📚', title: 'Courses', desc: 'Pre-Primary se Secondary, Sports aur Arts tak →', link: '/courses', img: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=70' },
  { icon: '📘', title: 'E-Books', desc: 'Class-wise books + free PDF downloads →', link: '/ebooks', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=70' },
  { icon: '🎬', title: 'Videos', desc: 'Learning videos har class ke liye →', link: '/videos', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=70' },
  { icon: '👩‍🏫', title: 'Our Teachers', desc: 'Anubhavi aur caring faculty →', link: '/teachers', img: 'https://images.pexels.com/photos/8613120/pexels-photo-8613120.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { icon: '📸', title: 'Gallery & Notices', desc: 'Photos aur notice board →', link: '/gallery', img: 'https://images.pexels.com/photos/28389321/pexels-photo-28389321.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { icon: '📞', title: 'Contact & Admission', desc: 'Form bhariye, call aayega →', link: '/contact', img: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=800&q=70' },
];

/** Teacher cards default photo + bio (staff ke saath index-wise use hota hai) */
export const DEFAULT_TEACHER_PHOTOS = [px('8613120'), px('22616347'), px('34195649')];
export const DEFAULT_TEACHER_BIOS = [
  'M.Sc, B.Ed — 15 saal ka teaching anubhav. School ki founder-principal, har bachche ko naam se jaanti hain. Full-time faculty.',
  'MSc, MCA — Maths aur Computer teacher. Olympiad aur coding club ke mentor. Same teacher day one se.',
  'M.A, B.Ed — English teacher. Spoken English club aur annual function ki incharge.',
];

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export const defaultCourses = (): Course[] => clone(COURSES);
export const defaultEbooks = (): Record<string, EBook[]> => clone(EBOOKS);
export const defaultVideos = (): Record<string, VideoItem[]> => clone(VIDEOS);
export const defaultGallery = (): GalleryItem[] => clone(DEFAULT_GALLERY);
export const defaultExplore = (): ExploreCard[] => clone(DEFAULT_EXPLORE);
export { EBOOK_CLASSES };
