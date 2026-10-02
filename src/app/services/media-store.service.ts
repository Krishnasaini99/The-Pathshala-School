import { Injectable } from '@angular/core';

// Phone gallery videos → IndexedDB me save (bina YouTube, bina internet).
// Note: ye videos ISI browser/device me chalengi (dusre phone me nahi).
@Injectable({ providedIn: 'root' })
export class MediaStore {
  private db: IDBDatabase | null = null;
  private opening: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);
    if (!this.opening) {
      this.opening = new Promise((res, rej) => {
        const r = indexedDB.open('pathshala-media', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('videos', { keyPath: 'id' });
        r.onsuccess = () => { this.db = r.result; res(r.result); };
        r.onerror = () => rej(r.error);
      });
    }
    return this.opening;
  }

  async saveVideo(id: string, file: Blob): Promise<void> {
    const db = await this.open();
    await new Promise<void>((res, rej) => {
      const q = db.transaction('videos', 'readwrite').objectStore('videos').put({ id, blob: file });
      q.onsuccess = () => res();
      q.onerror = () => rej(q.error);
    });
  }

  async videoUrl(id: string): Promise<string | null> {
    try {
      const db = await this.open();
      const blob: Blob | undefined = await new Promise((res, rej) => {
        const q = db.transaction('videos', 'readonly').objectStore('videos').get(id);
        q.onsuccess = () => res(q.result?.blob);
        q.onerror = () => rej(q.error);
      });
      return blob ? URL.createObjectURL(blob) : null;
    } catch {
      return null;
    }
  }

  async delVideo(id: string): Promise<void> {
    const db = await this.open();
    await new Promise<void>((res, rej) => {
      const q = db.transaction('videos', 'readwrite').objectStore('videos').delete(id);
      q.onsuccess = () => res();
      q.onerror = () => rej(q.error);
    });
  }
}
