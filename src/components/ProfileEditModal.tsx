import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSaved }) => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(user?.city || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [education, setEducation] = useState(user?.education || '');
  const [community, setCommunity] = useState(user?.community || '');
  const [diet, setDiet] = useState(user?.diet || 'Vegetarian');
  const [interests, setInterests] = useState<string[]>(user?.interests || ['Travel', 'Art', 'Yoga']);
  const [newInterestInput, setNewInterestInput] = useState('');

  // Dating Preferences
  const [ageMin, setAgeMin] = useState(user?.datingPreferences?.ageMin || 24);
  const [ageMax, setAgeMax] = useState(user?.datingPreferences?.ageMax || 35);
  const [marriageTimeline, setMarriageTimeline] = useState(user?.datingPreferences?.marriageTimeline || 'Within 6 to 12 months');
  const [kundliMatchRequired, setKundliMatchRequired] = useState(user?.datingPreferences?.kundliMatchRequired || false);

  // Privacy Settings
  const [photoPrivacyShield, setPhotoPrivacyShield] = useState(user?.privacySettings?.photoPrivacyShield ?? true);
  const [contactDisclosureConsent, setContactDisclosureConsent] = useState(user?.privacySettings?.contactDisclosureConsent ?? false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(user?.privacySettings?.showOnlineStatus ?? true);

  if (!isOpen || !user) return null;

  // Handle Photo upload simulation (FileReader)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter(i => i !== tag));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      fullName,
      photoUrl,
      bio,
      city,
      profession,
      education,
      community,
      diet,
      interests,
      datingPreferences: {
        ...user.datingPreferences,
        ageMin,
        ageMax,
        marriageTimeline,
        kundliMatchRequired
      },
      privacySettings: {
        ...user.privacySettings,
        photoPrivacyShield,
        contactDisclosureConsent,
        showOnlineStatus
      }
    });
    setIsSaving(false);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-[#DFCEBD] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 transition cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] font-serif uppercase tracking-widest text-[#9B1D36] font-semibold">
            Patron Profile Dossier
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#1E1919]">
            Edit Sanctum Profile
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#DFCEBD] mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-serif font-medium transition cursor-pointer ${
              activeTab === 'profile'
                ? 'border-b-2 border-[#4E051A] text-[#4E051A] font-bold'
                : 'text-[#736A63] hover:text-[#1E1919]'
            }`}
          >
            Personal & Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 px-4 text-xs font-serif font-medium transition cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-b-2 border-[#4E051A] text-[#4E051A] font-bold'
                : 'text-[#736A63] hover:text-[#1E1919]'
            }`}
          >
            Dating & Match Preferences
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 text-xs font-serif font-medium transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-b-2 border-[#4E051A] text-[#4E051A] font-bold'
                : 'text-[#736A63] hover:text-[#1E1919]'
            }`}
          >
            Privacy & Escrow Settings
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* TAB 1: PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              
              {/* Photo Upload with Live Preview */}
              <div className="p-4 rounded-2xl bg-white border border-[#DFCEBD] flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#4E051A] shadow-md flex-shrink-0">
                  <img src={photoUrl || user.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  {photoPrivacyShield && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-lg">shield</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="font-serif text-sm font-semibold text-[#1E1919]">
                    Patron Portrait Upload
                  </div>
                  <p className="text-xs text-[#5B4F48]">
                    High-resolution portraits ensure dignified presence. Supports JPG, PNG.
                  </p>
                  <label className="inline-block px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#DFCEBD] text-xs font-semibold text-[#4E051A] hover:bg-[#F3ECE4] cursor-pointer transition">
                    Upload New Image
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Primary Residence (City)</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Profession & Designation</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Alma Mater & Degrees</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Community / Heritage</label>
                  <input
                    type="text"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Dietary Lifestyle</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Personal Bio & Ethos</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                />
              </div>

              {/* Interests Tags */}
              <div>
                <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">Passions & Interests</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {interests.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#DFCEBD] text-xs font-medium text-[#4E051A]"
                    >
                      {tag}
                      <button type="button" onClick={() => handleRemoveInterest(tag)} className="text-stone-400 hover:text-rose-600">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    placeholder="Add an interest (e.g. Hindustani Classical)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs bg-white text-[#1E1919]"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-1.5 rounded-xl bg-[#4E051A] text-white text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DATING PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#DFCEBD] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#1E1919]">
                  Partner Criteria & Matrimonial Scope
                </h4>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#5B4F48] mb-1">
                    <span>Desired Age Range</span>
                    <span>{ageMin} yrs — {ageMax} yrs</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min={18}
                      max={60}
                      value={ageMin}
                      onChange={(e) => setAgeMin(parseInt(e.target.value) || 18)}
                      className="px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-[#FAF7F2]"
                    />
                    <input
                      type="number"
                      min={18}
                      max={70}
                      value={ageMax}
                      onChange={(e) => setAgeMax(parseInt(e.target.value) || 35)}
                      className="px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-[#FAF7F2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">
                    Matrimonial Union Timeline
                  </label>
                  <select
                    value={marriageTimeline}
                    onChange={(e) => setMarriageTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-[#FAF7F2]"
                  >
                    <option value="Immediate (within 3–6 months)">Immediate (within 3–6 months)</option>
                    <option value="Within 6 to 12 months">Within 6 to 12 months</option>
                    <option value="Intentional Courtship (1–2 years)">Intentional Courtship (1–2 years)</option>
                    <option value="Flexible with right alignment">Flexible with right alignment</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-[#DFCEBD]">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#1E1919] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kundliMatchRequired}
                      onChange={(e) => setKundliMatchRequired(e.target.checked)}
                      className="rounded text-[#4E051A]"
                    />
                    <span>Require 18+ Gunas Astrological Kundli Harmony for incoming inquiries</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY & ESCROW */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#DFCEBD] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#1E1919]">
                      Photo Privacy Shield
                    </div>
                    <p className="text-xs text-[#5B4F48]">
                      Tastefully blur portrait photos until mutual spark is accepted.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={photoPrivacyShield}
                    onChange={(e) => setPhotoPrivacyShield(e.target.checked)}
                    className="w-5 h-5 accent-[#4E051A] rounded cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-[#DFCEBD] flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#1E1919]">
                      Bilateral Contact Disclosure Escrow
                    </div>
                    <p className="text-xs text-[#5B4F48]">
                      Never share phone or email without explicit reciprocal consent.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={contactDisclosureConsent}
                    onChange={(e) => setContactDisclosureConsent(e.target.checked)}
                    className="w-5 h-5 accent-[#4E051A] rounded cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-[#DFCEBD] flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#1E1919]">
                      Display Online Sanctum Presence
                    </div>
                    <p className="text-xs text-[#5B4F48]">
                      Permit mutual matches to observe when you are active.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showOnlineStatus}
                    onChange={(e) => setShowOnlineStatus(e.target.checked)}
                    className="w-5 h-5 accent-[#4E051A] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-[#DFCEBD] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#DFCEBD] text-xs font-semibold text-[#5B4F48] hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-full bg-[#4E051A] hover:bg-[#680C25] text-white text-xs font-semibold shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Preserving...' : 'Seal Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
