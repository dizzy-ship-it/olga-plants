# 🌿 Olga's Plant App — Build Notes

## Overview
A mobile-first Progressive Web App (PWA) for tracking Olga's houseplant collection and wishlist. Built as a single HTML file with no dependencies or backend — all data is embedded or stored in localStorage.

**Owner:** Olga Castronova  
**Built by:** Dizzy 🌀  
**First built:** 2026-03-08

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire app — HTML, CSS, and JS in one file |
| `manifest.json` | PWA manifest — enables "Add to Home Screen" on Android/iOS |
| `sw.js` | Service worker — caches the app for offline use |
| `icon.png` | 192×192 app icon (solid green, generated via Python) |
| `icon-512.png` | 512×512 app icon |
| `server.js` | Simple Node.js HTTP server to serve the app |

---

## Hosting

### Current Setup
- **App server:** Node.js (`server.js`) running on port 8080 as a systemd user service (`plants-app.service`)
- **Tunnel:** `localhost.run` SSH tunnel exposing port 8080 via HTTPS, managed as a systemd user service (`plants-tunnel.service`)
- **Limitation:** The tunnel URL changes on reconnect (anonymous user). URL is logged in `journalctl --user -u plants-tunnel`

### Permanent Options (on Paul's todo list)
- **Option A:** Open port 8080 in Hetzner Cloud Console → Firewalls → TCP inbound → port 8080. Direct URL: `http://46.225.229.81:8080/plants/`
- **Option B:** GitHub Pages — run `gh auth login` then deploy `plants-app/` to a GitHub Pages repo. Free, HTTPS, permanent URL.

### Systemd Services
```bash
# Check status
systemctl --user status plants-app
systemctl --user status plants-tunnel

# Restart
systemctl --user restart plants-app
systemctl --user restart plants-tunnel

# Get current tunnel URL
journalctl --user -u plants-tunnel --no-pager -n 100 | grep "lhr.life" | tail -1
```

### Rebuild / Redeploy
```bash
# Services are enabled (auto-start on boot via loginctl linger)
# To redeploy after editing index.html:
systemctl --user restart plants-app
# No need to restart tunnel unless URL needs refreshing
```

---

## App Features

### Tabs
- **🏠 My Collection** — plants Olga currently owns, with full care instructions
- **💚 Wishlist** — plants she wants, organised by type with filter chips

### Collection Tab
- Stats bar (plant count + wishlist count)
- Search bar (filters by name or scientific name)
- Plant cards with: emoji icon, common name, scientific name, type badge
- Tap any card to expand care details: ☀️ Light, 💧 Water, 🌫️ Humidity, 📝 Notes

### Wishlist Tab
- Filter chips by plant type (All, Hoya, Peperomia, etc.)
- Search bar
- Plant cards with: type badge, care level badge (colour-coded), 🪴 Hanging badge if applicable
- Tap to expand notes

### Add Plant (＋ FAB)
- Floating action button (bottom right) opens a slide-up modal
- Choose destination: **To Collection** or **To Wishlist**
- Fields:
  - Emoji icon picker (15 options)
  - Plant name (required)
  - Scientific name
  - Type (dropdown)
  - Care level (dropdown)
  - Hanging toggle (Wishlist only)
  - Light / Water / Humidity (Collection only)
  - Notes
- Saved to **localStorage** — persists across sessions on the same device
- Custom plants show a **✕ Remove** button

### PWA / Install
- Valid `manifest.json` with correct `start_url: "/"`
- Service worker (`sw.js`) caches app files for offline use
- On Android Chrome: three-dot menu → "Install app" or automatic install banner
- Theme colour: `#3d7a4f` (botanical green)

---

## Plant Data

### Built-in Collection (2 plants)
- White Bird of Paradise *(Strelitzia nicolai)*
- Jenny Craig Dieffenbachia *(Dieffenbachia 'Jenny Craig')*

### Built-in Wishlist (17 plants)
Hoya compacta, Peperomia polybotrya, Peperomia prostrata, Pilea peperomioides, Rhaphidophora tetrasperma, Philodendron gloriosum, Philodendron melanochrysum, Syngonium 'Strawberry Ice', Syngonium 'Albo Variegatum', Syngonium 'Milk Confetti', Curio rowleyanus, Sedum morganianum, Calathea musaica, Begonia maculata, Scindapsus pictus 'Exotica', Tradescantia nanouk, Beaucarnea recurvata, Epiphyllum anguliger

### Adding/Updating Built-in Data
Edit the `collection` and `wishlist` arrays in `index.html` directly. Custom (user-added) plants are stored in localStorage separately and merged at runtime — they won't be lost when the built-in data is updated.

---

## Design

- **Font:** DM Sans (Google Fonts)
- **Primary colour:** `#3d7a4f` (botanical green)
- **Background:** `#faf9f6` (warm cream)
- **Cards:** white with subtle shadow, 16px border radius
- **Care level badge colours:** green (easy), yellow (medium), red (hard), purple (hanging)
- **Mobile-first:** designed for 375px+ screens

---

## Tech Stack
- Pure HTML/CSS/JS — no frameworks, no build step
- localStorage for user-added plants
- Node.js built-in `http` module for serving
- SSH tunnel via localhost.run for public HTTPS access

---

## Companion Files
- `olga-plants.md` — markdown version of the plant list (Dizzy's source of truth)
- `olga-plants-sheet.py` / `olga-plants-sheet.sh` — scripts to populate the Google Sheet
- Google Sheet ID: `1uL-ZzA28JSWt7emjag7873nbbDwwTQCBzXBbDaopYYc`
