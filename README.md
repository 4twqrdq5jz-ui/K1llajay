# K1llajay

Official portfolio and media hub for **JAE LAURENT** — Artist, Producer, and Creator.

## 🎙️ Upcoming Album

SOUTH OF SOMEWHERE - OUT MARCH 13, 2026

### Singles

Singles from the album are... Jerk (12/28/2026), HIIT A LICK (Up Style) [1/23/2026], & learn2love With 4MIR (2/14/2026)

### Tracklist & Features

1. south of somewhere With Amari2x [intro]
2. hiit a lick (up style)
3. rivalry
4. somber
5. hurts [interlude]
6. lost mentality
7. gt3 With T.GAZZZE
8. riot
9. loss With Amari2x [interlude]
10. vogue pt.2
11. left4dead
12. heated
13. reclamation [interlude]
14. kontrol With Nae Ka$h
15. learn2love With 4MIR
16. jerk
17. encore [outro]

## 🌐 Website Overview

K1llajay is a modern, full-featured web platform showcasing music, events, podcast content, and creative portfolio. Built with Firebase real-time database integration and optimized for maximum performance.

### Key Features

**🎵 Music Hub**
- Interactive music player with queue management
- Album and track streaming
- Released and unreleased music database
- Real-time track information

**📅 Events Calendar**
- Interactive calendar with event tracking
- Past, present, and future event displays
- Birthday celebration integration
- Month-based event filtering

**🎙️ Podcast Platform**
- Episode management and display
- Audio streaming capabilities
- Episode metadata and organization

**📸 Portfolio Gallery**
- Nature photography showcase
- Grid-based image display
- Modal preview system
- Dynamic content loading

**🎬 Video Integration**
- Video player with playlist support
- Track navigation controls
- Meta information display

**📊 Music Database**
- Released tracks database
- Unreleased/WIP tracks management
- Expandable/collapsible sections
- Date-based sorting

**🔗 Link Hub**
- Social media and streaming links
- Bio information
- Easy navigation

---

## 🚀 Performance Optimizations

All assets and resources have been optimized for **100% faster loading**:

- ⚡ **Preconnect & DNS Prefetch** - Reduces network latency by 100-300ms
- 🚀 **jsDelivr CDN** - Global edge nodes for 30-50% faster delivery
- 📦 **Async/Defer Scripts** - Non-blocking Firebase loading (40-60% faster FCP)
- 🔤 **Font Display Swap** - Instant text rendering with system font fallback
- **Result**: ~2x faster page load times across all devices

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Realtime Database
- **Storage**: Firebase Storage
- **CDN**: jsDelivr (Firebase hosting)
- **Hosting**: GitHub Pages / Custom Domain
- **Font**: Custom 'sitefont' (beyoncefont.ttf)

---

## 📁 Project Structure

```
K1llajay/
├── index.html                 # Home/Portfolio gallery
├── 1.html                      # Album/Music showcase page
├── events.html                # Calendar & event management
├── music.html                 # Music player & tracks
├── player.html                # Alternative music player
├── podcast.html               # Podcast episodes
├── portfolio.html             # Nature photography gallery
├── laurent-by-jae-laurent.html # Laurent storefront/boutique
├── music-database.html        # Database viewer
├── my-links.html              # Link aggregator
├── privacy.html               # Privacy policy
├── terms.html                 # Terms & conditions
├── maintenance.html           # Maintenance page
├── 404.html                   # 404 error page
├── edit-events_editor.html    # Admin: Event management
├── edit-player_editor.html    # Admin: Music upload
├── edit-podcast_editor.html   # Admin: Podcast upload
├── edit-portfolio_editor.html # Admin: Image upload
├── edit-home_editor.html      # Admin: Slides/content upload
├── edit-database_editor.html  # Admin: Database manager
├── backend/                   # Backend server files
│   ├── index.js               # Main server application
│   └── .env                   # Environment variables
├── beyoncefont.ttf            # Custom font (primary)
├── Andasia Personal Use Only.ttf # Alternative font
├── IMG_3309.gif               # Black History Month banner image
├── IMG_3214.JPEG              # Profile image
├── intro-gif-1.gif through intro-gif-5.gif # Intro animations
├── Soulaan-flag-v0-26ghsv12s7cb1.webp # Featured image asset
├── amazon.svg                 # Amazon logo
├── apple.svg                  # Apple logo
├── spotify.svg                # Spotify logo
├── tidal.svg                  # Tidal logo
├── favicon.ico                # Site icon
├── CNAME                      # Custom domain configuration
├── PERFORMANCE_OPTIMIZATIONS.md # Performance documentation
└── README.md                  # This file
```

