import { Suspense } from 'react';
import type { MenuOnlinePublicMenuDTO } from '@/src/types/menu-online';
import { MenuPageClient } from './MenuPageClient';
import { MenuSkeleton } from '../components/MenuSkeleton';
import { MenuError } from '../components/MenuError';

type ErrorResponse = {
  error: string;
  message: string;
};

type SuccessResponse = {
  success: boolean;
  data: MenuOnlinePublicMenuDTO;
};

async function fetchMenuData(tenantSlug: string): Promise<MenuOnlinePublicMenuDTO | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/menu/${tenantSlug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[v0] Menu fetch failed with status ${response.status}`);
      return null;
    }

    const data = (await response.json()) as SuccessResponse | ErrorResponse;

    if ('data' in data) {
      return data.data;
    }

    console.error('[v0] Invalid response format:', data);
    return null;
  } catch (error) {
    console.error('[v0] Failed to fetch menu data:', error);
    return null;
  }
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuPageContent tenantSlug={tenantSlug} />
    </Suspense>
  );
}

async function MenuPageContent({ tenantSlug }: { tenantSlug: string }) {
  const menuData = await fetchMenuData(tenantSlug);

  if (!menuData) {
    return <MenuError tenantSlug={tenantSlug} />;
  }

  return <MenuPageClient menuData={menuData} tenantSlug={tenantSlug} />;
}
