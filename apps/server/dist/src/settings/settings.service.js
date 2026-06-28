"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
let SettingsService = class SettingsService {
    async getAll() {
        return await db_1.db.select().from(schema_1.appSettings).orderBy(schema_1.appSettings.settingKey);
    }
    async getSetting(key) {
        const result = await db_1.db
            .select()
            .from(schema_1.appSettings)
            .where((0, drizzle_orm_1.eq)(schema_1.appSettings.settingKey, key))
            .limit(1);
        return result[0]?.settingValue ?? null;
    }
    async setSetting(key, value) {
        const existing = await this.getSetting(key);
        if (existing !== null) {
            const result = await db_1.db
                .update(schema_1.appSettings)
                .set({ settingValue: value })
                .where((0, drizzle_orm_1.eq)(schema_1.appSettings.settingKey, key))
                .returning();
            return result[0];
        }
        else {
            const result = await db_1.db
                .insert(schema_1.appSettings)
                .values({ settingKey: key, settingValue: value })
                .returning();
            return result[0];
        }
    }
    async createPromotionalUrl(utmSource) {
        const url = `?utmmedia=${utmSource}`;
        const existing = await db_1.db.select().from(schema_1.promotionalVisits).where((0, drizzle_orm_1.eq)(schema_1.promotionalVisits.utmSource, utmSource)).limit(1);
        if (!existing.length) {
            await db_1.db.insert(schema_1.promotionalVisits).values({
                utmSource,
                url,
            });
        }
        return { url, utmSource };
    }
    async getPromotionalVisits() {
        return await db_1.db.select().from(schema_1.promotionalVisits).orderBy(schema_1.promotionalVisits.createdAt);
    }
    async trackVisit(utmSource) {
        const existing = await db_1.db.select().from(schema_1.promotionalVisits).where((0, drizzle_orm_1.eq)(schema_1.promotionalVisits.utmSource, utmSource)).limit(1);
        if (existing.length) {
            await db_1.db.update(schema_1.promotionalVisits).set({ visitCount: existing[0].visitCount + 1 }).where((0, drizzle_orm_1.eq)(schema_1.promotionalVisits.utmSource, utmSource));
        }
        else {
            await db_1.db.insert(schema_1.promotionalVisits).values({ utmSource, visitCount: 1, url: `?utmmedia=${utmSource}` });
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)()
], SettingsService);
//# sourceMappingURL=settings.service.js.map