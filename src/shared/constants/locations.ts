/**
 * 국가와 도시 데이터
 * 사용자가 "Seoul, South Korea" 형태로 선택할 수 있도록 구성
 */

export interface City {
  name: string;
  nameKo: string;
}

export interface Country {
  code: string;
  name: string;
  nameKo: string;
  cities: City[];
}

export const COUNTRIES: Country[] = [
  {
    code: 'KR',
    name: 'South Korea',
    nameKo: '대한민국',
    cities: [
      { name: 'Seoul', nameKo: '서울' },
      { name: 'Busan', nameKo: '부산' },
      { name: 'Incheon', nameKo: '인천' },
      { name: 'Daegu', nameKo: '대구' },
      { name: 'Daejeon', nameKo: '대전' },
      { name: 'Gwangju', nameKo: '광주' },
      { name: 'Ulsan', nameKo: '울산' },
      { name: 'Suwon', nameKo: '수원' },
      { name: 'Jeju', nameKo: '제주' },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    nameKo: '미국',
    cities: [
      { name: 'New York', nameKo: '뉴욕' },
      { name: 'Los Angeles', nameKo: '로스앤젤레스' },
      { name: 'Chicago', nameKo: '시카고' },
      { name: 'Houston', nameKo: '휴스턴' },
      { name: 'Phoenix', nameKo: '피닉스' },
      { name: 'Philadelphia', nameKo: '필라델피아' },
      { name: 'San Antonio', nameKo: '샌안토니오' },
      { name: 'San Diego', nameKo: '샌디에이고' },
      { name: 'Dallas', nameKo: '댈러스' },
      { name: 'San Francisco', nameKo: '샌프란시스코' },
      { name: 'Seattle', nameKo: '시애틀' },
      { name: 'Boston', nameKo: '보스턴' },
      { name: 'Miami', nameKo: '마이애미' },
      { name: 'Las Vegas', nameKo: '라스베이거스' },
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    nameKo: '일본',
    cities: [
      { name: 'Tokyo', nameKo: '도쿄' },
      { name: 'Osaka', nameKo: '오사카' },
      { name: 'Kyoto', nameKo: '교토' },
      { name: 'Yokohama', nameKo: '요코하마' },
      { name: 'Nagoya', nameKo: '나고야' },
      { name: 'Sapporo', nameKo: '삿포로' },
      { name: 'Fukuoka', nameKo: '후쿠오카' },
      { name: 'Kobe', nameKo: '고베' },
    ],
  },
  {
    code: 'CN',
    name: 'China',
    nameKo: '중국',
    cities: [
      { name: 'Beijing', nameKo: '베이징' },
      { name: 'Shanghai', nameKo: '상하이' },
      { name: 'Guangzhou', nameKo: '광저우' },
      { name: 'Shenzhen', nameKo: '선전' },
      { name: 'Chengdu', nameKo: '청두' },
      { name: 'Hangzhou', nameKo: '항저우' },
      { name: 'Wuhan', nameKo: '우한' },
      { name: 'Xian', nameKo: '시안' },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    nameKo: '영국',
    cities: [
      { name: 'London', nameKo: '런던' },
      { name: 'Manchester', nameKo: '맨체스터' },
      { name: 'Birmingham', nameKo: '버밍엄' },
      { name: 'Liverpool', nameKo: '리버풀' },
      { name: 'Edinburgh', nameKo: '에든버러' },
      { name: 'Glasgow', nameKo: '글래스고' },
      { name: 'Bristol', nameKo: '브리스톨' },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    nameKo: '캐나다',
    cities: [
      { name: 'Toronto', nameKo: '토론토' },
      { name: 'Vancouver', nameKo: '밴쿠버' },
      { name: 'Montreal', nameKo: '몬트리올' },
      { name: 'Calgary', nameKo: '캘거리' },
      { name: 'Ottawa', nameKo: '오타와' },
      { name: 'Edmonton', nameKo: '에드먼턴' },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    nameKo: '호주',
    cities: [
      { name: 'Sydney', nameKo: '시드니' },
      { name: 'Melbourne', nameKo: '멜버른' },
      { name: 'Brisbane', nameKo: '브리즈번' },
      { name: 'Perth', nameKo: '퍼스' },
      { name: 'Adelaide', nameKo: '애들레이드' },
      { name: 'Gold Coast', nameKo: '골드코스트' },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    nameKo: '독일',
    cities: [
      { name: 'Berlin', nameKo: '베를린' },
      { name: 'Munich', nameKo: '뮌헨' },
      { name: 'Frankfurt', nameKo: '프랑크푸르트' },
      { name: 'Hamburg', nameKo: '함부르크' },
      { name: 'Cologne', nameKo: '쾰른' },
      { name: 'Stuttgart', nameKo: '슈투트가르트' },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    nameKo: '프랑스',
    cities: [
      { name: 'Paris', nameKo: '파리' },
      { name: 'Marseille', nameKo: '마르세유' },
      { name: 'Lyon', nameKo: '리옹' },
      { name: 'Toulouse', nameKo: '툴루즈' },
      { name: 'Nice', nameKo: '니스' },
      { name: 'Bordeaux', nameKo: '보르도' },
    ],
  },
  {
    code: 'IT',
    name: 'Italy',
    nameKo: '이탈리아',
    cities: [
      { name: 'Rome', nameKo: '로마' },
      { name: 'Milan', nameKo: '밀라노' },
      { name: 'Naples', nameKo: '나폴리' },
      { name: 'Turin', nameKo: '토리노' },
      { name: 'Florence', nameKo: '피렌체' },
      { name: 'Venice', nameKo: '베니스' },
    ],
  },
  {
    code: 'ES',
    name: 'Spain',
    nameKo: '스페인',
    cities: [
      { name: 'Madrid', nameKo: '마드리드' },
      { name: 'Barcelona', nameKo: '바르셀로나' },
      { name: 'Valencia', nameKo: '발렌시아' },
      { name: 'Seville', nameKo: '세비야' },
      { name: 'Malaga', nameKo: '말라가' },
      { name: 'Bilbao', nameKo: '빌바오' },
    ],
  },
  {
    code: 'NL',
    name: 'Netherlands',
    nameKo: '네덜란드',
    cities: [
      { name: 'Amsterdam', nameKo: '암스테르담' },
      { name: 'Rotterdam', nameKo: '로테르담' },
      { name: 'The Hague', nameKo: '헤이그' },
      { name: 'Utrecht', nameKo: '위트레흐트' },
      { name: 'Eindhoven', nameKo: '아인트호번' },
    ],
  },
];

// 국가 찾기 헬퍼 함수
export const findCountryByName = (name: string): Country | undefined => {
  return COUNTRIES.find((c) => c.name === name || c.nameKo === name);
};

// 국가 코드로 찾기
export const findCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find((c) => c.code === code);
};

// 도시 찾기 헬퍼 함수
export const findCity = (countryName: string, cityName: string): City | undefined => {
  const country = findCountryByName(countryName);
  if (!country) return undefined;

  return country.cities.find((c) => c.name === cityName || c.nameKo === cityName);
};

// 위치 포맷팅 (예: "Seoul, South Korea")
export const formatLocation = (city: string, country: string): string => {
  return `${city}, ${country}`;
};

// 위치 포맷팅 (한글 버전, 예: "서울, 대한민국")
export const formatLocationKo = (cityKo: string, countryKo: string): string => {
  return `${cityKo}, ${countryKo}`;
};
