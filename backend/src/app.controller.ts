import { Controller, Get, Param, Res, Req, NotFoundException } from '@nestjs/common';
import { UrlsService } from './urls/urls.service';
import { AnalyticsService } from './analytics/analytics.service';

@Controller()
export class AppController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly analyticsService: AnalyticsService
  ) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Req() req: any, @Res() res: any) {
    try {
      const url = await this.urlsService.findByShortCode(code);
      
      // Async tracking (fire and forget)
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      const referrer = req.headers['referer'] || '';
      
      this.analyticsService.trackClickAsync(code, ip as string, userAgent, referrer);
      
      return res.redirect(302, url.originalUrl);
    } catch (err) {
      throw new NotFoundException('URL not found');
    }
  }
}

