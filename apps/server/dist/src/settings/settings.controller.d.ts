import { SettingsService } from './settings.service';
import { SetSettingDto } from './settings.dto';
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
    setSetting(body: SetSettingDto): Promise<{
        id: number;
        settingKey: string;
        settingValue: string;
    }>;
}
