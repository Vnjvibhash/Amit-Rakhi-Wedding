import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import {
  DEFAULT_ALBUMS,
  DEFAULT_COUPLE,
  DEFAULT_EVENTS,
  DEFAULT_FAMILY,
  DEFAULT_PHOTOS,
  DEFAULT_RSVPS,
  DEFAULT_SETTINGS,
  DEFAULT_VIDEOS
} from '../data/sampleData';
import { db, isFirebaseConfigured, storage } from '../lib/firebase';
import {
  CoupleDetails,
  FamilyMember,
  GuestRSVP,
  WeddingAlbum,
  WeddingEvent,
  WeddingPhoto,
  WeddingSettings,
  WeddingVideo
} from '../types/wedding';
import {
  blobToDataUrl,
  optimizeImageForUpload,
  validateImageFile,
  validateVideoFile
} from '../utils/imageOptimizer';

const STORAGE_KEYS = {
  settings: 'wedding_portal_settings_v6',
  couple: 'wedding_portal_couple_v6',
  family: 'wedding_portal_family_v6',
  events: 'wedding_portal_events_v6',
  albums: 'wedding_portal_albums_v6',
  photos: 'wedding_portal_photos_v6',
  videos: 'wedding_portal_videos_v6',
  rsvps: 'wedding_portal_rsvps_v6'
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('wedding-local-update', { detail: key }));
  } catch {
    // Ignore localStorage quota overflow in preview mode
  }
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

export function subscribeSettings(cb: (data: WeddingSettings) => void): () => void {
  if (!isFirebaseConfigured || !db) {
    cb(readLocal(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
    const handler = () => cb(readLocal(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  return onSnapshot(
    doc(db, 'wedding_settings', 'main'),
    (snap) => {
      if (snap.exists()) {
        cb({ id: snap.id, ...(snap.data() as WeddingSettings) });
      } else {
        cb(DEFAULT_SETTINGS);
      }
    },
    () => cb(DEFAULT_SETTINGS)
  );
}

export function subscribeCouple(cb: (data: CoupleDetails) => void): () => void {
  if (!isFirebaseConfigured || !db) {
    cb(readLocal(STORAGE_KEYS.couple, DEFAULT_COUPLE));
    const handler = () => cb(readLocal(STORAGE_KEYS.couple, DEFAULT_COUPLE));
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  return onSnapshot(
    doc(db, 'couple_details', 'main'),
    (snap) => {
      if (snap.exists()) {
        cb({ id: snap.id, ...(snap.data() as CoupleDetails) });
      } else {
        cb(DEFAULT_COUPLE);
      }
    },
    () => cb(DEFAULT_COUPLE)
  );
}

export function subscribeFamily(cb: (data: FamilyMember[]) => void): () => void {
  if (!isFirebaseConfigured || !db) {
    cb(readLocal(STORAGE_KEYS.family, DEFAULT_FAMILY));
    const handler = () => cb(readLocal(STORAGE_KEYS.family, DEFAULT_FAMILY));
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  const q = query(collection(db, 'family_members'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        cb(DEFAULT_FAMILY);
        return;
      }
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FamilyMember, 'id'>) })));
    },
    () => cb(DEFAULT_FAMILY)
  );
}

export function subscribeEvents(cb: (data: WeddingEvent[]) => void): () => void {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.events, DEFAULT_EVENTS);
    cb([...list].sort((a, b) => a.order - b.order));
    const handler = () => {
      const updated = readLocal(STORAGE_KEYS.events, DEFAULT_EVENTS);
      cb([...updated].sort((a, b) => a.order - b.order));
    };
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  const q = query(collection(db, 'wedding_events'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        cb(DEFAULT_EVENTS);
        return;
      }
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WeddingEvent, 'id'>) })));
    },
    () => cb(DEFAULT_EVENTS)
  );
}

export function subscribeAlbums(cb: (data: WeddingAlbum[]) => void): () => void {
  if (!isFirebaseConfigured || !db) {
    cb(readLocal(STORAGE_KEYS.albums, DEFAULT_ALBUMS));
    const handler = () => cb(readLocal(STORAGE_KEYS.albums, DEFAULT_ALBUMS));
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  const q = query(collection(db, 'wedding_albums'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        cb(DEFAULT_ALBUMS);
        return;
      }
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WeddingAlbum, 'id'>) })));
    },
    () => cb(DEFAULT_ALBUMS)
  );
}

