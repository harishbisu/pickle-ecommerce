import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSetting(key: string): Promise<{
        key: string;
        value: string;
    }>;
    getAll(): Promise<{
        id: number;
        settingKey: string;
        settingValue: string;
    }[]>;
    setSetting(body: {
        key: string;
        value: string;
    }): Promise<{
        id: number;
        settingKey: string;
        settingValue: string;
    }>;
}
