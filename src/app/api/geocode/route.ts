import { NextRequest, NextResponse } from 'next/server';

/**
 * 카카오 주소 검색 API 응답 타입
 */
interface KakaoAddressDocument {
  address_name: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  address_type: string;
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    building_name: string;
    zone_no: string;
  } | null;
}

interface KakaoAddressResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoAddressDocument[];
}

/**
 * 주소를 위도/경도로 변환하는 BFF API
 * POST /api/geocode
 */
export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: '유효한 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.KAKAO_REST_API_KEY;

    if (!apiKey) {
      console.error('KAKAO_REST_API_KEY가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 카카오 주소 검색 API 호출
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        address
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error('카카오 API 호출 실패:', response.status);
      return NextResponse.json(
        { error: '주소 검색에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data: KakaoAddressResponse = await response.json();

    if (data.documents.length === 0) {
      return NextResponse.json(
        { error: '주소 검색 결과가 없습니다.' },
        { status: 404 }
      );
    }

    const doc = data.documents[0];

    return NextResponse.json({
      latitude: parseFloat(doc.y),
      longitude: parseFloat(doc.x),
      address: doc.address_name,
      roadAddress: doc.road_address?.address_name || null,
    });
  } catch (error) {
    console.error('좌표 변환 중 오류 발생:', error);
    return NextResponse.json(
      { error: '좌표 변환 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
