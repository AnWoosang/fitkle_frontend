import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Please enter your email', available: false },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', available: false },
        { status: 400 }
      );
    }

    // 1. auth.users 테이블에서 이메일 중복 확인 (Service Role Key 사용)
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.error('Auth email check error:', authError);
      return NextResponse.json(
        { error: 'An error occurred while checking email', available: false },
        { status: 500 }
      );
    }

    const existingAuthUser = authUsers?.users?.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingAuthUser) {
      return NextResponse.json(
        { available: false, message: 'This email is already in use' },
        { status: 200 }
      );
    }

    // 2. Check email duplication in public.member table
    const { data: existingMember, error: memberError } = await supabaseAdmin
      .from('member')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (memberError) {
      console.error('Member email check error:', memberError);
      return NextResponse.json(
        { error: 'An error occurred while checking email', available: false },
        { status: 500 }
      );
    }

    if (existingMember) {
      return NextResponse.json(
        { available: false, message: 'This email is already in use' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: 'This email is available' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: 'An error occurred while checking email', available: false },
      { status: 500 }
    );
  }
}
