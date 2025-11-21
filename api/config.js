import { put, head } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'mantras.json');
const BLOB_CONFIG_NAME = 'mantras-config.json';

// Helper to get default config from file
function getDefaultConfig() {
  const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
  return JSON.parse(configData);
}

// Helper to fetch config from Blob storage
async function getConfigFromBlob() {
  try {
    const blobUrl = process.env.BLOB_READ_WRITE_TOKEN
      ? `https://blob.vercel-storage.com/${BLOB_CONFIG_NAME}`
      : null;

    if (!blobUrl) {
      return null;
    }

    const response = await fetch(blobUrl);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.log('No blob config found, using default');
    return null;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch current config
  if (req.method === 'GET') {
    try {
      // Try to get config from Blob storage first
      let config = await getConfigFromBlob();

      // Fall back to default file if no blob config
      if (!config) {
        config = getDefaultConfig();
      }

      return res.status(200).json(config);
    } catch (error) {
      console.error('Error reading config:', error);
      return res.status(500).json({ error: 'Failed to read configuration' });
    }
  }

  // POST: Update config (requires password)
  if (req.method === 'POST') {
    try {
      const { password, config } = req.body;

      // Verify password
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      if (password !== adminPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Validate config structure
      if (!config || !config.mantras || !Array.isArray(config.mantras)) {
        return res.status(400).json({ error: 'Invalid config structure' });
      }

      // Check if Blob storage is configured
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return res.status(500).json({
          error: 'Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables.'
        });
      }

      // Save to Vercel Blob storage
      const blob = await put(BLOB_CONFIG_NAME, JSON.stringify(config, null, 2), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false
      });

      console.log('Config saved to blob:', blob.url);

      return res.status(200).json({
        success: true,
        message: 'Configuration updated successfully',
        blobUrl: blob.url
      });
    } catch (error) {
      console.error('Error updating config:', error);
      return res.status(500).json({
        error: 'Failed to update configuration: ' + error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
