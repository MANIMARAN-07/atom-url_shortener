const https = require('http');

/**
 * Lookup country from IP address using ip-api.com (free tier).
 * Falls back to 'Unknown' on any error to avoid blocking the redirect flow.
 */
const lookupCountry = async (ip) => {
  // Skip lookup for localhost / private IPs
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'Localhost';
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country`);
    const data = await response.json();
    return data.status === 'success' ? data.country : 'Unknown';
  } catch {
    return 'Unknown';
  }
};

module.exports = { lookupCountry };
