import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises'; // Use fs.promises for async operations

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-T:]/g, '').slice(0, 14);
      const archiveName = `archive_${timestamp}.zip`;
      const archivesDir = path.join(process.cwd(), 'archives'); // Path to archives directory
      const archivePath = path.join(archivesDir, archiveName);
      const dataDir = path.join(process.cwd(), 'data'); // Path to data directory

      // Ensure the archives directory exists
      await fs.mkdir(archivesDir, { recursive: true });

      // Construct the zip command.  Important: handle spaces in filenames!
      const zipCommand = `zip -r "${archivePath}" "${dataDir}"`;

      // Execute the zip command
      const { stdout, stderr } = await execPromise(zipCommand);

      if (stderr) {
        console.error(`Zip command stderr: ${stderr}`);
        return res.status(500).json({ error: 'Archiving failed', details: stderr }); // Include details
      }

      console.log(`Zip command stdout: ${stdout}`);
      res.status(200).json({ message: 'Archiving successful', archiveName });

    } catch (error) {
      console.error('Error during archiving:', error);
      res.status(500).json({ error: 'Archiving failed', details: error.message }); // Include error details
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
