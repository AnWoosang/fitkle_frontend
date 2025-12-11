/**
 * 카카오 주소 검색 BFF API 유틸리티
 * BFF API(/api/geocode)를 통해 주소를 좌표로 변환
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeocodeResponse {
  latitude: number;
  longitude: number;
  address: string;
  roadAddress: string | null;
}

/**
 * 주소를 위도/경도 좌표로 변환
 * BFF API를 통해 카카오 API 호출 (서버 측에서 API 키 관리)
 *
 * @param address 도로명 주소 또는 지번 주소
 * @returns 위도/경도 객체 또는 null
 */
export async function getCoordinatesFromAddress(
  address: string
): Promise<Coordinates | null> {
  if (!address || typeof address !== 'string') {
    console.error('유효하지 않은 주소입니다:', address);
    return null;
  }

  try {
    const response = await fetch('/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('좌표 변환 실패:', errorData.error || response.statusText);
      return null;
    }

    const data: GeocodeResponse = await response.json();

    return {
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error('좌표 변환 중 오류 발생:', error);
    return null;
  }
}
