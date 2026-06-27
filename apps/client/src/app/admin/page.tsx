'use client';

import { RoleGuard } from '../../components/guards/RoleGuard';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </RoleGuard>
  );
}
