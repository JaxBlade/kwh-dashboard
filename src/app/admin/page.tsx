import { getAdminDashboardStats } from "./actions";
import OverviewClient from "./overview-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable cache so it always fetches fresh data

export default async function AdminOverview() {
  const stats = await getAdminDashboardStats();
  
  return <OverviewClient stats={stats} />;
}
