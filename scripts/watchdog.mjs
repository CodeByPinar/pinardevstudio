import { spawn } from 'child_process';

const HEALTHCHECK_URL = process.env.HEALTHCHECK_URL || 'http://127.0.0.1:5000/api/projects';
const HEALTHCHECK_INTERVAL_MS = Number(process.env.HEALTHCHECK_INTERVAL_MS || 300000);
const HEALTHCHECK_TIMEOUT_MS = Number(process.env.HEALTHCHECK_TIMEOUT_MS || 8000);
const HEALTHCHECK_FAIL_THRESHOLD = Number(process.env.HEALTHCHECK_FAIL_THRESHOLD || 2);
const PM2_TARGET_APP = process.env.PM2_TARGET_APP || 'pinar-backend';

let consecutiveFailures = 0;

const restartTargetApp = () => {
  return new Promise((resolve, reject) => {
    const pm2Binary = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(pm2Binary, ['pm2', 'restart', PM2_TARGET_APP], { stdio: 'pipe' });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `pm2 restart exited with code ${code}`));
      }
    });
  });
};

const checkHealth = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT_MS);

  try {
    const response = await fetch(HEALTHCHECK_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    consecutiveFailures = 0;
    console.log(`[watchdog] Healthy: ${HEALTHCHECK_URL} -> ${response.status}`);
  } catch (error) {
    consecutiveFailures += 1;
    console.error(`[watchdog] Health check failed (${consecutiveFailures}/${HEALTHCHECK_FAIL_THRESHOLD}): ${error.message}`);

    if (consecutiveFailures >= HEALTHCHECK_FAIL_THRESHOLD) {
      console.warn(`[watchdog] Restarting ${PM2_TARGET_APP} due to repeated failures...`);
      try {
        await restartTargetApp();
        console.log(`[watchdog] Restart command sent to ${PM2_TARGET_APP}.`);
      } catch (restartError) {
        console.error(`[watchdog] Failed to restart ${PM2_TARGET_APP}: ${restartError.message}`);
      } finally {
        consecutiveFailures = 0;
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

console.log('[watchdog] Started with settings:', {
  HEALTHCHECK_URL,
  HEALTHCHECK_INTERVAL_MS,
  HEALTHCHECK_TIMEOUT_MS,
  HEALTHCHECK_FAIL_THRESHOLD,
  PM2_TARGET_APP,
});

await checkHealth();
setInterval(checkHealth, HEALTHCHECK_INTERVAL_MS);
