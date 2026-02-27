# HACK_OS v1.0 🖥️☠️

> A cyberpunk Matrix-themed personal portfolio OS — inspired by MitchIvin XP

## 🟢 Features

- **ACCESS GRANTED boot sequence** — fake BIOS POST → system checks → green flash
- **Matrix rain desktop** — canvas-based falling characters
- **5 draggable/resizable windows** — About, Resume, Projects, Contact, Terminal
- **Interactive terminal** — 20+ commands, tab-complete, command history, easter eggs
- **Authentic OS chrome** — taskbar, start menu, clock, minimize/maximize/close
- **CRT scanline overlay** — for that phosphor glow aesthetic
- **Shutdown sequence** — `triggerShutdown()` via start menu

## 📁 File Structure

```
hackos/
├── index.html          # Main shell + all app templates
├── css/
│   └── style.css       # Full cyberpunk theme
└── js/
    ├── boot.js         # Boot sequence animation
    ├── matrix.js       # Canvas matrix rain
    ├── os.js           # Window manager, taskbar, drag/resize
    └── terminal.js     # Interactive terminal + commands
```

## 🚀 Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to **Settings → Pages**
3. Source: **Deploy from branch → main / root**
4. Your site will be live at `https://yourusername.github.io/reponame`

## ✏️ Customization Checklist

### Personal Info
- `index.html` → search for `YOUR_NAME`, `yourhandle`, `your@email.com` → replace with your info
- Update the About Me bio section
- Update skills list in the About template

### Resume
- Fill in your actual experience, education, certifications in `#tpl-resume`

### Projects
- Update each `.project-card` with your real CTF writeups / tools / research
- Change `href="#"` links to real URLs
- Add/remove cards as needed

### Contact
- Update all `href` links in `#tpl-contact`
- Add your real PGP public key

### Terminal
- Edit `terminal.js` → `cmdWhoami()` to return your info
- Edit `cmdContact()` with real links
- Add custom commands to the `COMMANDS` object

### Colors
In `css/style.css`, update `:root` variables:
```css
--green: #00FF41;      /* Main color — change for different phosphor */
--green-dim: #00B32C;  /* Dimmed version */
--green-dark: #003B00; /* Very dark tint for backgrounds */
```

## 🔧 Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | List all commands |
| `whoami` | Current user info |
| `ls [-la]` | List directory |
| `cd [dir]` | Change directory |
| `cat [file]` | Read file |
| `nmap [host]` | Fake port scan |
| `ping [host]` | Fake ping |
| `ifconfig` | Network interfaces |
| `uname -a` | System info |
| `skills` | Your skill set |
| `contact` | Contact info |
| `hack [target]` | 🤫 |
| `matrix` | 🐇 |
| `clear` / `ctrl+l` | Clear terminal |

## 📝 Notes

- No build tools required — pure HTML/CSS/JS
- Works on mobile (windows become full-screen, drag adapted)
- Fonts loaded from Google Fonts (`VT323` + `Share Tech Mono`)
- All app content lives in `<template>` tags in `index.html`
