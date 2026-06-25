import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  /** Admin endpoint — upsert a setting */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async setSetting(@Body() body: { key: string; value: string }) {
    return this.settingsService.setSetting(body.key, body.value);
  }
}
