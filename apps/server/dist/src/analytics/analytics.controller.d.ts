import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardMetrics(): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalRevenue: number;
    }>;
}
