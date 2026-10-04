// School ki public links — ek jagah badlo, poori site par lagu.
export interface CMSField { key: string; label: string; group: string; type: 'text' | 'textarea'; value: string; }
export const CMS_DEFAULTS: CMSField[] = [
  { key: 'heroTagline', label: 'Home — Welcome subtitle', group: 'Home', type: 'textarea', value: 'Padhai, Sanskar aur Ujjwal Bhavishya — Nursery se Class 12 tak quality education, khel aur sanskritik vikas ke saath.' },
  { key: 'heroTag', label: 'Home — Highlights points', group: 'Home', type: 'textarea', value: '✅ CGBSE Pattern - English Medium\n✅ Smart Classes & Computer Lab\n✅ Offline-first School OS' },
  { key: 'campusNote', label: 'Home — Campus video note', group: 'Home', type: 'text', value: 'Apna school video ho to dashboard → Media se badlo.' },
  { key: 'aboutTitle', label: 'About — Title', group: 'About', type: 'text', value: 'About Our School' },
  { key: 'aboutMission', label: 'About — Mission paragraph', group: 'About', type: 'textarea', value: 'Har bachche ko achhi padhai, achhe sanskar aur confidence dena hi The PathShala School ka lakshya hai.' },
  { key: 'aboutList', label: 'About — Feature list', group: 'About', type: 'textarea', value: '✅ CGBSE Pattern - English Medium\n✅ Smart Classes & Computer Lab\n✅ Sports, Music, Art & Dance\n✅ School Bus Facility\n✅ Scholarship for Meritorious Students' },
  { key: 'coursesTag', label: 'Courses — Subtitle', group: 'Courses', type: 'text', value: 'Har age group ke liye complete course — curriculum, teacher aur timing ke saath.' },
  { key: 'ebooksTag', label: 'E-Books — Subtitle', group: 'E-Books', type: 'text', value: 'Class chuno — uski saari books khul jayengi. Kisi book par click karke padho ya PDF download karo.' },
  { key: 'videosTag', label: 'Videos — Subtitle', group: 'Videos', type: 'text', value: 'Class chuno — uske learning videos dekho. Mobile se upload ki video yahin chalegi.' },
  { key: 'teachersTag', label: 'Teachers — Subtitle', group: 'Teachers', type: 'text', value: 'Full-time faculty, anubhavi aur caring — same teacher day one se final exam tak.' },
  { key: 'galleryTag', label: 'Gallery — Subtitle', group: 'Gallery', type: 'text', value: 'School ki activities ki photos aur latest notices.' },
  { key: 'contactTag', label: 'Contact — Subtitle', group: 'Contact', type: 'text', value: 'Admission, fees ya kisi bhi sawal ke liye — call karo ya form bharo.' },
  { key: 'addressText', label: 'Contact — Address', group: 'Contact', type: 'textarea', value: 'The PathShala School,\nMain Road, Saragaon,\nRaipur, Chhattisgarh 493225' },
  { key: 'phoneText', label: 'Contact — Phone line', group: 'Contact', type: 'text', value: '+91 88716 26560\nMon-Sat: 8 AM - 2 PM' },
  { key: 'timingText', label: 'Contact — Timing', group: 'Contact', type: 'text', value: 'School: 8 AM - 2 PM\nOffice: 9 AM - 4 PM' },
];

export const SCHOOL = {
  phone: '+91 88716 26560',
  whatsapp:
    'https://wa.me/918871626560?text=' +
    encodeURIComponent('Namaste! The PathShala School me admission ke baare me jaankari chahiye.'),
  // Instagram/Facebook link milte hi yahan bhar dena — buttons apne aap dikhne lagenge
  instagram: '',
  facebook: '',
};
