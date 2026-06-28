import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SetSettingDto } from './settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** Public endpoint — get a single setting by key */
  @Get(':key')
  async getSetting(@Param('key') key: string) {
    const value = await this.settingsService.getSetting(key);
    return { key, value };
  }

  /** Admin endpoint — get ALL settings as an array */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  /** Admin endpoint — upsert a setting */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  async setSetting(@Body() body: SetSettingDto) {
    return this.settingsService.setSetting(body.key, body.value);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('promotions')
  async createPromotion(@Body('utmSource') utmSource: string) {
    return this.settingsService.createPromotionalUrl(utmSource);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('promotions/visits')
  async getPromotions() {
    return this.settingsService.getPromotionalVisits();
  }

  @Post('promotions/track')
  async trackPromotion(@Body('utmSource') utmSource: string) {
    await this.settingsService.trackVisit(utmSource);
    return { success: true };
  }
}
