import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'mantras.json');

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
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      const config = JSON.parse(configData);
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

      // Write to file
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');

      return res.status(200).json({
        success: true,
        message: 'Configuration updated successfully'
      });
    } catch (error) {
      console.error('Error updating config:', error);
      return res.status(500).json({ error: 'Failed to update configuration' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
