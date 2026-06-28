export declare class SettingsService {
    getAll(): Promise<{
        id: string;
        settingKey: string;
        settingValue: string;
    }[]>;
    getSetting(key: string): Promise<string>;
    setSetting(key: string, value: string): Promise<{
        id: string;
        settingKey: string;
        settingValue: string;
    }>;
    createPromotionalUrl(utmSource: string): Promise<{
        url: string;
        utmSource: string;
    }>;
    getPromotionalVisits(): Promise<{
        id: string;
        utmSource: string;
        visitCount: number;
        url: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
    trackVisit(utmSource: string): Promise<void>;
}
