import { NextResponse } from 'next/server';
import { getStorefrontStatus } from '@/actions/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const mode = await getStorefrontStatus();
  return NextResponse.json({ mode });
}
