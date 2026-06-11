import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Click, ClickDocument } from './schemas/click.schema';
import { UrlsService } from '../urls/urls.service';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Click.name) private clickModel: Model<ClickDocument>,
    private urlsService: UrlsService
  ) {}

  async trackClickAsync(shortCode: string, ip: string, userAgent: string, referrer: string) {
    try {
      const url = await this.urlsService.findByShortCode(shortCode);
      if (!url) return;

      const ipHash = crypto.createHash('sha256').update(ip || '').digest('hex');
      
      const click = new this.clickModel({
        urlId: url._id,
        ipHash,
        userAgent,
        referrer,
      });

      await click.save();
      
      // Increment total clicks asynchronously
      url.totalClicks += 1;
      await url.save();
    } catch (err) {
      console.error('Failed to track click', err);
    }
  }

  async getAnalyticsForUrl(userId: string, urlId: string) {
    // Basic verification that user owns this url
    const urls = await this.urlsService.findAllByUser(userId);
    const ownsUrl = urls.some(u => u._id.toString() === urlId);
    if (!ownsUrl) {
      throw new Error('Unauthorized');
    }

    const clicks = await this.clickModel.find({ urlId }).sort({ createdAt: 1 }).exec();
    return {
      totalClicks: clicks.length,
      clicks,
    };
  }
}
