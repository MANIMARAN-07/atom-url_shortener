import { Controller, Get, Param, Res, Req, NotFoundException, Inject, Next } from '@nestjs/common';
import type { NextFunction } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UrlsService } from './urls/urls.service';
import { AnalyticsService } from './analytics/analytics.service';

@Controller()
export class AppController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly analyticsService: AnalyticsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Req() req: any, @Res() res: any, @Next() next: NextFunction) {
    const frontendRoutes = ['dashboard', 'login', 'signup', 'analytics', 'assets'];
    if (frontendRoutes.includes(code)) {
      return next();
    }

    try {
      const cacheKey = `url:${code}`;
      let originalUrl = await this.cacheManager.get<string>(cacheKey);

      if (!originalUrl) {
        const url = await this.urlsService.findByShortCode(code);
        originalUrl = url.originalUrl;
        await this.cacheManager.set(cacheKey, originalUrl);
      }
      
      // Async tracking (fire and forget)
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      const referrer = req.headers['referer'] || '';
      
      this.analyticsService.trackClickAsync(code, ip as string, userAgent, referrer);
      
      return res.redirect(301, originalUrl);
    } catch (err) {
      throw new NotFoundException('URL not found');
    }
  }
}

