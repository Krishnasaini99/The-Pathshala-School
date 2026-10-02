import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EbooksComponent } from './components/ebooks/ebooks.component';
import { VideosComponent } from './components/videos/videos.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const guard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.loggedIn) return true;
  router.navigate(['/']);
  return false;
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CoursesComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'ebooks', component: EbooksComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [guard] },
  { path: '**', redirectTo: '' },
];