export function subscribePhotos(cb: (data: WeddingPhoto[]) => void): () => void {
  if (!isFirebaseConfigured || !db) {
    cb(readLocal(STORAGE_KEYS.photos, DEFAULT_PHOTOS));
    const handler = () => cb(readLocal(STORAGE_KEYS.photos, DEFAULT_PHOTOS));
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  const q = query(collection(db, 'wedding_photos'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        cb(DEFAULT_PHOTOS);
        return;
      }
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WeddingPhoto, 'id'>) })));
    },
    () => cb(DEFAULT_PHOTOS)
  );
}

export function subscribeVideos(cb: (data: WeddingVideo[]) => void): () => void {
  if (!isFirebaseConfigured || !db) {
    cb(readLocal(STORAGE_KEYS.videos, DEFAULT_VIDEOS));
    const handler = () => cb(readLocal(STORAGE_KEYS.videos, DEFAULT_VIDEOS));
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  const q = query(collection(db, 'wedding_videos'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        cb(DEFAULT_VIDEOS);
        return;
      }
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WeddingVideo, 'id'>) })));
    },
    () => cb(DEFAULT_VIDEOS)
  );
}

export function subscribeRsvps(cb: (data: GuestRSVP[]) => void, enabled = true): () => void {
  if (!enabled) return () => { };
  if (!isFirebaseConfigured || !db) {
    cb(readLocal(STORAGE_KEYS.rsvps, DEFAULT_RSVPS));
    const handler = () => cb(readLocal(STORAGE_KEYS.rsvps, DEFAULT_RSVPS));
    window.addEventListener('wedding-local-update', handler);
    return () => window.removeEventListener('wedding-local-update', handler);
  }

  const q = query(collection(db, 'guest_rsvps'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GuestRSVP, 'id'>) })));
    },
    () => cb([])
  );
}

// ============================================================================
// UPLOAD HELPERS
// ============================================================================

export async function uploadImageAsset(
  file: File,
  folder: 'photos' | 'events' | 'family' | 'couple',
  onProgress?: (pct: number) => void
): Promise<string> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const optimizedBlob = await optimizeImageForUpload(file);

  if (!isFirebaseConfigured || !storage) {
    onProgress?.(60);
    const dataUrl = await blobToDataUrl(optimizedBlob);
    onProgress?.(100);
    return dataUrl;
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `wedding/${folder}/${Date.now()}_${cleanName}`);
  const task = uploadBytesResumable(storageRef, optimizedBlob, {
    contentType: 'image/jpeg'
  });

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function uploadVideoAsset(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const error = validateVideoFile(file);
  if (error) throw new Error(error);

  if (!isFirebaseConfigured || !storage) {
    throw new Error(
      'Firebase Storage must be configured in .env to host uploaded video files. You can also embed any YouTube URL directly.'
    );
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `wedding/videos/${Date.now()}_${cleanName}`);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ============================================================================
// CRUD MUTATIONS
// ============================================================================

export async function saveSettings(settings: WeddingSettings): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    writeLocal(STORAGE_KEYS.settings, settings);
    return;
  }
  const { id: _id, ...payload } = settings;
  await setDoc(doc(db, 'wedding_settings', 'main'), payload, { merge: true });
}

export async function saveCoupleDetails(couple: CoupleDetails): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    writeLocal(STORAGE_KEYS.couple, couple);
    return;
  }
  const { id: _id, ...payload } = couple;
  await setDoc(doc(db, 'couple_details', 'main'), payload, { merge: true });
}

export async function saveFamilyMember(member: Omit<FamilyMember, 'id'> & { id?: string }): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.family, DEFAULT_FAMILY);
    if (member.id) {
      const updated = list.map((m) => (m.id === member.id ? (member as FamilyMember) : m));
      writeLocal(STORAGE_KEYS.family, updated);
    } else {
      const created: FamilyMember = { ...(member as FamilyMember), id: genId('fam') };
      writeLocal(STORAGE_KEYS.family, [...list, created]);
    }
    return;
  }
  if (member.id) {
    const { id, ...rest } = member;
    await setDoc(doc(db, 'family_members', id), rest, { merge: true });
  } else {
    const { id: _id, ...rest } = member;
    await addDoc(collection(db, 'family_members'), rest);
  }
}

