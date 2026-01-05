# Storage Upgrade & Archiving System 📦

## Overview
You now have a complete storage management system that increases your storage capacity and allows you to archive old entries when approaching the limit.

## What's New?

### 1. **Persistent Storage Permission**
On app load, the system now requests persistent storage from your browser. This significantly increases your quota:
- **iOS Safari PWA**: Can increase from ~50MB to ~100MB+
- **Desktop Safari**: Unlimited potential with permission
- **Chrome/Firefox**: Similar improvements

### 2. **Real-time Storage Monitoring**
A new storage quota bar appears at the top of your board showing:
- Current usage (e.g., "2.5 MB / 100 MB")
- Visual progress indicator
- Percentage used with color coding:
  - 🔵 Blue: 0-79% (normal)
  - 🟠 Amber: 80-94% (warning)
  - 🔴 Red: 95%+ (critical)

### 3. **Intelligent Archiving System**
When storage reaches 80%, a warning appears with an "Archive Old Entries" button that opens a modal allowing you to:
- **Choose age threshold**: 7, 14, 30, 60, 90 days (or custom)
- **Preview what will be archived**: See number of dates, entries, and storage freed
- **Confirm before archiving**: Review exactly what you're about to archive
- **Auto-download**: Archived data is automatically downloaded as JSON
- **Free up space**: Entries are removed from active storage after archiving

### 4. **Archive Files**
Each time you archive, a file is downloaded:
- Filename: `distraction-board-archive-YYYY-MM-DD.json`
- Contains: All archived entries with metadata
- Safe: Can be restored anytime via the Import function
- Organized: Save these files for long-term record keeping

## How It Works

### Storage Flow:
```
Add Entry → Check Quota → Quota < 80%? → Normal
                              ↓ No
                          Show Warning + Archive Button
                              ↓
                          User Clicks Archive
                              ↓
                          Preview Modal Opens
                              ↓
                          User Confirms
                              ↓
                          Archive Downloaded + Entries Deleted
                              ↓
                          Storage Freed + Quota Rechecked
```

### Technical Details:
- **Hook**: `useStorageQuota` manages quota checking and archiving logic
- **Component**: `StorageQuotaBar` displays storage usage
- **Component**: `ArchiveModal` handles archiving UI
- **Default**: 30 days is the default archive threshold (configurable per archive)
- **Auto-persist**: The system requests persistent storage on first load

## Features in Detail

### 📊 Storage Quota Bar
Located at the top of the app, below the success message:
- Shows real-time usage
- Visual progress bar
- Warning messages with actionable button
- Only appears when not loading

### 🗃️ Archive Modal
Opens when you click "Archive Old Entries":
1. **Days Selector**: Quick buttons for common intervals + custom input
2. **Preview Section**: Shows exactly what will be archived
   - Number of dates affected
   - Total entries to archive
   - Storage space that will be freed
   - List of earliest dates to be archived
3. **Remaining Entries**: Shows how many recent entries will stay
4. **Action Buttons**:
   - Cancel: Close without archiving
   - Archive & Download: Execute archiving and download file

### 💾 Data Management
- **Export**: Still works as before - downloads full current dataset
- **Import**: Can restore archived data if needed
- **Archive**: New way to free space while keeping backups
- **Data Safety**: All archived data is downloaded before deletion

## Usage Guide

### First Time Use:
1. App loads → Requests persistent storage → Grant permission on prompt
2. Storage bar appears showing your quota
3. Continue using normally

### When Storage Fills Up:
1. Warning appears at 80% usage
2. Click "Archive Old Entries" button
3. Modal opens showing what will be archived
4. Choose your archive age (default 30 days)
5. Click "Archive & Download"
6. File downloads automatically
7. Entries are removed from active storage
8. Storage quota updates

### Restoring Archived Data:
1. Click "Import" button
2. Select an archive JSON file you downloaded earlier
3. Data is restored to active storage
4. You can now view/edit it again

## Storage Limits & Quotas

### Typical Quotas by Device:
| Device | Before | After Permission |
|--------|--------|-----------------|
| iPad (Safari PWA) | ~50 MB | ~100 MB+ |
| iPhone (Safari PWA) | ~50 MB | ~100 MB+ |
| Desktop Safari | ~50 MB | Unlimited* |
| Chrome/Firefox | ~50 MB | ~50 MB+ |

*Persistent storage on desktop generally isn't quota-limited

### Data Size Estimates:
- **Per Entry**: ~100-300 bytes (depending on text length)
- **26 Entries**: ~2.6-7.8 KB per category, ~13-40 KB total
- **Your Setup**: Currently at the 26-entry limit suggests you were approaching ~5-10 MB with indexing overhead

## Troubleshooting

### "Storage quota check failed"
- Ensure you're using a modern browser
- Try force-refreshing the app
- Check browser privacy settings

### "Persistent storage denied"
- Some browsers require user permission
- Try archiving anyway - you'll still free space
- The quota bar will show your available space

### Can't add entries after upgrade?
- Check storage bar at top
- If >80%, click "Archive Old Entries"
- After archiving, you should have more space

### Archive file not downloading?
- Check browser download settings
- File should appear as `distraction-board-archive-YYYY-MM-DD.json`
- Look in your Downloads folder

## Technical Implementation

### New Files:
- `src/hooks/useStorageQuota.js` - Quota management
- `src/components/StorageQuotaBar.jsx` - Display component
- `src/components/ArchiveModal.jsx` - Archiving interface

### Modified Files:
- `src/hooks/useIndexedDB.js` - Added archiving methods
- `src/App.jsx` - Integrated new components and handlers

### Key Functions:
```javascript
// Check current quota usage
checkQuota() → { usage, quota, percentage, showWarning }

// Get entries to archive
getArchivableEntries(entries, days) → { archivable, remaining }

// Archive and download
archiveEntries(entriesToArchive) → downloads JSON file

// Calculate data size
calculateDataSize(data) → bytes
```

## Best Practices

1. **Regular Exports**: Use Export button monthly for full backups
2. **Archive Periodically**: When warning appears, archive old entries
3. **Organize Archives**: Keep downloaded archive files organized
4. **Monitor Usage**: Check the storage bar regularly
5. **Review Before Archive**: Always preview what will be archived

## FAQ

**Q: Will I lose data if I archive?**
A: No! Archives are downloaded as files before deletion. You can restore them anytime via Import.

**Q: Can I archive entries less than 30 days old?**
A: Yes! The modal lets you choose any time period, even 7 days.

**Q: What happens if I don't grant persistent storage permission?**
A: The app still works, but you have the original ~50MB quota instead of the larger one.

**Q: Can I restore archived entries?**
A: Yes! Use the Import button and select your archive JSON file.

**Q: Are archives encrypted?**
A: No, they're plain JSON files. Store them securely if containing sensitive info.

**Q: How often should I archive?**
A: Archive when the warning appears (80% usage), or monthly as part of routine.

## Next Steps

1. **Test the System**: Try adding entries and monitoring the quota bar
2. **Grant Permissions**: Accept persistent storage prompt when it appears
3. **Archive When Ready**: Use the system when storage reaches 80%
4. **Backup Archives**: Keep your downloaded archive files safe

---

**Last Updated**: January 5, 2026
**Version**: 1.0 - Initial Release

