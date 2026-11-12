import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Save, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../../context/WeddingContext';
import {
  deleteFamilyMember,
  saveCoupleDetails,
  saveFamilyMember,
  uploadImageAsset
} from '../../services/weddingService';
import { CoupleDetails, FamilyMember } from '../../types/wedding';

export const AdminFamilyTab: React.FC = () => {
  const { couple, family } = useWedding();
  const [coupleForm, setCoupleForm] = useState<CoupleDetails>(couple);
  const [memberForm, setMemberForm] = useState<(Omit<FamilyMember, 'id'> & { id?: string }) | null>(
    null
  );
  const [savingCouple, setSavingCouple] = useState(false);

  useEffect(() => {
    setCoupleForm(couple);
  }, [couple]);

  const handleSaveCouple = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCouple(true);
    try {
      await saveCoupleDetails(coupleForm);
      toast.success('Bride & Groom profiles updated!');
    } catch {
      toast.error('Failed to save couple profiles.');
    } finally {
      setSavingCouple(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm) return;
    try {
      await saveFamilyMember(memberForm);
      toast.success(memberForm.id ? 'Family member updated!' : 'Family member added!');
      setMemberForm(null);
    } catch {
      toast.error('Could not save family member.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Couple Details Editor */}
      <form onSubmit={handleSaveCouple} className="royal-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-maroon-900">
            Bride &amp; Groom Profiles
          </h2>
          <button type="submit" disabled={savingCouple} className="btn-royal !py-2 !px-5 !text-xs">
            <Save className="w-4 h-4" /> {savingCouple ? 'Saving...' : 'Save Couple Info'}
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-maroon-900 mb-1">
            Our Story Summary
          </label>
          <textarea
            rows={2}
            value={coupleForm.storySummary}
            onChange={(e) => setCoupleForm({ ...coupleForm, storySummary: e.target.value })}
            className="input-royal"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Groom */}
          <div className="p-4 rounded-xl bg-beige-soft/40 border border-gold-400/40 space-y-3">
            <h3 className="font-serif text-xl font-bold text-maroon-900">Groom Details</h3>
            <input
              type="text"
              value={coupleForm.groom.fullName}
              onChange={(e) =>
                setCoupleForm({
                  ...coupleForm,
                  groom: { ...coupleForm.groom, fullName: e.target.value }
                })
              }
              placeholder="Groom Full Name"
              className="input-royal"
            />
            <input
              type="text"
              value={coupleForm.groom.parents}
              onChange={(e) =>
                setCoupleForm({
                  ...coupleForm,
                  groom: { ...coupleForm.groom, parents: e.target.value }
                })
              }
              placeholder="Groom Parents"
              className="input-royal"
            />
            <textarea
              rows={2}
              value={coupleForm.groom.bio}
              onChange={(e) =>
                setCoupleForm({
                  ...coupleForm,
                  groom: { ...coupleForm.groom, bio: e.target.value }
                })
              }
              placeholder="Short Bio"
              className="input-royal"
            />
            <label className="btn-outline-gold !py-1.5 !px-3 !text-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Change Groom Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadImageAsset(f, 'couple');
                  setCoupleForm({
                    ...coupleForm,
                    groom: { ...coupleForm.groom, photoUrl: url }
                  });
                  toast.success('Groom photo uploaded (click Save Couple Info)');
                }}
              />
            </label>
          </div>

          {/* Bride */}
          <div className="p-4 rounded-xl bg-beige-soft/40 border border-gold-400/40 space-y-3">
            <h3 className="font-serif text-xl font-bold text-maroon-900">Bride Details</h3>
            <input
              type="text"
              value={coupleForm.bride.fullName}
              onChange={(e) =>
                setCoupleForm({
                  ...coupleForm,
                  bride: { ...coupleForm.bride, fullName: e.target.value }
                })
              }
              placeholder="Bride Full Name"
              className="input-royal"
            />
            <input
              type="text"
              value={coupleForm.bride.parents}
              onChange={(e) =>
                setCoupleForm({
                  ...coupleForm,
                  bride: { ...coupleForm.bride, parents: e.target.value }
                })
              }
              placeholder="Bride Parents"
              className="input-royal"
            />
            <textarea
              rows={2}
              value={coupleForm.bride.bio}
              onChange={(e) =>
                setCoupleForm({
                  ...coupleForm,
                  bride: { ...coupleForm.bride, bio: e.target.value }
                })
              }
              placeholder="Short Bio"
              className="input-royal"
            />
            <label className="btn-outline-gold !py-1.5 !px-3 !text-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Change Bride Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadImageAsset(f, 'couple');
                  setCoupleForm({
                    ...coupleForm,
                    bride: { ...coupleForm.bride, photoUrl: url }
                  });
                  toast.success('Bride photo uploaded (click Save Couple Info)');
                }}
              />
            </label>
          </div>
        </div>
      </form>

      {/* Family Members CRUD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-maroon-900">
            Family Members &amp; Coordinators ({family.length})
          </h3>
          <button
            onClick={() =>
              setMemberForm({
                name: '',
                relation: '',
                side: 'groom',
                generation: 'parents',
                photoUrl: '/images/family/groom-parents.jpg',
                bio: '',
                phone: '',
                isContactCoordinator: false,
                order: family.length + 1
              })
            }
            className="btn-royal !py-2 !px-4 !text-xs"
          >
            <Plus className="w-4 h-4" /> Add Family Member
          </button>
        </div>

        {memberForm && (
          <form
            onSubmit={handleSaveMember}
            className="royal-card p-6 space-y-4 border-2 border-gold-500"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                placeholder="Full Name(s)"
                className="input-royal"
              />
              <input
                type="text"
                required
                value={memberForm.relation}
                onChange={(e) => setMemberForm({ ...memberForm, relation: e.target.value })}
                placeholder="Relation (e.g., Parents of Bride)"
                className="input-royal"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <select
                value={memberForm.side}
                onChange={(e) =>
                  setMemberForm({
                    ...memberForm,
                    side: e.target.value as FamilyMember['side']
                  })
                }
                className="input-royal"
              >
                <option value="groom">Groom’s Family</option>
                <option value="bride">Bride’s Family</option>
                <option value="both">Both / Coordinators</option>
              </select>
              <input
                type="text"
                value={memberForm.phone || ''}
                onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                placeholder="Contact Phone (Optional)"
                className="input-royal"
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-maroon-900">
                <input
                  type="checkbox"
                  checked={Boolean(memberForm.isContactCoordinator)}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, isContactCoordinator: e.target.checked })
                  }
                  className="accent-maroon-800"
                />
                Show on Contact Page
              </label>
            </div>
            <textarea
              rows={2}
              value={memberForm.bio}
              onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
              placeholder="Short introduction / blessing"
              className="input-royal"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMemberForm(null)}
                className="btn-outline-gold !py-2 !px-4 !text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-royal !py-2 !px-5 !text-xs">
                Save Member
              </button>
            </div>
          </form>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {family.map((m) => (
            <div key={m.id} className="royal-card p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={m.photoUrl}
                  alt={m.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-gold-700">
                    {m.side} • {m.relation}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-maroon-900 truncate">
                    {m.name}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setMemberForm(m)}
                  className="p-2 rounded-lg border border-gold-400/50 text-maroon-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`Remove "${m.name}"?`)) {
                      await deleteFamilyMember(m.id);
                      toast.success('Family member removed.');
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
    </div>
  );
};

