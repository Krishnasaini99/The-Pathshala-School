/**
 * Cloud sync — Firestore (free tier).
 * Content ek doc me (site/db), photos alag docs me (media/{id}).
 * localStorage offline cache ki tarah kaam karta hai.
 */

export const CLOUD = {
  enabled: true,
  projectId: 'the-pathshala-school-web',
  apiKey: 'AIzaSyBt5T_0wJBu1u_LJL-jp4Pr6RhUwK9lPxM',
  appId: '1:201423330989:web:d0e88593196c7004017024',
  authDomain: 'the-pathshala-school-web.firebaseapp.com',
  storageBucket: 'the-pathshala-school-web.firebasestorage.app',
};

const BASE = `https://firestore.googleapis.com/v1/projects/${CLOUD.projectId}/databases/(default)/documents`;
const API = CLOUD.apiKey;

export const DB_KEY = 'pathshala_db_v1';
const V_KEY = 'ps_cloud_v';

/* ---------------- helpers ---------------- */

function hashId(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36) + '-' + s.length.toString(36);
}

function walk(obj: any, fn: (s: string) => string): any {
  if (typeof obj === 'string') return fn(obj);
  if (Array.isArray(obj)) return obj.map((v) => walk(v, fn));
  if (obj && typeof obj === 'object') {
    const out: any = {};
    for (const k of Object.keys(obj)) out[k] = walk(obj[k], fn);
    return out;
  }
  return obj;
}

/** DB se photos nikaal ke token (@img:id) laga do */
export function splitImages(db: any): { data: any; images: Record<string, string> } {
  const images: Record<string, string> = {};
  const data = walk(db, (s) => {
    if (s.startsWith('data:image/')) {
      const id = hashId(s);
      images[id] = s;
      return '@img:' + id;
    }
    return s;
  });
  return { data, images };
}

/** Token wapas asli photo me badal do */
export function expandImages(data: any, images: Record<string, string>): any {
  return walk(data, (s) => (s.startsWith('@img:') ? images[s.slice(5)] || '' : s));
}

async function patchDoc(path: string, fields: Record<string, any>): Promise<void> {
  const r = await fetch(`${BASE}/${path}?key=${API}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error('cloud write ' + r.status + ' ' + path);
}

/* ---------------- media (photos) ---------------- */

let mediaMap: Record<string, string> | null = null;

async function loadMedia(force = false): Promise<Record<string, string>> {
  if (mediaMap && !force) return mediaMap;
  const map: Record<string, string> = {};
  let pageToken = '';
  for (let i = 0; i < 10; i++) {
    const url = `${BASE}/media?pageSize=300&key=${API}${pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : ''}`;
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) break;
    const j = await r.json();
    for (const d of j.documents || []) {
      const id = String(d.name || '').split('/').pop() || '';
      const val = d.fields?.data?.stringValue;
      if (id && val) map[id] = val;
    }
    pageToken = j.nextPageToken || '';
    if (!pageToken) break;
  }
  mediaMap = map;
  return map;
}

/* ---------------- read ---------------- */

/**
 * Cloud se latest DB laata hai.
 * 'missing'   = cloud me abhi data nahi (pehli baar)
 * 'unchanged' = cloud version wahi hai jo cache me hai
 * 'updated'   = naya data local cache me likh diya
 */
export async function pullCloud(): Promise<'missing' | 'unchanged' | 'updated'> {
  if (!CLOUD.enabled) return 'unchanged';
  const r = await fetch(`${BASE}/site/db?key=${API}`, { cache: 'no-store' });
  if (r.status === 404) return 'missing';
  if (!r.ok) throw new Error('cloud read ' + r.status);
  const j = await r.json();
  const raw = j?.fields?.json?.stringValue;
  const v = String(j?.fields?.v?.integerValue || '');
  if (!raw) return 'missing';
  if (v && v === localStorage.getItem(V_KEY)) return 'unchanged';

  const images = await loadMedia();
  const db = expandImages(JSON.parse(raw), images);
  // Purana local data safety ke liye backup rakh do (cloud se replace hone se pehle) — pehla backup hi rakho
  const old = localStorage.getItem(DB_KEY);
  if (old && !localStorage.getItem('ps_db_backup')) localStorage.setItem('ps_db_backup', old);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  localStorage.setItem(V_KEY, v);
  return 'updated';
}

/* ---------------- write ---------------- */

let pushing = false;
let pending: any = null;

/** Save hone ke baad cloud par bhejo (rapid saves ek saath) */
export function schedulePush(db: any): void {
  if (!CLOUD.enabled) return;
  pending = db;
  if (!pushing) void drain();
}

async function drain(): Promise<void> {
  pushing = true;
  try {
    while (pending) {
      const snapshot = pending;
      pending = null;
      try {
        await pushCloud(JSON.parse(JSON.stringify(snapshot)));
      } catch (e) {
        console.warn('[cloud] push failed', e);
      }
    }
  } finally {
    pushing = false;
  }
}

export async function pushCloud(db: any): Promise<void> {
  if (!CLOUD.enabled) return;
  const { data, images } = splitImages(db);

  const existing = await loadMedia();
  const jobs: Promise<void>[] = [];
  for (const [id, val] of Object.entries(images)) {
    if (!existing[id]) {
      jobs.push(patchDoc('media/' + id, { data: { stringValue: val } }).then(() => { existing[id] = val; }));
    }
  }
  await Promise.all(jobs);

  const v = String(Date.now());
  await patchDoc('site/db', {
    json: { stringValue: JSON.stringify(data) },
    v: { integerValue: v },
  });
  localStorage.setItem(V_KEY, v);
}

/** App start hone se pehle cloud se sync (max 4 sec wait) */
export async function bootSync(): Promise<void> {
  if (!CLOUD.enabled) return;
  const work = (async () => {
    try {
      const res = await pullCloud();
      if (res === 'missing') {
        const local = localStorage.getItem(DB_KEY);
        if (local) schedulePush(JSON.parse(local));
      }
    } catch (e) {
      console.warn('[cloud] boot sync failed', e);
    }
  })();
  await Promise.race([work, new Promise((r) => setTimeout(r, 2500))]);
}
