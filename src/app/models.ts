export interface Student { name: string; cls: string; roll: string; gender: string; phone: string; addr: string; }
export interface Staff { name: string; role: string; sub: string; phone: string; sal: number; }
export interface Fee { date: string; student: string; amt: number; month: string; status: 'paid' | 'pending'; }
export interface Expense { date: string; title: string; cat: string; amt: number; }
export interface Notice { t: string; d: string; }
export interface Enquiry { d: string; name: string; phone: string; cls: string; msg: string; status: 'new' | 'contacted' | 'admitted'; }
export interface CustomPhoto { img: string; t: string; d: string; info: string; }
export interface CustomVideo { cls: string; title: string; subject: string; link: string; localId?: string; }
export interface DB { students: Student[]; staff: Staff[]; fees: Fee[]; expenses: Expense[]; attendance: Record<string, Record<number, string>>; notices: Notice[]; enquiries: Enquiry[]; customGallery: CustomPhoto[]; customVideos: CustomVideo[]; homeVideo: { mode: 'default' | 'youtube' | 'file'; url: string }; cms: any[]; }
export const CLASSES = ['Nursery-UKG', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];
