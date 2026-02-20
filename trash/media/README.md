# Media Assets

This folder contains all media files needed for the UI components.

## Contents

### Logos
- `ikshan-logo.svg` - Main brand logo
- `ikshan logo.svg` - Alternative logo version
- `logo iskan 5.svg` - Logo variant 5
- `logo iskan-black (1).svg` - Black logo variant

### Images
- `texture-753521.png` - Background texture
- `Untitled_design__2_-removebg-preview.png` - Design asset
- `vite.svg` - Vite framework logo

### Videos
- `space.mp4` - Space background video

## Folder Structure
```
media/
├── logos/          # Brand logos and icons
├── images/         # Static images and textures
├── videos/         # Video files
├── icons/          # UI icons (if any custom)
└── README.md       # This file
```

## Usage Guidelines

### In React Components
```jsx
// Import from media folder
import logo from '../../media/logos/ikshan-logo.svg';

// Or reference from public
<img src="/media/logos/ikshan-logo.svg" alt="Ikshan Logo" />
```

### Naming Conventions
- Use lowercase with hyphens: `my-image-name.png`
- Include size suffix for variants: `logo-small.svg`, `logo-large.svg`
- Use descriptive names: `hero-background.jpg` not `img1.jpg`

## Adding New Media
1. Optimize images before adding (compress, resize)
2. Use SVG for logos and icons when possible
3. Keep video files under 10MB
4. Update this README with new asset descriptions