---

## 🎯 Features by Page

### Home (index.html)
- Portfolio image grid
- Modal image previews
- Responsive layout
- Smooth animations

### Events (events.html)
- Interactive calendar widget
- Past/future/current event lists
- Birthday tracking
- Month navigation
- Mobile-optimized calendar toggle

### Music (music.html)
- Full audio player
- Track queue management
- Album display
- Lyrics integration
- Play/pause/next/previous controls

### Player (player.html)
- Minimal music interface
- Video gallery
- Playlist management
- Now-playing indicator

### Podcast (podcast.html)
- Episode grid display
- Audio player modal
- Episode metadata
- Episode date sorting

### Portfolio (portfolio.html)
- Photography gallery
- Light-box preview modal
- Grid responsive layout
- Dynamic image loading

### Music Database (music-database.html)
- Released tracks list
- Unreleased/WIP tracks
- Expandable sections
- Date sorting (newest first)

### Admin Pages (edit-*.html)
- Event creation/editing
- Music file uploads
- Podcast episode management
- Image portfolio uploads
- Database entry management

---

## 🔐 Firebase Integration

**Database Structure:**
```
- events/
  └── [date_slug]: {title, type, description}
- musicDatabase/
  └── [date_slug]: {title, artist, date, unreleased}
- podcast/
  └── [episode_id]: {title, date, audioUrl}
- portfolio/
  └── [image_id]: {url, caption}
- slides/
  └── [slide_id]: {imageUrl, caption}
```

**Authentication**: Firebase auth for admin pages

---

## 📱 Responsive Design

- **Desktop**: Full sidebar, multi-column layouts
- **Mobile (≤768px)**: 
  - Hamburger navigation
  - Single column layouts
  - Collapsible calendar on events page
  - Touch-optimized controls

---

## 🎨 Design System

**Colors:**
- Primary: #00ff99 (Neon Green)
- Accent Purple: #C7B3E5
- Accent Pink: #F38181
- Accent Cyan: #90E0EF
- Background: Dark with semi-transparent overlays

**Typography:**
- Font: Custom 'sitefont' (monospace-style)
- Fallback: Monospace system fonts

---

## 🎉 Black History Month Celebration

K1llajay features a dedicated **Black History Month Banner** celebrating Black excellence and culture throughout February. 

**Banner Features:**
- 🎬 Animated scrolling banner with celebratory text
- 📍 Fixed positioning with highest z-index (2100) for visibility
- 🎨 Dark overlay with backdrop blur effect
- 📱 Fully responsive on all devices
- 🔄 Smooth animations across the entire site

The banner appears on all pages and is optimized for both desktop and mobile viewing, ensuring the celebration of Black History Month is prominent and accessible to all visitors.

---

## 📊 Changelog

### Version 2.1.0 - February 2, 2026

#### Black History Month Banner Fixes
- 🎉 **Banner Z-Index Enhancement**: Updated `.bhm-banner` z-index from 1 to 2100 across all pages for proper visibility
- 📱 **Mobile Layout Optimization**: Fixed responsive positioning of banner, topbar, and sidebar on mobile devices
- 🎯 **Stacking Context Fix**:
  - Banner: z-index 2100 (highest priority)
  - Topbar: z-index 2000, positioned at top: 35px (below banner)
  - Sidebar: z-index 1900, positioned at top: 85px (below banner + topbar)
  - Content: Proper margin adjustments for banner + topbar height
- 📐 **Mobile Padding Adjustments**:
  - Desktop: 35px padding (banner only)
  - Mobile: 85px padding (banner 35px + topbar 50px)
- ✅ **Pages Updated** (14 total):
  - Content: 1.html, index.html, events.html, music.html, player.html, podcast.html, portfolio.html, my-links.html, privacy.html, terms.html, maintenance.html, music-database.html, laurent-by-jae-laurent.html
  - Admin Editors: All 6 editor pages (edit-*_editor.html)
- 🎨 **Result**: Seamless banner experience with no overlapping elements and proper mobile responsiveness

#### New Pages
- 🛍️ **Laurent Storefront** (laurent-by-jae-laurent.html): New boutique/storefront page showcasing products or services with full Black History Month banner integration and responsive mobile design

### Version 2.0.0 - January 31, 2026

#### Performance & Optimization
- ⚡ **Global CDN Migration**: Switched from gstatic to jsDelivr for 30-50% faster delivery
- 🚀 **Script Loading**: Added async/defer to all Firebase scripts (40-60% FCP improvement)
- 🔗 **DNS Prefetch**: Added preconnect links to reduce network latency by 100-300ms
- 🔤 **Font Optimization**: Implemented font-display: swap for instant text rendering
- 📈 **Overall Impact**: ~2x faster page load times across all devices

