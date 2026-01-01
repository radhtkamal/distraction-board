# Distraction Board

A Progressive Web App (PWA) to capture intrusive thoughts during work and review them outside work hours. Organize your distractions by life aspect to reduce mental load and increase focus.

## Features

✨ **Key Features:**

- 📱 **PWA** - Install on your home screen (iPad, phone, desktop)
- 📅 **Daily Entries** - Automatically creates new entries each day
- 🔄 **Full History** - Access past entries anytime by selecting any date
- 💾 **Local Storage** - All data stored in browser (free, no backend needed)
- 📥 **Export/Backup** - Download your complete history as JSON
- 🔌 **Offline Support** - Works without internet connection
- 🎨 **Beautiful Design** - Clean, distraction-free interface

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Storage:** Browser localStorage
- **PWA:** Service Worker + Manifest

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm

### Local Development

1. **Install dependencies:**

```bash
npm install
```

2. **Start development server:**

```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

3. **Build for production:**

```bash
npm run build
```

## How to Use

### During Work

When an intrusive thought appears:

1. Click "Add thought" in the relevant category
2. Type 1-2 sentences capturing the thought
3. Press Enter or click "Capture"
4. Immediately return to work

### After Work

Review your board daily:

1. Select the date (defaults to today)
2. Review each category
3. For each item: decide if it needs action, needs processing, or can let go
4. Delete or clear categories as needed

### Install on iPad

1. Open Safari and go to your app URL (or `localhost:5173` if local)
2. Tap the **Share** button at the bottom
3. Select **"Add to Home Screen"**
4. Name it "Distraction Board"
5. Tap **"Add"**

Now you have an app icon on your home screen that opens like a native app!

### Categories

- ❤️ **Relationships / Social** - Social concerns, relationship thoughts
- 📚 **School / Learning** - Academic or learning-related worries
- 💼 **Work / Career** - Job/career-related thoughts
- 🧠 **Emotional / Mental** - Emotional states, mental health concerns
- 🏠 **Life Admin** - Bills, tasks, logistics, administrative thoughts

## Data Management

### Storage

- All data is stored in browser's **localStorage** (free, no limits for typical use)
- Data persists across browser sessions
- Each date gets its own entry set

### Export

- Click the **"Export"** button anytime to download all your data as a JSON file
- Use this as a backup or to analyze your thought patterns

### Privacy

- **No cloud sync** - Your data stays on your device
- **No tracking** - No analytics or telemetry
- **No accounts** - No login required

## Design Philosophy

This tool is built on a specific psychology principle:

> Your mind doesn't struggle because it's chaotic, but because it tracks multiple life domains simultaneously and doesn't trust they're being held anywhere.

A categorized board tells your brain:

- "Every part of my life has a place"
- "Nothing will be lost"
- This reduces interruptions and improves focus

### The Rules That Matter

✅ **Capture = relief**
❌ **Reviewing during work = sabotage**

- Only add entries during work
- Review once daily outside work
- Trust the system

## Tips for Best Results

1. **Keep entries short** - 1-2 sentences max
2. **Be specific** - "Uncertainty about reply tone" not "Work stuff"
3. **Capture quickly** - 15-30 seconds per entry
4. **Review consistently** - Set a specific time daily
5. **Trust the process** - The system works if you use it correctly

## Keyboard Shortcuts

- **Enter** - Save an entry while typing
- **Escape** - Close the input field

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Safari (including iOS/iPad)
- ✅ Firefox
- ✅ Opera

## Troubleshooting

### Data not saving?

- Check if localStorage is enabled in your browser
- Try exporting data to backup before clearing browser data

### PWA not installing?

- Make sure you're using HTTPS (if deployed online)
- Use Safari on iPad or Chrome on Android
- Check browser privacy settings

### Service Worker issues?

- Clear browser cache (Settings → Clear Browsing Data)
- Uninstall and reinstall the PWA

## License

MIT License - Feel free to use, modify, and share

---

**Remember:** The goal is relief and focus, not perfection. Trust the system.
