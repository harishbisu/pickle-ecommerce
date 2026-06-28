import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { appSettings, promotionalVisits } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SettingsService {
  async getAll() {
    return await db.select().from(appSettings).orderBy(appSettings.settingKey);
  }

  async getSetting(key: string) {
    const result = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.settingKey, key))
      .limit(1);
    return result[0]?.settingValue ?? null;
  }

  async setSetting(key: string, value: string) {
    const existing = await this.getSetting(key);
    if (existing !== null) {
      const result = await db
        .update(appSettings)
        .set({ settingValue: value })
        .where(eq(appSettings.settingKey, key))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(appSettings)
        .values({ settingKey: key, settingValue: value })
        .returning();
      return result[0];
    }
  }

  async createPromotionalUrl(utmSource: string) {
    const url = `?utmmedia=${utmSource}`;
    // check existing
    const existing = await db.select().from(promotionalVisits).where(eq(promotionalVisits.utmSource, utmSource)).limit(1);
    if (!existing.length) {
      await db.insert(promotionalVisits).values({
        utmSource,
        url,
      });
    }
    return { url, utmSource };
  }

  async getPromotionalVisits() {
    return await db.select().from(promotionalVisits).orderBy(promotionalVisits.createdAt);
  }

  async trackVisit(utmSource: string) {
    const existing = await db.select().from(promotionalVisits).where(eq(promotionalVisits.utmSource, utmSource)).limit(1);
    if (existing.length) {
      await db.update(promotionalVisits).set({ visitCount: existing[0].visitCount + 1 }).where(eq(promotionalVisits.utmSource, utmSource));
    } else {
      await db.insert(promotionalVisits).values({ utmSource, visitCount: 1, url: `?utmmedia=${utmSource}` });
    }
  }
}
