# 📇 Quick Reference Card

Keep this handy! Essential commands and info on one page.

---

## 🚀 GETTING STARTED (Copy & Paste)

### Start Development

```bash
cd /Users/radhwanakamal/Documents/Obsidian\ Vault/2026/self/distraction-board
npm run dev
```

Then visit: `http://localhost:8080`

### Production Build

```bash
npm run build      # Create optimized build
npm run preview    # Test it locally
```

### Clean Reinstall

```bash
rm -rf node_modules
npm install
npm run dev
```

---

## 📱 IPAD SETUP

**On Mac:**

- Run `npm run dev`
- Look at terminal for URL

**On iPad:**

1. Open Safari
2. Paste URL
3. Tap Share
4. Select "Add to Home Screen"
5. Name it
6. Tap "Add"

Done! App icon on home screen. ✨

---

## 🎯 HOW TO USE

### Capture (During Work)

1. Tap category
2. Click "Add thought"
3. Type 1-2 sentences
4. Press Enter
5. Return to work

### Review (After Work)

1. Open app
2. Review today
3. Process each entry
4. Delete handled items

### History (Anytime)

1. Use date picker
2. View past entries
3. See patterns emerge

---

## 📊 THE 5 CATEGORIES

| Icon | Category      | Use For                 |
| ---- | ------------- | ----------------------- |
| ❤️   | Relationships | Friends, family, social |
| 📚   | School        | Study, exams, learning  |
| 💼   | Work          | Job, career, deadlines  |
| 🧠   | Emotional     | Feelings, mental state  |
| 🏠   | Life Admin    | Bills, tasks, logistics |

---

## 💾 DATA & BACKUP

### Automatic

- Saves to localStorage instantly
- Persists across sessions
- Works offline

### Manual Backup

- Click "Export"
- Get JSON file
- Keep it safe
- Use monthly

### Restore

- Import feature coming soon
- For now, manually reference exported JSON

---

## 📁 PROJECT LOCATION

```
/Users/radhwanakamal/Documents/Obsidian\ Vault/2026/self/distraction-board/
```

### Key Files

```
src/App.jsx                    Main component
src/components/DistractionBoard.jsx    UI
src/hooks/useStorage.js        Data management
public/manifest.json           PWA config
public/sw.js                   Offline support
```

---

## ⚙️ CONFIGURATION

### Change Default Port

Edit `vite.config.js`:

```javascript
server: {
  port: 8080,  // Change this
  open: true
}
```

### Add New Category

Edit `src/components/DistractionBoard.jsx`:

```javascript
const categories = [
  // Add new category here
  {
    id: "health",
    name: "🏃 Health",
    icon: Heart,
    color: "bg-red-50 border-red-200",
  },
];
```

### Change Colors

```javascript
color: "bg-indigo-50 border-indigo-200"; // Try any Tailwind color
```

---

## 🎨 TAILWIND COLORS

Use any of these for category colors:

- `bg-rose-50`, `bg-blue-50`, `bg-purple-50`
- `bg-amber-50`, `bg-green-50`, `bg-red-50`
- `bg-indigo-50`, `bg-cyan-50`, `bg-teal-50`
- `bg-lime-50`, `bg-orange-50`, `bg-yellow-50`

Match with borders: `border-rose-200`, `border-blue-200`, etc.

---

## 🚢 DEPLOY (Choose One)

### Vercel (Easiest)

```bash
npm i -g vercel
vercel
# That's it! Get URL instantly
```

### Netlify

- Drag & drop `dist/` folder to netlify.com
- Get URL instantly

### GitHub Pages

```bash
# Push to GitHub
# Enable Pages in repo settings
# Done!
```

---

## ❓ COMMON ISSUES

| Issue             | Solution                                        |
| ----------------- | ----------------------------------------------- |
| App won't start   | Run `npm install` then `npm run dev`            |
| Can't add entries | Check browser console (F12) for errors          |
| Lost data         | Check different dates, then restore from backup |
| PWA won't install | Use Safari on iPad, check manifest.json         |
| Port in use       | Change port in vite.config.js                   |

