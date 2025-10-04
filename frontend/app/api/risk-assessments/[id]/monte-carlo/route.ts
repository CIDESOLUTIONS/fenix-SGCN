import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/risk-assessments/${params.id}/monte-carlo`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Monte Carlo API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute Monte Carlo simulation' },
      { status: 500 }
    );
  }
}
