import React, { useState } from 'react';
import { Check, Edit2, FolderPlus, ImagePlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ALBUM_CATEGORIES } from '../../data/sampleData';
import { useWedding } from '../../context/WeddingContext';
import {
  createPhotoRecord,
  deleteAlbum,
  deletePhotoRecord,
  saveAlbum,
  updatePhotoRecord,
  uploadImageAsset
} from '../../services/weddingService';
import { AlbumCategory, WeddingAlbum, WeddingPhoto } from '../../types/wedding';

export const AdminGalleryTab: React.FC = () => {
  const { albums, photos } = useWedding();

  // Album Creation / Edit
  const [albumForm, setAlbumForm] = useState<(Omit<WeddingAlbum, 'id'> & { id?: string }) | null>(
    null
  );

  // Multi-Photo Upload
  const [selectedCategory, setSelectedCategory] = useState<AlbumCategory>('Wedding Day');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(albums[0]?.id || 'alb-wedding');
  const [captionPrefix, setCaptionPrefix] = useState('');
  const [allowDownload, setAllowDownload] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Inline caption editor
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState('');

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm) return;
    try {
      await saveAlbum(albumForm);
      toast.success(albumForm.id ? 'Album updated!' : 'Album created!');
      setAlbumForm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save album.');
    }
  };

  const handleUploadPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) {
      toast.error('Please choose one or more image files.');
      return;
    }
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageAsset(file, 'photos', (pct) => {
          setProgress(Math.round(((i + pct / 100) / files.length) * 100));
        });
        await createPhotoRecord({
          albumId: selectedAlbumId || 'alb-other',
          category: selectedCategory,
          imageUrl: url,
          caption: captionPrefix.trim() || file.name.replace(/\.[^/.]+$/, ''),
          uploadedBy: 'Admin',
          allowDownload,
          createdAt: new Date().toISOString()
        });
      }
      toast.success(`Uploaded ${files.length} photo(s) successfully!`);
      setFiles([]);
      setCaptionPrefix('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleSaveCaption = async (photo: WeddingPhoto) => {
    try {
      await updatePhotoRecord(photo.id, { caption: editingCaption.trim() });
      toast.success('Caption updated!');
      setEditingPhotoId(null);
    } catch {
      toast.error('Failed to update caption.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Multi-photo Uploader */}
      <form onSubmit={handleUploadPhotos} className="royal-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-maroon-900 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-gold-700" /> Upload Photographs
            </h2>
            <p className="text-xs text-maroon-700">
              Supports multiple photos at once directly from desktop or mobile camera/gallery.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setAlbumForm({
                title: '',
                category: 'Other Memories',
                description: '',
                coverImageUrl: '/images/hero-palace.jpg',
                allowDownload: true,
                order: albums.length + 1,
                createdAt: new Date().toISOString()
              })
            }
            className="btn-outline-gold !py-2 !px-4 !text-xs"
          >
            <FolderPlus className="w-4 h-4" /> New Album
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Ceremony Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AlbumCategory)}
              className="input-royal"
            >
              {ALBUM_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">Album</label>
            <select
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              className="input-royal"
            >
              {albums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  {alb.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Caption (Applied to Batch)
            </label>
            <input
              type="text"
              value={captionPrefix}
              onChange={(e) => setCaptionPrefix(e.target.value)}
              placeholder="e.g., Haldi Morning Smiles"
              className="input-royal"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="input-royal !py-2 flex-1"
          />
          <label className="flex items-center gap-2 text-xs font-semibold text-maroon-900 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={(e) => setAllowDownload(e.target.checked)}
              className="accent-maroon-800"
            />
            Allow Guest Download
          </label>
          <button type="submit" disabled={uploading} className="btn-royal !py-2.5 !px-6 !text-xs">
            {uploading ? `Uploading ${progress}%` : `Upload ${files.length || ''} Photo(s)`}
          </button>
        </div>

        {uploading && (
          <div className="w-full h-2 bg-beige-warm rounded-full overflow-hidden">
            <div className="h-full bg-maroon-800 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </form>

      {/* Album Form */}
      {albumForm && (
        <form onSubmit={handleSaveAlbum} className="royal-card p-6 space-y-4 border-2 border-gold-500">
          <h3 className="font-serif text-2xl font-bold text-maroon-900">
            {albumForm.id ? 'Edit Album' : 'Create Photo Album'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={albumForm.title}
              onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
              placeholder="Album Title"
              className="input-royal"
            />
            <select
              value={albumForm.category}
              onChange={(e) =>
                setAlbumForm({ ...albumForm, category: e.target.value as AlbumCategory })
              }
              className="input-royal"
            >
              {ALBUM_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={albumForm.description}
            onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
            placeholder="Short description"
            className="input-royal"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAlbumForm(null)}
              className="btn-outline-gold !py-2 !px-4 !text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-royal !py-2 !px-5 !text-xs">
              Save Album
            </button>
          </div>
        </form>
      )}

      {/* Albums Summary */}
      <div>
        <h3 className="font-serif text-2xl font-bold text-maroon-900 mb-3">
          Albums ({albums.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((alb) => (
            <div key={alb.id} className="royal-card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-700">
                  {alb.category}
                </span>
                <h4 className="font-serif text-lg font-bold text-maroon-900 truncate">
                  {alb.title}
                </h4>
                <p className="text-xs text-maroon-700">
                  {photos.filter((p) => p.albumId === alb.id || p.category === alb.category).length}{' '}
                  photos
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setAlbumForm(alb)}
                  className="p-2 rounded-lg border border-gold-400/50 text-maroon-800 hover:bg-gold-50"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`Delete album "${alb.title}"?`)) {
                      await deleteAlbum(alb.id);
                      toast.success('Album deleted.');
                    }
                  }}
                  className="p-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photos Grid Management */}
      <div>
        <h3 className="font-serif text-2xl font-bold text-maroon-900 mb-3">
          All Uploaded Photos ({photos.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((p) => (
            <div key={p.id} className="royal-card overflow-hidden flex flex-col">
              <img src={p.imageUrl} alt={p.caption} className="w-full h-44 object-cover" />
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-700">
                    {p.category}
                  </span>
                  {editingPhotoId === p.id ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={editingCaption}
                        onChange={(e) => setEditingCaption(e.target.value)}
                        className="input-royal !py-1.5 !text-xs"
                      />
                      <button
                        onClick={() => handleSaveCaption(p)}
                        className="p-2 rounded-lg bg-maroon-800 text-gold-200"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-maroon-950 mt-0.5">{p.caption}</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gold-400/30">
                  <button
                    onClick={() =>
                      updatePhotoRecord(p.id, { allowDownload: !p.allowDownload }).then(() =>
                        toast.success('Download setting updated')
                      )
                    }
                    className="text-[11px] font-semibold text-maroon-800 hover:underline"
                  >
                    {p.allowDownload ? 'Download: Allowed' : 'Download: Locked'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingPhotoId(p.id);
                        setEditingCaption(p.caption);
                      }}
                      className="p-1.5 rounded-lg border border-gold-400/50 text-maroon-800"
                      title="Edit caption"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this photograph?')) {
                          await deletePhotoRecord(p.id);
                          toast.success('Photo deleted.');
                        }
                      }}
                      className="p-1.5 rounded-lg border border-red-200 text-red-700"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

