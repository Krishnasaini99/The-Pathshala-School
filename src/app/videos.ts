export interface VideoItem { title: string; subject: string; query: string; thumb: string; url?: string; localId?: string; }

const px = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const VIDEO_CLASSES = ['Nursery-UKG', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];

const TH: Record<string, string> = {
  'Nursery-UKG': px('35745596'),
  'Class 1-5': px('8617938'),
  'Class 6-8': px('8617994'),
  'Class 9-10': px('32148974'),
  'Class 11-12': px('267885'),
};

function v(cls: string, title: string, subject: string, query: string): VideoItem {
  return { title, subject, query, thumb: TH[cls] };
}

export const VIDEOS: Record<string, VideoItem[]> = {
  'Nursery-UKG': [
    { ...v('Nursery-UKG', 'Varnamala Geet', 'Hindi', 'hindi varnamala geet kids'), url: 'https://www.youtube.com/watch?v=TM83zp1AkUM' },
    v('Nursery-UKG', 'ABC Phonics Song', 'English', 'abc phonics song kids'),
    v('Nursery-UKG', 'Ginti 1-20', 'Maths', 'ginti 1 to 20 kids hindi'),
  ],
  'Class 1-5': [
    v('Class 1-5', 'Tables 2-10 Tricks', 'Maths', 'tables 2 to 10 tricks kids'),
    v('Class 1-5', 'Noun & Pronoun', 'English', 'noun pronoun class 3 english'),
    v('Class 1-5', 'Sangya aur Sarvnaam', 'Hindi', 'sangya sarvnaam class 4 hindi'),
  ],
  'Class 6-8': [
    v('Class 6-8', 'Prakash aur Chhaya', 'Science', 'light shadow class 6 science hindi'),
    v('Class 6-8', 'Beejganit Basics', 'Maths', 'algebra basics class 7 hindi'),
    v('Class 6-8', 'Letter Writing', 'English', 'letter writing class 7 english'),
  ],
  'Class 9-10': [
    v('Class 9-10', 'Rasayanik Abhikriya', 'Science', 'chemical reactions class 10 hindi'),
    v('Class 9-10', 'Trikonmiti Basics', 'Maths', 'trigonometry class 10 basics hindi'),
    v('Class 9-10', 'Samvidhan ek nazar', 'SST', 'indian constitution class 9 hindi'),
  ],
  'Class 11-12': [
    v('Class 11-12', 'Gati ke Niyam', 'Physics', 'laws of motion class 11 hindi'),
    v('Class 11-12', 'Organic Basics (GOC)', 'Chemistry', 'goc organic chemistry class 11 hindi'),
    v('Class 11-12', 'JEE/NEET Strategy', 'Career', 'jee neet preparation strategy toppers'),
  ],
};

export function ytSearch(q: string) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
}

export function thumbFor(cls: string) { return TH[cls] || TH['Class 1-5']; }
