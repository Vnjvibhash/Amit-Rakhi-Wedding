import React, { useState } from 'react';
import { Edit2, Film, Plus, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../../context/WeddingContext';
import {
  deleteVideoRecord,
  saveVideoRecord,
  uploadVideoAsset
} from '../../services/weddingService';
import { VideoCategory, WeddingVideo } from '../../types/wedding';

const VIDEO_CATS: VideoCategory[] = [
  'Pre-Wedding Videos',
  'Wedding Invitation Videos',
  'Ceremony Highlights',
  'Short Wedding Reels',
  'Family Messages'
];

export const AdminVideosTab: React.FC = () => {
  const { videos } = useWedding();
  const [form, setForm] = useState<(Omit<WeddingVideo, 'id'> & { id?: string }) | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadFile = async (file: File) => {
    if (!form) return;
    setUploading(true);
    try {
      const url = await uploadVideoAsset(file, setProgress);
      setForm({ ...form, sourceType: 'storage', videoUrl: url });
      toast.success('Video uploaded to Firebase Storage!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Video upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      await saveVideoRecord(form);
      toast.success(form.id ? 'Video updated!' : 'Video added!');
      setForm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save video.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold text-maroon-900">Wedding Videos Manager</h2>
          <p className="text-xs text-maroon-700">
            Add YouTube wedding films or upload MP4 videos directly to Firebase Storage.
          </p>
        </div>
        <button
          onClick={() =>
            setForm({
              title: '',
              category: 'Ceremony Highlights',
              sourceType: 'youtube',
              videoUrl: '',
              description: '',
              duration: '02:30',
              createdAt: new Date().toISOString()
            })
          }
          className="btn-royal !py-2.5 !px-5 !text-xs"
        >
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      {form && (
        <form onSubmit={handleSave} className="royal-card p-6 space-y-4 border-2 border-gold-500">
          <h3 className="font-serif text-2xl font-bold text-maroon-900">
            {form.id ? 'Edit Video' : 'Add New Wedding Video'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Video Title"
              className="input-royal"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as VideoCategory })}
              className="input-royal"
            >
              {VIDEO_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <select
              value={form.sourceType}
              onChange={(e) =>
                setForm({ ...form, sourceType: e.target.value as 'youtube' | 'storage' })
              }
              className="input-royal"
            >
              <option value="youtube">YouTube Embed URL</option>
              <option value="storage">Firebase Storage Video</option>
            </select>
            <input
              type="url"
              required
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder={
                form.sourceType === 'youtube'
                  ? 'https://www.youtube.com/watch?v=...'
                  : 'https://firebasestorage.googleapis.com/...'
              }
              className="input-royal sm:col-span-2"
            />
          </div>

          {form.sourceType === 'storage' && (
            <div className="space-y-2">
              <label className="btn-outline-gold !py-2 !px-4 !text-xs cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? `Uploading Video (${progress}%)...` : 'Upload Video File to Storage'}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadFile(f);
                  }}
                />
              </label>
            </div>
          )}

          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description..."
            className="input-royal"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setForm(null)}
              className="btn-outline-gold !py-2 !px-4 !text-xs"
            >
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="btn-royal !py-2 !px-5 !text-xs">
              Save Video
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {videos.map((v) => (
          <div key={v.id} className="royal-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-maroon-900 text-gold-300 flex items-center justify-center shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-gold-700">
                  {v.category} • {v.sourceType}
                </span>
                <h4 className="font-serif text-lg font-bold text-maroon-900 truncate">{v.title}</h4>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setForm(v)}
                className="p-2 rounded-lg border border-gold-400/50 text-maroon-800"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Delete video "${v.title}"?`)) {
                    await deleteVideoRecord(v.id);
                    toast.success('Video removed.');
                  }
                }}
                className="p-2 rounded-lg border border-red-200 text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

