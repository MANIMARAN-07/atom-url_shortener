const UAParser = require('ua-parser-js');
const Click = require('../models/Click');
const { lookupCountry } = require('./geoService');

/**
 * Record a click event for a given URL. Parses user-agent for device/browser
 * info and does a non-blocking geo lookup.
 */
const recordClick = async (urlId, req) => {
  const parser = new UAParser(req.headers['user-agent']);
  const deviceInfo = parser.getDevice();
  const browserInfo = parser.getBrowser();

  // Normalize device type
  let device = 'desktop';
  if (deviceInfo.type === 'mobile') device = 'mobile';
  else if (deviceInfo.type === 'tablet') device = 'tablet';

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';

  // Fire geo lookup in background — don't block the redirect
  const countryPromise = lookupCountry(ip);

  const referrer = req.headers.referer || req.headers.referrer || 'Direct';
  const country = await countryPromise;

  const click = await Click.create({
    urlId,
    ip,
    country,
    device,
    browser: browserInfo.name || 'Unknown',
    referrer,
  });

  return click;
};

module.exports = { recordClick };