---

## 📚 DOCUMENTATION

| File                 | Purpose                 |
| -------------------- | ----------------------- |
| START_HERE.md        | Begin here (3 min read) |
| QUICK_START.md       | Setup guide             |
| README.md            | Full features           |
| COMPLETE_SETUP.md    | Detailed tutorial       |
| PROJECT_STRUCTURE.md | Code organization       |
| VISUAL_GUIDE.md      | Diagrams                |

---

## 🔑 KEY CONCEPTS

### Capture = Relief

Don't analyze. Just record the thought.

### Daily Reset

New entries each day, but full history accessible.

### Trust the System

System holds everything. Mind can relax.

### Review Once Daily

Sort entries. Don't review during work!

### Backup Regularly

Use Export feature weekly.

---

## 📊 QUICK STATS

| Metric      | Value                  |
| ----------- | ---------------------- |
| Bundle Size | 52.5 KB (gzipped)      |
| JavaScript  | 49.5 KB (gzipped)      |
| CSS         | 3 KB (gzipped)         |
| Load Time   | <100ms                 |
| Storage     | localStorage (free)    |
| Backend     | None needed            |
| Cost        | Free                   |
| Hosting     | Free options available |

---

## 🎯 FIRST WEEK PLAN

| Day | Action                              |
| --- | ----------------------------------- |
| 1   | Run app, add test entry             |
| 2   | Use during work, review after       |
| 3   | Continue capturing, see if useful   |
| 4-5 | Build habit, notice focus improving |
| 6   | Export backup                       |
| 7   | Reflect on improvements             |

---

## 💭 REMEMBER

**The Goal:** Work with focus, distractions held safely, mind at peace.

**The Rule:** Capture = relief. Reviewing during work = sabotage.

**The Secret:** Trust the system.

---

## 🔗 CHEAT SHEET NAVIGATION

Need something quick? Find it here:

- **Getting started?** → Scroll to "GETTING STARTED"
- **Want iPad?** → Scroll to "IPAD SETUP"
- **How to use?** → Scroll to "HOW TO USE"
- **Lost data?** → Scroll to "COMMON ISSUES"
- **Want colors?** → Scroll to "TAILWIND COLORS"
- **How to deploy?** → Scroll to "DEPLOY"

---

## ⚡ KEYBOARD SHORTCUTS

| Key         | Action                    |
| ----------- | ------------------------- |
| Enter       | Save entry (while typing) |
| F12         | Open DevTools (debug)     |
| Cmd+R       | Reload page (macOS)       |
| Cmd+Shift+R | Hard reload (macOS)       |

---

## 🆘 EMERGENCY COMMANDS

```bash
# Won't start?
rm -rf node_modules && npm install && npm run dev

# Can't find directory?
cd "/Users/radhwanakamal/Documents/Obsidian Vault/2026/self/distraction-board"
npm run dev

# Want to see what's running?
lsof -i :8080

# Kill stuck process?
killall node
```

---

## 📞 SUPPORT PATHS

| Issue             | Check                         |
| ----------------- | ----------------------------- |
| Feature question  | README.md                     |
| How to use        | QUICK_START.md                |
| Code issue        | PROJECT_STRUCTURE.md          |
| Setup problem     | COMPLETE_SETUP.md             |
| Visual help       | VISUAL_GUIDE.md               |
| Design philosophy | README.md → Design Philosophy |

---

## 🎉 YOU HAVE

✅ Complete React app  
✅ Production build  
✅ PWA ready  
✅ 5 categories  
✅ Daily system  
✅ Export backup  
✅ Full docs  
✅ iPad support

**No backend needed. No cost. No coding required to use.**

---

## 🚀 NEXT STEP

```bash
cd /Users/radhwanakamal/Documents/Obsidian\ Vault/2026/self/distraction-board && npm run dev
```

Then visit the URL shown. ✨

---

**Print this page or bookmark it!**
Keep it handy for quick reference.

Made with ❤️ for focus.
