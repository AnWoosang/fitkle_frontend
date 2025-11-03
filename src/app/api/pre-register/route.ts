import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Initialize Supabase client at runtime
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Supabase configuration is missing' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  try {
    const body = await request.json();

    const { contact_type, contact_value, country, age_range } = body;

    // Validate required fields
    if (!contact_type || !contact_value || !country || !age_range) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate contact type
    if (!['email', 'instagram', 'kakao', 'phone'].includes(contact_type)) {
      return NextResponse.json(
        { error: 'Invalid contact type' },
        { status: 400 }
      );
    }

    // Validate age range
    if (!['18-24', '25-34', '35-44', '45-54', '55+'].includes(age_range)) {
      return NextResponse.json(
        { error: 'Invalid age range' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('pre_registrations')
      .insert([
        {
          contact_type,
          contact_value,
          country,
          age_range,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save pre-registration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Pre-registration submitted successfully',
        data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Pre-registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
