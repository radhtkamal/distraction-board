# Storage Quota Fix

## Problem
- Storage bar showed `0B/Unlimited` or `undefined`
- Entries couldn't be added when storage full

## Root Cause
- `getIndexedDBUsage()` wasn't correctly reading your stored data
- Quota API returns `0` on iOS Safari (no support)
- Fallback wasn't distinguishable from actual API

## Solution
1. **Real measurement**: Fixed `getIndexedDBUsage()` to read `"all-entries"` key correctly
2. **Actual quota**: Try API first → Falls back to 50MB on iOS with logging showing which was used
3. **Error handling**: Catch quota errors and show user message

## Console Output (Check This)
```
[API] Storage: 0.69MB / 50.00MB / 1.4%          ← Using real API quota
[iOS_FALLBACK] Storage: 0.69MB / 50.00MB / 1.4% ← API returned 0, using fallback
```

## What's Real vs Fallback
- **Real**: If your device supports Storage API (most desktop/Android) → shows actual quota
- **Fallback**: iOS Safari doesn't expose quota → uses 50MB (iOS PWA limit)

Both are honest measurements - we're not lying about storage, just using platform defaults.

## Deploy
```bash
npm run build && git add . && git commit -m "Fix storage measurement" && git push
```

## Test
Open iPad, check console → should see `[API]` or `[iOS_FALLBACK]` label showing which method is active.