export async function deleteFamilyMember(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.family, DEFAULT_FAMILY);
    writeLocal(
      STORAGE_KEYS.family,
      list.filter((m) => m.id !== id)
    );
    return;
  }
  await deleteDoc(doc(db, 'family_members', id));
}

export async function saveWeddingEvent(event: Omit<WeddingEvent, 'id'> & { id?: string }): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.events, DEFAULT_EVENTS);
    if (event.id && list.some((e) => e.id === event.id)) {
      writeLocal(
        STORAGE_KEYS.events,
        list.map((e) => (e.id === event.id ? (event as WeddingEvent) : e))
      );
    } else {
      const created: WeddingEvent = { ...(event as WeddingEvent), id: event.id || genId('evt') };
      writeLocal(STORAGE_KEYS.events, [...list, created]);
    }
    return;
  }

  if (event.id) {
    const { id, ...rest } = event;
    await setDoc(doc(db, 'wedding_events', id), rest, { merge: true });
  } else {
    const { id: _id, ...rest } = event;
    await addDoc(collection(db, 'wedding_events'), rest);
  }
}

export async function deleteWeddingEvent(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.events, DEFAULT_EVENTS);
    writeLocal(
      STORAGE_KEYS.events,
      list.filter((e) => e.id !== id)
    );
    return;
  }
  await deleteDoc(doc(db, 'wedding_events', id));
}

export async function reorderWeddingEvents(orderedEvents: WeddingEvent[]): Promise<void> {
  const normalized = orderedEvents.map((e, idx) => ({ ...e, order: idx + 1 }));
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    writeLocal(STORAGE_KEYS.events, normalized);
    return;
  }
  const batch = writeBatch(firestore);
  normalized.forEach((evt) => {
    batch.set(doc(firestore, 'wedding_events', evt.id), { order: evt.order }, { merge: true });
  });
  await batch.commit();
}

export async function saveAlbum(album: Omit<WeddingAlbum, 'id'> & { id?: string }): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.albums, DEFAULT_ALBUMS);
    if (album.id && list.some((a) => a.id === album.id)) {
      writeLocal(
        STORAGE_KEYS.albums,
        list.map((a) => (a.id === album.id ? (album as WeddingAlbum) : a))
      );
    } else {
      const created: WeddingAlbum = { ...(album as WeddingAlbum), id: album.id || genId('alb') };
      writeLocal(STORAGE_KEYS.albums, [...list, created]);
    }
    return;
  }

  if (album.id) {
    const { id, ...rest } = album;
    await setDoc(doc(db, 'wedding_albums', id), rest, { merge: true });
  } else {
    const { id: _id, ...rest } = album;
    await addDoc(collection(db, 'wedding_albums'), rest);
  }
}

export async function deleteAlbum(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.albums, DEFAULT_ALBUMS);
    writeLocal(
      STORAGE_KEYS.albums,
      list.filter((a) => a.id !== id)
    );
    return;
  }
  await deleteDoc(doc(db, 'wedding_albums', id));
}

export async function createPhotoRecord(photo: Omit<WeddingPhoto, 'id'>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.photos, DEFAULT_PHOTOS);
    writeLocal(STORAGE_KEYS.photos, [{ ...photo, id: genId('ph') }, ...list]);
    return;
  }
  await addDoc(collection(db, 'wedding_photos'), photo);
}

export async function updatePhotoRecord(id: string, patch: Partial<WeddingPhoto>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.photos, DEFAULT_PHOTOS);
    writeLocal(
      STORAGE_KEYS.photos,
      list.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
    return;
  }
  await updateDoc(doc(db, 'wedding_photos', id), patch);
}

export async function deletePhotoRecord(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.photos, DEFAULT_PHOTOS);
    writeLocal(
      STORAGE_KEYS.photos,
      list.filter((p) => p.id !== id)
    );
    return;
  }
  await deleteDoc(doc(db, 'wedding_photos', id));
}

