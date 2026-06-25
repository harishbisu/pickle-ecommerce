export declare class SettingsService {
    getAll(): Promise<{
        id: number;
        settingKey: string;
        settingValue: string;
    }[]>;
    getSetting(key: string): Promise<string>;
    setSetting(key: string, value: string): Promise<{
        id: number;
        settingKey: string;
        settingValue: string;
    }>;
}
