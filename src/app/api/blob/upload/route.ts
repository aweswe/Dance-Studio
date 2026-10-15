import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            'Vercel Blob is not connected yet. Please go to your Vercel Project Dashboard -> Storage -> Create/Connect Blob Store.',
        },
        { status: 400 },
      );
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const supabase = await createServerSupabase();
        if (!(await isAdmin(supabase))) {
          throw new Error('Unauthorized: Admin access required');
        }

        return {
          allowedContentTypes: [
            'video/mp4',
            'video/quicktime',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/svg+xml',
          ],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB max
        };
      },
      onUploadCompleted: async () => {
        // Upload completed callback
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