export async function saveVideoRecord(video: Omit<WeddingVideo, 'id'> & { id?: string }): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.videos, DEFAULT_VIDEOS);
    if (video.id && list.some((v) => v.id === video.id)) {
      writeLocal(
        STORAGE_KEYS.videos,
        list.map((v) => (v.id === video.id ? (video as WeddingVideo) : v))
      );
    } else {
      const created: WeddingVideo = { ...(video as WeddingVideo), id: video.id || genId('vid') };
      writeLocal(STORAGE_KEYS.videos, [created, ...list]);
    }
    return;
  }

  if (video.id) {
    const { id, ...rest } = video;
    await setDoc(doc(db, 'wedding_videos', id), rest, { merge: true });
  } else {
    const { id: _id, ...rest } = video;
    await addDoc(collection(db, 'wedding_videos'), rest);
  }
}

export async function deleteVideoRecord(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.videos, DEFAULT_VIDEOS);
    writeLocal(
      STORAGE_KEYS.videos,
      list.filter((v) => v.id !== id)
    );
    return;
  }
  await deleteDoc(doc(db, 'wedding_videos', id));
}

export async function submitGuestRSVP(rsvp: Omit<GuestRSVP, 'id' | 'createdAt'>): Promise<string> {
  const payload: Omit<GuestRSVP, 'id'> = {
    ...rsvp,
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.rsvps, DEFAULT_RSVPS);
    const id = genId('rsvp');
    writeLocal(STORAGE_KEYS.rsvps, [{ ...payload, id }, ...list]);
    return id;
  }

  const refDoc = await addDoc(collection(db, 'guest_rsvps'), payload);
  return refDoc.id;
}

export async function updateGuestRSVP(id: string, patch: Partial<GuestRSVP>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.rsvps, DEFAULT_RSVPS);
    writeLocal(
      STORAGE_KEYS.rsvps,
      list.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
    return;
  }
  await updateDoc(doc(db, 'guest_rsvps', id), patch);
}

export async function deleteGuestRSVP(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const list = readLocal(STORAGE_KEYS.rsvps, DEFAULT_RSVPS);
    writeLocal(
      STORAGE_KEYS.rsvps,
      list.filter((r) => r.id !== id)
    );
    return;
  }
  await deleteDoc(doc(db, 'guest_rsvps', id));
}

/**
 * Populates Firestore with initial sample wedding data (or resets preview data).
 */
export async function seedAllSampleData(): Promise<void> {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    writeLocal(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    writeLocal(STORAGE_KEYS.couple, DEFAULT_COUPLE);
    writeLocal(STORAGE_KEYS.family, DEFAULT_FAMILY);
    writeLocal(STORAGE_KEYS.events, DEFAULT_EVENTS);
    writeLocal(STORAGE_KEYS.albums, DEFAULT_ALBUMS);
    writeLocal(STORAGE_KEYS.photos, DEFAULT_PHOTOS);
    writeLocal(STORAGE_KEYS.videos, DEFAULT_VIDEOS);
    writeLocal(STORAGE_KEYS.rsvps, DEFAULT_RSVPS);
    return;
  }

  const batch = writeBatch(firestore);

  const { id: _sid, ...settingsPayload } = DEFAULT_SETTINGS;
  batch.set(doc(firestore, 'wedding_settings', 'main'), settingsPayload);

  const { id: _cid, ...couplePayload } = DEFAULT_COUPLE;
  batch.set(doc(firestore, 'couple_details', 'main'), couplePayload);

  DEFAULT_FAMILY.forEach(({ id, ...rest }) => {
    batch.set(doc(firestore, 'family_members', id), rest);
  });

  DEFAULT_EVENTS.forEach(({ id, ...rest }) => {
    batch.set(doc(firestore, 'wedding_events', id), rest);
  });

  DEFAULT_ALBUMS.forEach(({ id, ...rest }) => {
    batch.set(doc(firestore, 'wedding_albums', id), rest);
  });

  DEFAULT_PHOTOS.forEach(({ id, ...rest }) => {
    batch.set(doc(firestore, 'wedding_photos', id), rest);
  });

  DEFAULT_VIDEOS.forEach(({ id, ...rest }) => {
    batch.set(doc(firestore, 'wedding_videos', id), rest);
  });

  await batch.commit();
}
