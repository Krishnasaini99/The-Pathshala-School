export interface EChapter { t: string; body: string[]; }
export interface EBook { title: string; subject: string; pages: number; chapters: EChapter[]; file?: string; img?: string; }

export const EBOOK_CLASSES = ['Nursery-UKG', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];

export const EBOOKS: Record<string, EBook[]> = {
  'Nursery-UKG': [
    { title: 'Varnamala aur Rhymes', subject: 'Hindi', pages: 24, chapters: [
      { t: 'Swar: अ से अः', body: ['अ, आ, इ, ई, उ, ऊ — roz zor se bolo.', 'Har swar ke saath ek shabd: अ से अनार, आ से आम.', 'Maa ke saath dohrayein — subah 10 minute practice.'] },
      { t: 'Vyanjan: क से ज्ञ', body: ['क, ख, ग, घ — k se kabootar.', 'Chitra dekhkar akshar pehchano.', 'Ungli se hawa me likhne ka khel khelo.'] },
      { t: 'Rhymes', body: ['Machhli jal ki rani hai...', 'Aloo kachaloo beta...', 'Action ke saath gao — yaad jaldi hoga.'] } ] },
    { title: 'ABC & Phonics Fun', subject: 'English', pages: 22, chapters: [
      { t: 'A to Z', body: ['A for Apple, B for Ball — picture ke saath.', 'Capital + small dono likhna seekho.', 'Alphabet song roz gao.'] },
      { t: 'Phonics Sounds', body: ['a says "a" as in apple, b says "ba" as in ball.', 'CVC words: cat, pen, dog — jodkar padho.', 'Sound game: ghar me "s" se shuru cheezein dhoondho.'] },
      { t: 'First Words', body: ['My, I, see, like — sight words yaad karo.', 'Flash cards banao aur khelo.', 'Apna naam likhna seekho.'] } ] },
    { title: 'Ginti 1 se 20', subject: 'Maths', pages: 20, chapters: [
      { t: 'Ginti 1-10', body: ['Ungliyon par gino: 1 ek, 2 do...', 'Seedhi aur ulti ginti dono.', 'Khilono se ginti ka khel.'] },
      { t: 'Ginti 11-20', body: ['11 gyarah se 20 bees tak.', 'Number line par chalo.', 'Har number likhna practice karo.'] },
      { t: 'Aakar aur Rang', body: ['Gol, tikona, chaukor pehchano.', 'Laal, neela, peela, hara rang.', 'Aaspaas ki cheezon me aakar dhoondho.'] } ] },
  ],
  'Class 1-5': [
    { title: 'Vocabulary Free Batch (Class 1-3)', subject: 'English', pages: 60, file: 'assets/ebooks/vocabulary-class-1-3.pdf', chapters: [
      { t: 'About this PDF', body: ['Ye free batch ka vocabulary PDF hai — Class 1 se 3 tak ke bachchon ke liye.', 'Neeche Download button dabakar poori PDF save karo aur print karke practice karo.'] } ] },
    { title: 'Hindi Vyakaran Saral', subject: 'Hindi', pages: 48, chapters: [
      { t: 'Sangya aur Sarvnaam', body: ['Sangya: kisi vyakti, vastu, sthan ka naam. Jaise: Ram, kitab, Raipur.', 'Sarvnaam: sangya ke badle — main, tum, wah, ve.', 'Abhyas: 5 sangya + 5 sarvnaam likho.'] },
      { t: 'Visheshan aur Kriya', body: ['Visheshan: sangya ki visheshta — sundar phool, tez ghoda.', 'Kriya: kaam bataye — khana, padhna, khelna.', 'Vakyon me visheshan gole lagao.'] },
      { t: 'Vachan aur Ling', body: ['Vachan: ekvachan (ladka) — bahuvachan (ladke).', 'Ling: pulling (beta) — striling (beti).', '10 shabdon ke vachan badlo.'] } ] },
    { title: 'English Grammar Basics', subject: 'English', pages: 52, chapters: [
      { t: 'Nouns & Pronouns', body: ['Noun: naming word — boy, school, book.', 'Pronoun: he, she, it, they replace nouns.', 'Exercise: circle nouns in 5 sentences.'] },
      { t: 'Verbs & Tenses', body: ['Verb shows action — run, eat, study.', 'Present: I play. Past: I played.', 'Make 3 sentences in each tense.'] },
      { t: 'Articles A/An/The', body: ['A ball, An apple, The sun.', 'Vowel sound se pehle An lagta hai.', 'Fill in A/An/The — 10 questions.'] } ] },
    { title: 'Maths Tables & Concepts', subject: 'Maths', pages: 56, chapters: [
      { t: 'Tables 2-10', body: ['Roz 2 tables yaad karo, hafte me revise.', 'Trick: 9 ka table ungliyon se.', 'Speed test: 1 minute me 20 sawal.'] },
      { t: 'Addition & Subtraction', body: ['Hasil wala jod seekho: 47 + 28.', 'Udhar wala ghatao: 63 − 29.', 'Roz 10 sawal practice.'] },
      { t: 'Shapes & Measurement', body: ['2D: circle, square, triangle. 3D: cube, ball.', 'Lambai cm me, wazan kg me.', 'Ghar ki 5 cheezein naapo.'] } ] },
  ],
  'Class 6-8': [
    { title: 'Vigyan Notes', subject: 'Science', pages: 64, chapters: [
      { t: 'Bhojan ke Ghatak', body: ['Carbohydrate = oorja, Protein = sharir nirman.', 'Vitamin aur khanij raksha karte hain.', 'Santullit aahar thali banao.'] },
      { t: 'Prakash aur Chhaya', body: ['Prakash seedhi rekha me chalta hai.', 'Pardarshi, apardarshi, pardarshak vastu.', 'Periscope ka siddhant samjho.'] },
      { t: 'Vidhyut Dhara', body: ['Cell, battery, circuit — khula vs band paripath.', 'Chalak (loha) vs kuchaalak (lakdi).', 'Torch ka circuit diagram banao.'] } ] },
    { title: 'Ganit Formula Book', subject: 'Maths', pages: 60, chapters: [
      { t: 'Beejganit Basics', body: ['Char: 2x + 3 = 11 → x = 4.', 'Paksh badalne par chinh badalta hai.', 'Shabdik sawal equation me badlo.'] },
      { t: 'Jyamitri', body: ['Tribhuj ke konon ka yog = 180°.', 'Parimap: aayat = 2(l+b). Kshetrafal: l×b.', 'Compass se 60° ka kon banao.'] },
      { t: 'Pratishat aur Anupat', body: ['Pratishat = (bhag/kul)×100.', 'Anupat saral roop me likho: 4:6 = 2:3.', 'Chhoot wale sawal hal karo.'] } ] },
    { title: 'English Writing Skills', subject: 'English', pages: 44, chapters: [
      { t: 'Paragraph Writing', body: ['Topic sentence + 4-5 supporting lines.', 'Ek idea = ek paragraph.', 'My School par 100 words likho.'] },
      { t: 'Letter Writing', body: ['Formal: principal ko application.', 'Format: address, date, subject, body.', 'Sick leave application likho.'] },
      { t: 'Notice & Diary', body: ['Notice: heading, date, 50 words.', 'Diary: feelings + past tense.', 'Sports Day notice likho.'] } ] },
  ],
  'Class 9-10': [
    { title: 'Board Science Guide', subject: 'Science', pages: 88, chapters: [
      { t: 'Rasayanik Abhikriya', body: ['Sanyojan, viyojan, visthapan, dwivisthapan.', 'Santulit samikaran likhna seekho.', 'Lohay me jung lagna = okseekaran.'] },
      { t: 'Jeevan Prakriya', body: ['Poshan, shwasan, parivahan, utsarjan.', 'Prakash sanshleshan: CO₂ + jal → glucose.', 'Manav hriday ka diagram banao.'] },
      { t: 'Prakash: Paravartan-Apavartan', body: ['Paravartan ke niyam, goliya darpan formula.', 'Lens: 1/v − 1/u = 1/f.', 'Ray diagrams board me pakke aate hain.'] } ] },
    { title: 'Maths Board Practice', subject: 'Maths', pages: 92, chapters: [
      { t: 'Dwighat Samikaran', body: ['ax²+bx+c=0, D = b²−4ac.', 'D>0 do mool, D=0 barabar, D<0 koi vastavik mool nahi.', 'Guna-khand + formula dono se hal karo.'] },
      { t: 'Trikonmiti', body: ['sin²θ + cos²θ = 1 yaad rakho.', '0°, 30°, 45°, 60°, 90° ki table.', 'Unchai-doori wale 5 sawal.'] },
      { t: 'Sankhyiki', body: ['Madhya, madhyika, bahulak ke sutra.', 'Ogive se madhyika nikaalna.', 'Pichhle 3 saal ke paper hal karo.'] } ] },
    { title: 'Samajik Vigyan Notes', subject: 'SST', pages: 76, chapters: [
      { t: 'Sansadhan aur Vikas', body: ['Sansadhan ke prakar: prakritik, manav-nirmit.', 'Mitti ke prakar: jalodh, kali, laal.', 'Map me fasal kshetr chinhit karo.'] },
      { t: 'Loktantra aur Samvidhan', body: ['Samvidhan 26 Jan 1950 ko lagu.', 'Maulik adhikar 6 hain.', 'Satta vibhajan: sangh, rajya, samvarti.'] },
      { t: 'Arthavyavastha', body: ['Kshetrak: prathmik, dwitiyak, tritiyak.', 'GDP ka arth samjho.', 'Swayam sahayata samooh notes.'] } ] },
  ],
  'Class 11-12': [
    { title: 'Physics Quick Revision', subject: 'Physics', pages: 96, chapters: [
      { t: 'Gati ke Niyam', body: ['Newton ke 3 niyam + sutra: v=u+at, s=ut+½at².', 'Gharshan ke prakar samjho.', 'Numericals me unit jaroor likho.'] },
      { t: 'Vidhyut Dhara aur Chumbakatva', body: ['Ohm ka niyam: V=IR.', 'Biot-Savart + Ampere niyam.', 'Circuit numericals daily 5.'] },
      { t: 'Prakashiki (Optics)', body: ['Huygens siddhant, vyatikaran, vivartan.', 'Lens-maker formula revise karo.', 'Derivations likhkar yaad karo.'] } ] },
    { title: 'Chemistry Organic Basics', subject: 'Chemistry', pages: 90, chapters: [
      { t: 'GOC: Basic Concepts', body: ['Inductive, resonance, hyperconjugation.', 'Electrophile vs nucleophile.', 'Acidic strength order practice.'] },
      { t: 'Hydrocarbons', body: ['Alkane: mukt moolak, Alkene: yogatmak.', 'Markovnikov niyam yaad karo.', 'Naamkaran (IUPAC) ke 20 sawal.'] },
      { t: 'Aldehydes & Ketones', body: ['Aldol, Cannizzaro, Clemmensen.', 'Fehling vs Tollens test.', 'Conversion chart banao.'] } ] },
    { title: 'Career Guide: JEE/NEET', subject: 'Career', pages: 36, chapters: [
      { t: 'Stream Chunna', body: ['PCM: engineering/tech. PCB: medical/life science.', 'Ruchi + number dono dekho.', 'Counsellor se ek session jaroor lo.'] },
      { t: 'JEE/NEET Strategy', body: ['NCERT line-by-line + PYQ 10 saal.', 'Mock test weekly, analysis daily.', 'Revision cycle: 1-7-30 din.'] },
      { t: 'Backup Options', body: ['CUET, state CET, defence, design.', 'Skill courses: coding, data, AI.', 'Ek mukhya + ek backup lakshya rakho.'] } ] },
  ],
};
