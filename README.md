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

The application includes an admin interface for non-technical users to edit the configuration.

### Accessing the Admin Interface

Visit `/admin` or `/admin.html` on your deployed application.

### Initial Setup

1. **Set Admin Password**: Before deploying, set the `ADMIN_PASSWORD` environment variable in Vercel:
   ```bash
   vercel env add ADMIN_PASSWORD
   ```
   Or use the Vercel dashboard: Project Settings → Environment Variables

2. **Default Password**: If not set, the default password is `admin123` (for testing only)

### Using the Admin Interface

1. **Login**: Enter your admin password to access the configuration editor

2. **Edit Configuration**: For each mantra, you can configure:
   - **Mantra Name**: Display name in the dropdown
   - **Syllables**: Add or remove syllables using the tag interface
   - **TAM Image Path**: Path to the central TAM character image
   - **Audio File Path**: Path to the audio file
   - **TAM Color**: Color tint for the TAM character (hex color picker)
   - **TAM Outline Color**: Outline color for the TAM character (set to #000000 for no outline)
   - **Syllable Fill Color**: Fill color for syllable text
   - **Syllable Outline Color**: Outline color for syllable text
   - **Syllable Outline Width**: Width of the syllable outline (0.01 - 1.0)
   - **Start Index**: Which syllable should face the camera initially
   - **Background Gradient**: JSON configuration for the background gradient

3. **Save Changes**: Click "Save All Changes" to save the configuration
   - Changes are saved to `mantras.json`
   - Reload the main application to see the changes

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

### API Endpoint

The admin interface uses a serverless API endpoint at `/api/config`:
- **GET**: Fetch current configuration (no auth required)
- **POST**: Update configuration (requires password)

### Security Notes

- Only one concurrent user is expected
- Password is stored in environment variables
- Session is stored in browser sessionStorage
- For production use, consider implementing more robust authentication

### Deployment

The application is configured for Vercel deployment with the included `vercel.json` file:
- Serverless API functions are automatically deployed
- Admin route is properly configured
- Environment variables are securely stored
