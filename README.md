# The PathShala School — Angular version

Vanilla HTML/CSS/JS site ko Angular 17 (standalone components + routing) me convert kiya gaya hai.
Purani site backup me hai: `legacy-vanilla/` (index.html, app.js, styles.css).

## Structure
- `src/app/app.component.*` — header, theme, login modal, router-outlet
- `src/app/components/site/` — public website (Home, About, Programs, Teachers, Notices+Gallery, Admission, Contact)
- `src/app/components/dashboard/` — School OS (Overview, Students, Staff, Attendance, Fees, Expenses, Notices, Enquiries, Backup)
- `src/app/services/store.service.ts` — offline-first localStorage DB (same key `pathshala_db_v1`)
- `src/app/services/auth.service.ts` — admin/pathshala123 login (sessionStorage)
- `src/app/models.ts`, `app.routes.ts`, `app.config.ts`

## Chalane ke liye (Node wali machine par)
```
npm install
ng serve
```
Browser: http://localhost:4200 — Login: admin / pathshala123

## Build
```
ng build
```
Output: `dist/pathshala-school/`
