import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { ActivityItem } from '../types';

const ACTIVITIES_COLLECTION = 'activities';

/**
 * Public User Read:
 * Strictly retrieves only published activities.
 * Enforced both in client query and in Firestore security rules.
 */
export async function getPublishedActivities(): Promise<ActivityItem[]> {
  if (!db) {
    console.warn('[ActivityService] Firestore is not initialized.');
    return [];
  }

  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where('published', '==', true)
    );
    const snap = await getDocs(q);
    const activities: ActivityItem[] = [];

    snap.forEach((d) => {
      const data = d.data();
      activities.push({
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'Other Activities',
        date: data.date || '',
        location: data.location || '',
        photos: Array.isArray(data.photos) ? data.photos : (data.photoUrl ? [data.photoUrl] : []),
        video: data.video || '',
        published: Boolean(data.published),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || '',
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || '',
        mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
        photoUrl: data.photoUrl || (Array.isArray(data.photos) && data.photos.length > 0 ? data.photos[0] : undefined),
        gallery: Array.isArray(data.photos) ? data.photos : [],
        keyOutcomes: Array.isArray(data.keyOutcomes) ? data.keyOutcomes : [],
      });
    });

    // Sort by date descending (newest first)
    activities.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });

    return activities;
  } catch (err: any) {
    console.error('[ActivityService] Error fetching published activities:', err);
    throw err;
  }
}

/**
 * Admin Read:
 * Retrieves all activities (drafts + published) for admin management.
 */
export async function getAllActivitiesAdmin(): Promise<ActivityItem[]> {
  if (!db) {
    throw new Error('Firestore is not configured. Please supply Firebase credentials.');
  }

  try {
    const snap = await getDocs(collection(db, ACTIVITIES_COLLECTION));
    const activities: ActivityItem[] = [];

    snap.forEach((d) => {
      const data = d.data();
      activities.push({
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'Other Activities',
        date: data.date || '',
        location: data.location || '',
        photos: Array.isArray(data.photos) ? data.photos : (data.photoUrl ? [data.photoUrl] : []),
        video: data.video || '',
        published: Boolean(data.published),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || '',
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || '',
        mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
        photoUrl: data.photoUrl || (Array.isArray(data.photos) && data.photos.length > 0 ? data.photos[0] : undefined),
        gallery: Array.isArray(data.photos) ? data.photos : [],
        keyOutcomes: Array.isArray(data.keyOutcomes) ? data.keyOutcomes : [],
      });
    });

    // Sort by date or createdAt descending
    activities.sort((a, b) => {
      const timeA = new Date(a.date || a.createdAt || 0).getTime() || 0;
      const timeB = new Date(b.date || b.createdAt || 0).getTime() || 0;
      return timeB - timeA;
    });

    return activities;
  } catch (err: any) {
    console.error('[ActivityService] Error fetching admin activities:', err);
    throw err;
  }
}

/**
 * Admin Create Activity:
 * Creates a new activity document in Firestore.
 */
export async function createActivity(
  item: Omit<ActivityItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  const newDocRef = item.id
    ? doc(db, ACTIVITIES_COLLECTION, item.id)
    : doc(collection(db, ACTIVITIES_COLLECTION));

  const allMediaUrls = Array.from(
    new Set([
      ...(item.photos || []),
      ...(item.video ? [item.video] : []),
      ...(item.mediaUrls || []),
    ])
  );

  const docData = {
    title: item.title.trim(),
    description: item.description.trim(),
    category: item.category,
    date: item.date,
    location: item.location.trim(),
    photos: item.photos || [],
    video: item.video || '',
    published: Boolean(item.published),
    mediaUrls: allMediaUrls,
    photoUrl: item.photos && item.photos.length > 0 ? item.photos[0] : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newDocRef, docData);
  return newDocRef.id;
}

/**
 * Admin Update Activity:
 * Updates an existing activity document in Firestore.
 */
export async function updateActivity(
  id: string,
  data: Partial<ActivityItem>
): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  const docRef = doc(db, ACTIVITIES_COLLECTION, id);
  const updatePayload: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (data.title !== undefined) updatePayload.title = data.title.trim();
  if (data.description !== undefined) updatePayload.description = data.description.trim();
  if (data.category !== undefined) updatePayload.category = data.category;
  if (data.date !== undefined) updatePayload.date = data.date;
  if (data.location !== undefined) updatePayload.location = data.location.trim();
  if (data.photos !== undefined) {
    updatePayload.photos = data.photos;
    updatePayload.photoUrl = data.photos.length > 0 ? data.photos[0] : '';
  }
  if (data.video !== undefined) updatePayload.video = data.video;
  if (data.published !== undefined) updatePayload.published = Boolean(data.published);

  // Consolidate mediaUrls
  if (data.photos || data.video) {
    const combined = [
      ...(data.photos || []),
      ...(data.video ? [data.video] : []),
    ];
    updatePayload.mediaUrls = Array.from(new Set(combined));
  }

  await updateDoc(docRef, updatePayload);
}

/**
 * Admin Toggle Publish Status:
 * Quickly toggles an activity's published status.
 */
export async function togglePublishStatus(
  id: string,
  currentStatus: boolean
): Promise<boolean> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }
  const nextStatus = !currentStatus;
  await updateDoc(doc(db, ACTIVITIES_COLLECTION, id), {
    published: nextStatus,
    updatedAt: new Date().toISOString(),
  });
  return nextStatus;
}

/**
 * Admin Delete Activity:
 * Deletes the activity document from Firestore.
 */
export async function deleteActivity(id: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }
  await deleteDoc(doc(db, ACTIVITIES_COLLECTION, id));
}

/**
 * Admin Upload Media to Firebase Storage:
 * Enforces file size limits (<=15MB photos, <=150MB video)
 * Reports real-time upload progress.
 */
export function uploadActivityMedia(
  activityId: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ downloadUrl: string; storagePath: string }> {
  return new Promise((resolve, reject) => {
    if (!storage) {
      reject(new Error('Firebase Storage is not configured.'));
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      reject(new Error('Invalid file type. Only images and videos are supported.'));
      return;
    }

    // Size limits: 15MB for images, 150MB for videos
    const maxSizeBytes = isImage ? 15 * 1024 * 1024 : 150 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const limitMb = isImage ? '15 MB' : '150 MB';
      reject(new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the limit of ${limitMb}.`));
      return;
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `activities/${activityId || 'general'}/${Date.now()}_${cleanFileName}`;
    const storageReference = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageReference, file, {
      contentType: file.type,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) {
          onProgress(percent);
        }
      },
      (error) => {
        console.error('[ActivityService] Media upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadUrl, storagePath });
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });
}
