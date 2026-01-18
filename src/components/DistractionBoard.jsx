import React, { useState } from 'react';
import { Heart, BookOpen, Briefcase, Brain, Home, Plus, X, Check, ChevronDown, Zap } from 'lucide-react';

const DistractionBoard = ({ entries, selectedDate, onAddEntry, onRemoveEntry, onClearCategory, onToggleEntry, onAddSubEntry, onRemoveSubEntry, onToggleSubEntry }) => {
  const categories = [
    { id: 'relationships', name: 'Relationships / Social', icon: Heart, color: 'bg-rose-50 border-rose-200' },
    { id: 'school', name: 'School / Learning', icon: BookOpen, color: 'bg-blue-50 border-blue-200' },
    { id: 'work', name: 'Work / Career', icon: Briefcase, color: 'bg-purple-50 border-purple-200' },
    { id: 'emotional', name: 'Emotional / Mental', icon: Brain, color: 'bg-amber-50 border-amber-200' },
    { id: 'life', name: 'Life Admin', icon: Home, color: 'bg-green-50 border-green-200' },
    { id: 'upskilling', name: 'Upskilling', icon: Zap, color: 'bg-orange-50 border-orange-200' }
  ];

  const [newEntry, setNewEntry] = useState({});
  const [isAdding, setIsAdding] = useState({});
  const [error, setError] = useState(null);
  const [expandedEntries, setExpandedEntries] = useState({});
  const [addingSubEntry, setAddingSubEntry] = useState({});
  const [newSubEntry, setNewSubEntry] = useState({});

  const handleAddEntry = async (categoryId) => {
    const text = newEntry[categoryId]?.trim();
    if (!text) return;

    try {
      setError(null);
      await onAddEntry(selectedDate, categoryId, text);
      setNewEntry({ ...newEntry, [categoryId]: '' });
      setIsAdding({ ...isAdding, [categoryId]: false });
    } catch (err) {
      console.error("Error adding entry:", err);
      if (err.message === "STORAGE_QUOTA_EXCEEDED") {
        setError("Storage is full! Please archive old entries to make space.");
      } else {
        setError("Failed to save entry. Please try again.");
      }
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleAddSubEntry = async (categoryId, entryId) => {
    const text = newSubEntry[`${categoryId}-${entryId}`]?.trim();
    if (!text) return;

    try {
      setError(null);
      await onAddSubEntry(selectedDate, categoryId, entryId, text);
      setNewSubEntry({ ...newSubEntry, [`${categoryId}-${entryId}`]: '' });
      setAddingSubEntry({ ...addingSubEntry, [`${categoryId}-${entryId}`]: false });
    } catch (err) {
      console.error("Error adding sub-entry:", err);
      if (err.message === "STORAGE_QUOTA_EXCEEDED") {
        setError("Storage is full! Please archive old entries to make space.");
      } else {
        setError("Failed to save sub-entry. Please try again.");
      }
      setTimeout(() => setError(null), 5000);
    }
  };

  const toggleExpanded = (categoryId, entryId) => {
    const key = `${categoryId}-${entryId}`;
    console.log(`[toggleExpanded] Key: ${key}, Current value: ${expandedEntries[key]}, New value: ${!expandedEntries[key]}`);
    setExpandedEntries({ ...expandedEntries, [key]: !expandedEntries[key] });
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="text-sm font-medium">⚠️ {error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map(category => {
        const Icon = category.icon;
        const categoryEntries = entries[category.id] || [];
        const isAddingEntry = isAdding[category.id];

        return (
          <div 
            key={category.id} 
            className={`${category.color} border-2 rounded-lg p-4 transition-all hover:shadow-md`}
          >
            {/* Category Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-slate-700" />
                <h2 className="font-semibold text-slate-800">{category.name}</h2>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-full">
                {categoryEntries.length}
              </span>
            </div>

            {/* Entries List */}
            <div className="space-y-2 mb-3 min-h-[60px]">
              {categoryEntries.map(entry => {
                // Defensive: Use ?? false to handle old entries without checked property
                const isChecked = entry.checked ?? false;
                const subEntries = entry.subEntries ?? [];
                const hasSubEntries = subEntries.length > 0;
                const isExpandedKey = `${category.id}-${entry.id}`;
                const isExpanded = expandedEntries[isExpandedKey];
                
                return (
                  <div key={entry.id}>
                    {/* Main Entry */}
                    <div 
                      className="bg-white rounded p-2.5 text-sm flex items-start justify-between gap-2 group"
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {/* Checkbox Button */}
                        <button
                          onClick={() => onToggleEntry(selectedDate, category.id, entry.id)}
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-blue-500 border-blue-500 hover:bg-blue-600'
                              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                          title={isChecked ? 'Mark as undone' : 'Mark as done'}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </button>

                        {/* Entry Text and Expand Button */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {/* Expand/Collapse Button */}
                            <button
                              onClick={() => toggleExpanded(category.id, entry.id)}
                              className="flex-shrink-0 p-0 text-slate-500 hover:text-slate-700 transition-colors"
                              title={isExpanded ? 'Hide sub-entries' : 'Show sub-entries'}
                            >
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                              />
                            </button>
                            <p className={`leading-snug break-words ${
                              isChecked 
                                ? 'text-slate-400 line-through' 
                                : 'text-slate-700'
                            }`}>
                              {entry.text}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">
                                {entry.createdDate && new Date(entry.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="text-xs text-slate-400">{entry.timestamp}</span>
                            </div>
                            {isChecked && entry.completedDate && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-green-600">
                                  {new Date(entry.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-xs text-green-600">{entry.completedTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => onRemoveEntry(selectedDate, category.id, entry.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 flex-shrink-0"
                        title="Delete entry"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sub-entries Section */}
                    {isExpanded && (
                      <div className={`mt-2 rounded ${
                        category.id === 'relationships' ? 'bg-rose-100' :
                        category.id === 'school' ? 'bg-blue-100' :
                        category.id === 'work' ? 'bg-purple-100' :
                        category.id === 'emotional' ? 'bg-amber-100' :
                        category.id === 'life' ? 'bg-green-100' :
                        category.id === 'upskilling' ? 'bg-orange-100' :
                        'bg-slate-100'
                      }`}>
                        <div className="ml-6 space-y-1.5 p-2.5">
                        {/* Existing Sub-entries */}
                        {subEntries.map(subEntry => {
                          const subIsChecked = subEntry.checked ?? false;
                          return (
                            <div
                              key={subEntry.id}
                              className="bg-white rounded p-2 text-xs flex items-start justify-between gap-2 group"
                            >
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                {/* Sub-entry Checkbox */}
                                <button
                                  onClick={() => onToggleSubEntry(selectedDate, category.id, entry.id, subEntry.id)}
                                  className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                    subIsChecked
                                      ? 'bg-blue-500 border-blue-500 hover:bg-blue-600'
                                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                                  }`}
                                  title={subIsChecked ? 'Mark as undone' : 'Mark as done'}
                                >
                                  {subIsChecked && <Check className="w-2.5 h-2.5 text-white" />}
                                </button>

                                {/* Sub-entry Text */}
                                <div className="flex-1 min-w-0">
                                  <p className={`leading-snug break-words ${
                                    subIsChecked 
                                      ? 'text-slate-400 line-through' 
                                      : 'text-slate-700'
                                  }`}>
                                    {subEntry.text}
                                  </p>
                                  <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-slate-400">
                                        {subEntry.createdDate && new Date(subEntry.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </span>
                                      <span className="text-xs text-slate-400">{subEntry.timestamp}</span>
                                    </div>
                                    {subIsChecked && subEntry.completedDate && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs text-green-600">
                                          {new Date(subEntry.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="text-xs text-green-600">{subEntry.completedTime}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Sub-entry Delete Button */}
                              <button
                                onClick={() => onRemoveSubEntry(selectedDate, category.id, entry.id, subEntry.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 flex-shrink-0"
                                title="Delete sub-entry"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}

                        {/* Add Sub-entry Section */}
                        {addingSubEntry[`${category.id}-${entry.id}`] ? (
                          <div className="space-y-1.5 mt-2">
                            <input
                              type="text"
                              placeholder="Add sub-entry..."
                              value={newSubEntry[`${category.id}-${entry.id}`] || ''}
                              onChange={(e) => setNewSubEntry({ ...newSubEntry, [`${category.id}-${entry.id}`]: e.target.value })}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddSubEntry(category.id, entry.id)}
                              className="w-full px-2 py-1.5 text-xs text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                              autoFocus
                            />
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleAddSubEntry(category.id, entry.id)}
                                className="flex-1 px-2 py-1 bg-slate-700 text-white text-xs rounded hover:bg-slate-800 transition-colors"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setAddingSubEntry({ ...addingSubEntry, [`${category.id}-${entry.id}`]: false });
                                  setNewSubEntry({ ...newSubEntry, [`${category.id}-${entry.id}`]: '' });
                                }}
                                className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingSubEntry({ ...addingSubEntry, [`${category.id}-${entry.id}`]: true })}
                            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-50 transition-colors mt-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add sub-entry
                          </button>
                        )}
                      </div>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Entry Section */}
            {isAddingEntry ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Quick capture (keep it short)..."
                  value={newEntry[category.id] || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, [category.id]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEntry(category.id)}
                  className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddEntry(category.id)}
                    className="flex-1 px-3 py-1.5 bg-slate-700 text-white text-sm rounded hover:bg-slate-800 transition-colors"
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding({ ...isAdding, [category.id]: false });
                      setNewEntry({ ...newEntry, [category.id]: '' });
                    }}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding({ ...isAdding, [category.id]: true })}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add thought
                </button>
                {categoryEntries.length > 0 && (
                  <button
                    onClick={() => onClearCategory(selectedDate, category.id)}
                    className="px-3 py-2 bg-white border border-slate-300 text-slate-500 text-xs rounded hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      </div>
    </>
  );
};

export default DistractionBoard;


