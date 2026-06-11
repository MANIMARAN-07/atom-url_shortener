import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Click, ClickSchema } from './schemas/click.schema';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Click.name, schema: ClickSchema }]),
    UrlsModule
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}
