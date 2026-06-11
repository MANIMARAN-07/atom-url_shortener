import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get(':urlId')
  async getUrlAnalytics(@Request() req: any, @Param('urlId') urlId: string) {
    return this.analyticsService.getAnalyticsForUrl(req.user.userId, urlId);
  }
}
