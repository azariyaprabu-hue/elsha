import React, { useState } from 'react';
import {
  Settings,
  User,
  Palette,
  Shield,
  FileCode2,
  X,
  Check,
  Moon,
  Sun,
  Lock,
  Database,
  Terminal,
  ExternalLink,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { ZionUser } from '../../server/zionDb';

interface ZionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ZionUser;
  onUpdateProfile: (updates: Partial<ZionUser>) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  wallpaper: string;
  onChangeWallpaper: (wp: string) => void;
}

export const ZionSettingsModal: React.FC<ZionSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  isDarkMode,
  onToggleDarkMode,
  wallpaper,
  onChangeWallpaper,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'privacy' | 'docs'>('profile');

  // Profile Form
  const [name, setName] = useState(currentUser.name);
  const [about, setAbout] = useState(currentUser.about);
  const [phone, setPhone] = useState(currentUser.phone);
  const [isSaved, setIsSaved] = useState(false);

  const [copiedDoc, setCopiedDoc] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, about, phone });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const copySetupGuide = () => {
    const text = `# ZION AI Communication Application - Setup & Deployment Guide

## 1. Environment Variables (.env)
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000

# Optional Official WhatsApp Cloud API:
WHATSAPP_PHONE_NUMBER=your_meta_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token

## 2. Running Locally
npm install
npm run dev

## 3. Database Schema
Stored persistently at data/zion_database.json
- Users: id, name, username, phone, avatar, about, status
- Contacts: id, name, phone, avatar, about, status
- Chats: id, isGroup, name, avatar, participants, unreadCount
- Messages: id, chatId, senderId, text, timestamp, status, mediaUrl
- Linked Devices: id, name, platform, lastActive, status

## 4. Deployment
npm run build
npm start
`;
    navigator.clipboard.writeText(text);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 dark:border-purple-950 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                ZION Settings & Configuration
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Customize profile, themes, encryption, and system documentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Wallpaper</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security & E2EE</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'docs'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Setup & Architecture</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 1. PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                    @{currentUser.username}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    About / Bio Status
                  </label>
                  <input
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Profile Saved!</span>
                  </>
                ) : (
                  <span>Save Profile Changes</span>
                )}
              </button>
            </form>
          )}

          {/* 2. APPEARANCE & WALLPAPER */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Dark Mode Switcher */}
              <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    App Theme Mode
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Switch between Premium Purple/White and Dark Obsidian/Purple
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-purple-700 transition-all cursor-pointer"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              {/* Wallpaper Presets */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                  Chat Wallpaper Background
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'classic', name: 'Classic Doodle', bg: 'bg-[#EDE7F6] dark:bg-[#130E2B]' },
                    { id: 'minimal', name: 'Clean White', bg: 'bg-white dark:bg-[#070518]' },
                    { id: 'purple', name: 'Purple Gradient', bg: 'bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-[#0B0826]' },
                    { id: 'midnight', name: 'Midnight Obsidian', bg: 'bg-[#0B0826]' },
                  ].map((wp) => (
                    <div
                      key={wp.id}
                      onClick={() => onChangeWallpaper(wp.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-center space-y-2 transition-all ${
                        wallpaper === wp.id
                          ? 'border-purple-600 ring-2 ring-purple-400 shadow-md'
                          : 'border-slate-200 dark:border-purple-900 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-full h-14 rounded-lg border border-purple-200/50 ${wp.bg}`} />
                      <span className="text-xs font-bold block">{wp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SECURITY & PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex items-start gap-3">
                <Lock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    End-to-End Cryptographic Protocol
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Messages and device pairings within ZION are protected by local encryption fingerprints and verified single-use pairing tokens.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-purple-900 rounded-xl overflow-hidden text-xs">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Read Receipts (Double Purple Ticks)
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Show contacts when you have read their messages
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Last Seen & Online Presence
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Share real-time status with saved contacts
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. SETUP INSTRUCTIONS & ARCHITECTURE */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Developer Setup & Deployment Guide
                </h4>
                <button
                  onClick={copySetupGuide}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950 flex items-center gap-1.5"
                >
                  {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Instructions</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-3 leading-relaxed overflow-x-auto">
                <div>
                  <span className="text-purple-400 font-bold"># 1. Environment Variables</span>
                  <p className="text-slate-400">
                    GEMINI_API_KEY=your_gemini_api_key<br />
                    PORT=3000<br />
                    WHATSAPP_PHONE_NUMBER=meta_phone_number_id<br />
                    WHATSAPP_ACCESS_TOKEN=meta_access_token
                  </p>
                </div>

                <div>
                  <span className="text-purple-400 font-bold"># 2. Real Database Integration</span>
                  <p className="text-slate-400">
                    Persistent file at <code>data/zion_database.json</code> with atomic persistence for Users, Contacts, Chats, Messages, Devices.
                  </p>
                </div>

                <div>
                  <span className="text-purple-400 font-bold"># 3. ZION AI Model Integration</span>
                  <p className="text-slate-400">
                    Powered by @google/genai SDK targeting <code>gemini-3.8-flash</code> for Translation, Summaries, and Smart Replies.
                  </p>
                </div>

                <div>
                  <span className="text-purple-400 font-bold"># 4. Run & Deploy</span>
                  <p className="text-slate-400">
                    npm install<br />
                    npm run dev (Runs Express on port 3000 with Vite middleware)<br />
                    npm run build && npm start
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
