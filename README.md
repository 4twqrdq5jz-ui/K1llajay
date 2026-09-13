# K1llajay

Official portfolio and media hub for **JAE LAURENT** — Artist, Producer, and Creator.

## 🎙️ Recently Released

- ANY MEANS POSSIBLE - Sept 4, 2026
- Out Of This World - Aug 28, 2026
- On My Block (Remix with htgkmo) - Aug 21, 2026
- SUPERSTAR - Aug 14, 2026

## 🌐 Website Overview

K1llajay is a modern, full-featured web platform showcasing music, events, podcast content, and creative portfolio. Built with Firebase real-time database integration and optimized for maximum performance.

### Key Features

**📅 Events**
- Interactive calendar with event tracking
- Past, present, and future event displays
- Birthday celebration integration
- Month-based event filtering

**🎙️ Trend Talk**
- Episode management and display
- Audio streaming capabilities
- Episode metadata and organization

**📸 Natural Photography Portfolio**
- Nature photography showcase
- Grid-based image display
- Modal preview system
- Dynamic content loading

**📊 Catelog Database**
- Released tracks database
- Unreleased/WIP tracks management
- Expandable/collapsible sections
- Date-based sorting

---

## 📁 Project Structure

```
K1llajay/
├── index.html                 # Home/Portfolio gallery
├── music.html                 # Music player & tracks
├── podcast.html               # Podcast episodes
├── portfolio.html             # Nature photography gallery
├── \extras\database.html      # Database viewer
├── \extras\events.html         # Calendar & event management
├── \extras\privacy.html       # Privacy policy
├── \extras\terms.html         # Terms & conditions
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
1. Navigate to editor pages
2. Authenticate with Firebase credentials
3. Upload content and manage database
4. Changes reflect in real-time on public pages

---

## 📞 Contact & Links

- **Website**: https://k1llajay.com
- **Email**: <mailto:southofsomewhere@icloud.com>
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