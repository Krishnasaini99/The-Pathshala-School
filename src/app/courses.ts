export interface Course {
  id: string;
  title: string;
  short: string;
  mode: string;
  duration: string;
  teacher: string;
  level: string;
  modules: string[];
  highlights: string[];
  img: string;
}

const px = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const COURSES: Course[] = [
  {
    id: 'pre-primary', title: 'Pre-Primary (Nursery-UKG)', short: 'Khel-khel me seekhna, phonics, rhymes aur activity based learning.',
    mode: 'Offline', duration: '1 Year', teacher: 'Mrs. Kiran Nayak', level: 'Age 3-5',
    modules: ['Phonics & Rhymes', 'Varnamala & ABC', 'Ginti 1-20', 'Drawing & Craft', 'Good Habits'],
    highlights: ['Max 25 bachche per class', '2 teachers har class me', 'Timing 8:30-12:30', 'No bag burden'],
    img: px('35745596'),
  },
  {
    id: 'primary', title: 'Primary (1-5)', short: 'Strong foundation in Maths, English, Hindi, EVS + Computer.',
    mode: 'Offline', duration: '5 Years', teacher: 'Mrs. Isha Verma', level: 'Class 1-5',
    modules: ['Maths Tables & Concepts', 'English Grammar', 'Hindi Vyakaran', 'EVS Projects', 'Computer Basics'],
    highlights: ['Weekly tests', 'Smart classes', 'Spoken English focus', 'Olympiad base'],
    img: px('8617938'),
  },
  {
    id: 'middle', title: 'Middle (6-8)', short: 'Science labs, Olympiad, spoken English aur project work.',
    mode: 'Offline', duration: '3 Years', teacher: 'N.D. Nayak', level: 'Class 6-8',
    modules: ['Science Lab Practicals', 'Olympiad Training', 'English Speaking Club', 'Maths Problem Solving', 'Project Work'],
    highlights: ['Lab + library access', 'Career guidance start', 'Inter-school competitions'],
    img: px('8617994'),
  },
  {
    id: 'secondary', title: 'Secondary (9-12)', short: 'Board preparation, career counselling, JEE/NEET foundation.',
    mode: 'Offline + Online', duration: '4 Years', teacher: 'N.D. Nayak', level: 'Class 9-12',
    modules: ['Board Exam Prep', 'Physics + Chemistry + Maths', 'JEE/NEET Foundation', 'Test Series', 'Career Counselling'],
    highlights: ['Doubt-clearing rooms', '100% board result', 'Topper mentorship'],
    img: px('32148974'),
  },
  {
    id: 'sports', title: 'Sports', short: 'Cricket, Football, Kho-Kho, Athletics aur annual sports day.',
    mode: 'Offline', duration: 'Year-round', teacher: 'PTI Coach', level: 'All classes',
    modules: ['Cricket', 'Football', 'Kho-Kho', 'Athletics', 'Annual Sports Day'],
    highlights: ['Trained coaches', 'District level entry', 'Fitness first'],
    img: px('7207355'),
  },
  {
    id: 'arts', title: 'Arts & Culture', short: 'Music, Dance, Drawing, Drama aur educational trips.',
    mode: 'Offline', duration: 'Year-round', teacher: 'Mrs. Isha Verma', level: 'All classes',
    modules: ['Classical Dance', 'Music', 'Drawing & Painting', 'Drama', 'Educational Trips'],
    highlights: ['Stage for every child', 'Annual function lead roles', 'Art competitions'],
    img: px('30481579'),
  },
];
