import React, { useState } from 'react';
import { UserPlus, Users, Search, X, Check, Loader2, ArrowRight } from 'lucide-react';
import { ZionContact } from '../../server/zionDb';

interface ZionNewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: ZionContact[];
  onStartDirectChat: (contact: ZionContact) => void;
  onCreateGroup: (groupData: { name: string; participantIds: string[]; about?: string }) => void;
  onAddContact: (contact: { name: string; phone: string; about?: string }) => void;
}

export const ZionNewChatModal: React.FC<ZionNewChatModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onStartDirectChat,
  onCreateGroup,
  onAddContact,
}) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'newGroup' | 'addContact'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');

  // Group creation state
  const [groupName, setGroupName] = useState('');
  const [groupAbout, setGroupAbout] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Add Contact state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAbout, setContactAbout] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setIsCreatingGroup(true);
    try {
      await onCreateGroup({
        name: groupName.trim(),
        participantIds: selectedContactIds,
        about: groupAbout.trim() || undefined,
      });
      onClose();
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    setIsAddingContact(true);
    try {
      await onAddContact({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        about: contactAbout.trim() || undefined,
      });
      setActiveTab('contacts');
    } finally {
      setIsAddingContact(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 dark:border-purple-950 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              {activeTab === 'newGroup' ? (
                <Users className="w-5 h-5" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                {activeTab === 'contacts'
                  ? 'Start New Chat'
                  : activeTab === 'newGroup'
                  ? 'Create New Group'
                  : 'Add New Contact'}
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                {activeTab === 'contacts'
                  ? 'Select contact or create a group'
                  : activeTab === 'newGroup'
                  ? 'Add participants and set group title'
                  : 'Save phone number to contacts'}
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
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'contacts'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Contacts Directory
          </button>
          <button
            onClick={() => setActiveTab('newGroup')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'newGroup'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            New Group
          </button>
          <button
            onClick={() => setActiveTab('addContact')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'addContact'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Add Contact
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: Contacts Directory */}
          {activeTab === 'contacts' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts by name or phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      onStartDirectChat(contact);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-300 dark:ring-purple-800"
                        />
                        {contact.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0B0826]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {contact.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-600 opacity-60" />
                  </div>
                ))}

                {filteredContacts.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No contacts found. Tap "Add Contact" to save one.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: New Group */}
          {activeTab === 'newGroup' && (
            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. ZION Developers / Operations Team"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Group Description / Purpose (Optional)
                </label>
                <input
                  type="text"
                  value={groupAbout}
                  onChange={(e) => setGroupAbout(e.target.value)}
                  placeholder="e.g. Daily team announcements and updates"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Select Members ({selectedContactIds.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-purple-100 dark:border-purple-900 p-2 rounded-xl">
                  {contacts.map((c) => {
                    const isSelected = selectedContactIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleSelectContact(c.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100'
                            : 'hover:bg-slate-50 dark:hover:bg-purple-950/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-medium">{c.name}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingGroup || !groupName.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isCreatingGroup ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Group...</span>
                  </>
                ) : (
                  <span>Create Group Chat</span>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: Add Contact */}
          {activeTab === 'addContact' && (
            <form onSubmit={handleAddContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rajesh Kannan"
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
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98401 22334"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Bio / Role (Optional)
                </label>
                <input
                  type="text"
                  value={contactAbout}
                  onChange={(e) => setContactAbout(e.target.value)}
                  placeholder="e.g. Sports Medicine Specialist"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isAddingContact || !contactName.trim() || !contactPhone.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isAddingContact ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Contact...</span>
                  </>
                ) : (
                  <span>Save to Contacts</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
