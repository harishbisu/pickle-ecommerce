export declare class AnalyticsService {
    getDashboardMetrics(): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalRevenue: number;
    }>;
}
