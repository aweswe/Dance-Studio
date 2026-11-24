import { NextResponse } from 'next/server';
import { checkPhonePeStatus, getPhonePeConfig } from '@/lib/phonepe/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const config = getPhonePeConfig();
    const result = await checkPhonePeStatus(id, config);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[PhonePe Status Check Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
