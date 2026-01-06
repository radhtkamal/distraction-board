# Checkbox Feature - Comprehensive Test Plan

## Overview

Adding checkbox/strikethrough functionality to entries while maintaining full backward compatibility with existing data.

---

## Test Categories

### A. DATA LOADING & INITIALIZATION

#### A1: Load App with No Existing Data

- **Steps:**
  1. Clear IndexedDB (DevTools > Application > IndexedDB > delete DB)
  2. Refresh page
  3. Create first entry
- **Expected:**
  - Entry has `checked: false` by default
  - No console errors
  - Entry renders normally without strikethrough

#### A2: Load App with Old Entries (No 'checked' Property)

- **Steps:**
  1. Manually inject old entry into IndexedDB: `{ id: 123, text: "old entry", timestamp: "2:30 PM" }` (no checked property)
  2. Refresh page
  3. Observe entry renders
- **Expected:**
  - Entry displays without errors
  - Checkbox is unchecked visually
  - No console errors

#### A3: Load App with Mixed Old & New Entries

- **Steps:**
  1. Create entry with old structure
  2. Toggle its checkbox to create new structure
  3. Refresh page
  4. Check both entries render correctly
- **Expected:**
  - Both entries render
  - Old entry reverts to unchecked after refresh (since it doesn't have checked property)
  - No console errors

---

### B. CHECKBOX TOGGLE FUNCTIONALITY

#### B1: Toggle New Entry (checked: false)

- **Steps:**
  1. Create a new entry
  2. Click checkbox to toggle it
  3. Observe UI change
  4. Refresh page
- **Expected:**
  - Text becomes strikethrough and gray immediately
  - Checkbox appears filled/checked
  - After refresh, checkbox state persists (stays checked)
  - No console errors

#### B2: Toggle Entry Back to Unchecked

- **Steps:**
  1. Create entry and check it
  2. Click checkbox again
  3. Refresh page
- **Expected:**
  - Strikethrough removes, text returns to normal color
  - Checkbox appears unchecked
  - After refresh, state persists (stays unchecked)
  - No console errors

#### B3: Toggle Old Entry (No 'checked' Property)

- **Steps:**
  1. Inject old entry without checked property
  2. Refresh
  3. Click checkbox to toggle it
  4. Refresh page again
- **Expected:**
  - Entry becomes checked and strikethrough applies
  - After refresh, stays checked
  - No console errors

#### B4: Multiple Toggles in Sequence

- **Steps:**
  1. Create entry
  2. Click checkbox 5 times in rapid succession
  3. Observe final state
  4. Refresh page
- **Expected:**
  - Final state is correct (odd number = checked, even = unchecked)
  - No UI glitches or console errors
  - Data persists correctly

---

### C. EXPORT & IMPORT

#### C1: Export New Entries with Checked Status

- **Steps:**
  1. Create 3 entries
  2. Check entry 1 and 3
  3. Export data
  4. Open JSON file and search for "checked"
- **Expected:**
  - All entries have "checked" property in JSON
  - Correct entries show `"checked": true`
  - Others show `"checked": false`

#### C2: Export Old Entries (No Checked Property)

- **Steps:**
  1. Inject old entries manually
  2. Export data
  3. Check JSON
- **Expected:**
  - Old entries in JSON do NOT have "checked" property
  - File exports without errors

#### C3: Import Exported Data

- **Steps:**
  1. Create entries, check some, export
  2. Clear IndexedDB
  3. Import the exported JSON
  4. Verify checkbox states
- **Expected:**
  - All entries load with correct checked states
  - No console errors
  - UI displays correctly

#### C4: Import Old Backup (No 'checked' Properties)

- **Steps:**
  1. Create old format backup JSON (entries without checked property)
  2. Clear IndexedDB
  3. Import old JSON
  4. Verify entries load and can be toggled
- **Expected:**
  - Old entries load without errors
  - Checkboxes appear unchecked
  - Can toggle them normally
  - After toggle, they become checked

#### C5: Import Corrupted/Malformed Data

- **Steps:**
  1. Create broken JSON (missing required fields)
  2. Try to import
- **Expected:**
  - Error message shown to user
  - Existing data not corrupted
  - No uncaught console errors

---

### D. ARCHIVE OPERATIONS

#### D1: Archive Checked & Unchecked Entries

- **Steps:**
  1. Create entries, check some
  2. Archive entries older than 7 days
  3. Open archived JSON file
- **Expected:**
  - Archived file contains all entries with correct checked states
  - Remaining entries in app are correct
  - No data loss

#### D2: Import Archived Data (With Checked States)

- **Steps:**
  1. Archive entries with checked states
  2. Clear current entries
  3. Import archived file
  4. Verify checked states persist
- **Expected:**
  - All entries import with original checked states
  - UI renders correctly

---

### E. UI/UX RENDERING

#### E1: Strikethrough Styling Applied Correctly

- **Steps:**
  1. Create entry and check it
  2. Visually inspect
- **Expected:**
  - Text has visible strikethrough
  - Text color is grayed out (lighter gray)
  - Checkbox icon is filled/checked

#### E2: Unchecked Entry Styling

- **Steps:**
  1. Create entry (default unchecked)
  2. Visually inspect
- **Expected:**
  - Text has NO strikethrough
  - Text color is normal (slate-700)
  - Checkbox is empty/unchecked

#### E3: Entry Count Not Affected by Checked State

- **Steps:**
  1. Create 5 entries
  2. Check some of them
  3. Check the count badge
- **Expected:**
  - Count always shows 5
  4. Checked entries are still counted
  - Count doesn't change when toggling

#### E4: Delete Still Works on Checked Entries

- **Steps:**
  1. Create entry and check it
  2. Hover over it
  3. Click X button
- **Expected:**
  - Entry is deleted
  - No error on delete
  - Entry disappears from list

---

### F. STORAGE & PERFORMANCE

#### F1: Storage Size Impact

- **Steps:**
  1. Create 100 entries
  2. Check storage used (DevTools > Application > IndexedDB > Inspect)
  3. Check 50 of them
  4. Monitor storage size
- **Expected:**
  - Storage increases slightly (~20 bytes per entry for new checked property)
  - No exponential growth
  - No performance degradation

#### F2: Large Dataset Performance

- **Steps:**
  1. Create 500 entries across multiple dates
  2. Toggle checkboxes rapidly
  3. Switch between dates
- **Expected:**
  - UI remains responsive
  - No lag when toggling
  - Page switches dates smoothly

---

### G. EDGE CASES

#### G1: Toggle Entry with Undefined checked Property

- **Steps:**
  1. Create old-format entry
  2. Don't refresh, toggle immediately
  3. Check data structure
- **Expected:**
  - Toggle works correctly
  - Data structure updates properly
  - No console errors about undefined

#### G2: Simultaneously Check Multiple Entries

- **Steps:**
  1. Create 3 entries
  2. Click all 3 checkboxes very quickly
  3. Refresh page
- **Expected:**
  - All 3 remain in their checked state
  - No race condition bugs
  - Data persists correctly

#### G3: Toggle, Export, Modify JSON, Import

- **Steps:**
  1. Create entry and check it
  2. Export as JSON
  3. Manually edit JSON to set checked to false
  4. Import again
  5. Verify state
- **Expected:**
  - New state (unchecked) loads from import
  - No merge conflicts
  - Previous state is overwritten correctly

---

### H. BROWSER CONSOLE VERIFICATION

For ALL tests above, verify:

- ✅ No red errors in console
- ✅ No yellow warnings about undefined properties
- ✅ No "Cannot read property of undefined" errors
- ✅ No JSON serialization errors

---

## Test Execution Order

1. **First:** A1, A2, A3 (Data loading)
2. **Second:** B1, B2, B3, B4 (Toggle functionality)
3. **Third:** C1, C2, C3, C4 (Export/Import)
4. **Fourth:** D1, D2 (Archive)
5. **Fifth:** E1, E2, E3, E4 (UI)
6. **Sixth:** F1, F2 (Performance)
7. **Seventh:** G1, G2, G3 (Edge cases)
8. **Finally:** H (Console check for all)

---

## Success Criteria

✅ All tests pass without errors
✅ No data corruption at any point
✅ Backward compatibility maintained (old data loads and works)
✅ New checked property persists across refresh/reimport
✅ UI renders correctly for both checked and unchecked states
✅ No console errors
✅ Archive/export/import preserve checked state
✅ Delete and clear operations unaffected

---

## Bug Report Template (If Issues Found)

**Test ID:** (e.g., B2)
**Steps to reproduce:**
**Expected:**
**Actual:**
**Console output:** (paste relevant errors)
**Data state before:** (paste JSON structure)
**Data state after:** (paste JSON structure)
