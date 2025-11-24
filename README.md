# Overview
Create a web app that works on mobile and desktop and shows a 3D scene:
- A glowing ball in the center
- Like a ring of saturn, text around the center. We will need a few different scenes, but one of them shows this text in syllables:
  - OM
  - TA
  - RE
  - TU
  - TA
  - RE
  - TU
  - RE
  - PRA
  - JNA
  - HRING
  - HRING
  - SVA
  - HA
- Each syllable should be spaced out evenly. We will have different numbers of syllables in different scenes.
- Scenes are referred to as "Schemas"

## Admin Interface

The application includes an admin interface for editing the configuration locally.

### Accessing the Admin Interface

1. Run the application locally.
2. Visit `/admin.html`.

### Using the Admin Interface

1. **Edit Configuration**: Make changes to mantras, colors, and schedules.
2. **Save to File**: Click “Save to mantras.json” to write directly to the existing file using the File System Access API (supported in Chromium browsers such as Chrome, Edge, Arc on desktop when served via `http://localhost` or `https://`).
3. **Fallback Download**: Use “Download JSON” if your browser does not support direct writes, then replace the `mantras.json` file manually.
4. **Deploy**: Commit and push your changes to deploy the updated configuration.

### Configuration Structure

The configuration is stored in `mantras.json`:

```json
{
  "mantras": [
    {
      "name": "Tara Vajra Sarasvati",
      "syllables": ["OM", "TA", "RE", ...],
      "audioFile": "audio/green-tara.mp3",
      "tamImage": "images/tam-sarasvati.png",
      "tamColor": "#ffffff",
      "tamOutlineColor": null,
      "syllableStyle": {
        "fill": "#ffffff",
        "outlineColor": "#000000",
        "outlineWidth": 0.02
      },
      "backgroundGradient": {
        "type": "radial",
        "colors": [
          { "color": "#f0e0ff", "position": 0 },
          { "color": "#e0f0ff", "position": 100 }
        ]
      },
      "startIndex": 0
    }
  ]
}
```

### Deployment

The application is a static site.

1. **Install dependencies** (optional, only for local dev tools):
   ```bash
   npm install
   ```

2. **Deploy**:
   Push to your git repository connected to Vercel (or any static host).

**How it works**:
- `mantras.json` is the single source of truth.
- The app loads configuration directly from this file.
- Edits are made locally and deployed via git.