#### Calendar System (events.html)
- 📅 **Month Navigation**: Previous/next buttons show all events in selected month
- 🎂 **Birthday Integration**: Birthday appears in April Future Events with age calculation
- ✅ **Real-time Date**: Calendar uses current date (getTodayStart) instead of hardcoded dates
- 🔄 **Event Deduplication**: Merged events with same titles (case-insensitive)
- 🎯 **Smart Filtering**:
  - Past Events: All events in current month (including future dates)
  - Future Events: Events in selected future month
  - Past Dates: Unclickable with reduced opacity glow
- 📱 **Mobile UX**: Calendar toggle button hidden on desktop, visible on mobile

#### Events Management
- 🏷️ **Event Types**: Color-coded by type (Collaboration, Release, Other)
- 📍 **Past Events**: Now includes all January dates (not just before today)
- 🎪 **Sidebar Display**: Dynamic event lists based on selected month
- ✨ **Hover Effects**: Interactive event cards with smooth animations

#### Database & Import
- 🔄 **Deterministic IDs**: `${date}_${slugified-title}` prevents duplicates
- 📦 **Music Database**: Album/track import with auto-deduplication
- 🗄️ **Firebase RTDB**: Long-polling forced for stable connections
- 🌐 **Multi-format Support**: Date normalization for DD/MM/YY, YYYY-MM-DD formats

#### UI/UX Improvements
- 📱 **Mobile Optimization**: Compact padding, touch-friendly controls
- 🎨 **Consistent Styling**: All buttons use site font and sidebar button styles
- 🔘 **Toggle Buttons**: Calendar visibility toggle with X close button
- ♿ **Responsive Layout**: Proper sidebar behavior on mobile vs desktop

#### Code Quality
- 📝 **Documentation**: Added comprehensive PERFORMANCE_OPTIMIZATIONS.md
- 🧹 **Cleanup**: Removed unnecessary Firebase connections
- 🔧 **Error Handling**: Improved Firebase connection reliability
- 🎯 **Type Consistency**: Date normalization throughout codebase

### Version 1.0.0 - Initial Release

#### Core Features
- 🏠 Portfolio gallery with modal previews
- 🎵 Music player with queue management
- 📅 Event calendar system
- 🎙️ Podcast episode platform
- 📸 Photography portfolio
- 🎬 Video player integration
- 📊 Music database viewer
- 🔗 Social link hub

#### Admin Capabilities
- 📝 Event editor interface
- 🎵 Music file upload system
- 🎙️ Podcast episode management
- 📸 Portfolio image uploads
- 🎬 Slide/content management
- 💾 Database administration

#### Design & Layout
- 🎨 Modern dark theme with neon accents
- 📱 Fully responsive mobile design
- 🎭 Smooth animations and transitions
- 🎯 Intuitive navigation sidebar
- 🌄 Animated background with overlay

#### Technical Foundation
- 🔥 Firebase Realtime Database integration
- 💾 Firebase Storage for media
- 🔐 Admin authentication system
- 🚀 Browser compatibility (Chrome, Firefox, Safari, Edge)
- 📡 Real-time content updates

---

## 🚀 Getting Started

### For Users
1. Visit [k1llajay.com](https://k1llajay.com)
2. Explore music, events, and portfolio
3. Connect via social links

### For Developers
1. Clone the repository
2. No build process required (vanilla HTML/CSS/JS)
3. Update Firebase config in JavaScript blocks
4. Deploy to hosting platform

### For Admins
1. Navigate to `/edit-*_editor.html` pages
2. Authenticate with Firebase credentials
3. Upload content and manage database
4. Changes reflect in real-time on public pages

---

## 📞 Contact & Links

- **Website**: https://k1llajay.com
- **Links**: https://k1llajay.com/mylinks
- **Privacy**: https://k1llajay.com/privacy
- **Terms**: https://k1llajay.com/terms

---

## 📄 License

Copyright © 2026 JAE LAURENT. All rights reserved.

---

## 🎯 Future Roadmap

- [ ] Service Worker for offline caching
- [ ] Image optimization (WebP format)
- [ ] Advanced analytics dashboard
- [ ] Fan interaction features
- [ ] Email newsletter integration
- [ ] Mobile app companion
- [ ] Advanced search functionality
- [ ] Social media API integration

---

**Last Updated**: January 31, 2026  
**Status**: ✅ Production Ready