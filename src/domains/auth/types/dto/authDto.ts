import { User, AuthSession } from '../auth';

// API 요청 DTO
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface SignupRequestDto {
  email: string;
  password: string;
  name: string;
  nickname?: string; // 닉네임 (선택)
  country: string; // 국가 (필수)
  city: string; // 도시 (필수)
}

export interface RefreshTokenRequestDto {
  refreshToken?: string;
}

export interface FindPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  password: string;
  token: string;
}

// API 응답 DTO
export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  nickname?: string; // 닉네임 (선택)
  profileImageUrl?: string;
  role?: 'user' | 'admin';
  country: string; // 국가 (필수)
  city: string; // 도시 (필수)
  createdAt?: string;
}

export interface LoginResponseDto {
  user: UserResponseDto;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
  };
}

export interface SignupResponseDto {
  user: UserResponseDto;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  message?: string;
}

export interface RefreshTokenResponseDto {
  user: UserResponseDto;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

// DTO to Domain mapper
export function mapUserDtoToUser(dto: UserResponseDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    nickname: dto.nickname,
    profileImageUrl: dto.profileImageUrl,
    role: dto.role,
    country: dto.country,
    city: dto.city,
    createdAt: dto.createdAt,
  };
}

export function mapLoginResponseToSession(dto: LoginResponseDto): AuthSession {
  return {
    access_token: dto.session.access_token,
    refresh_token: dto.session.refresh_token,
    expires_in: dto.session.expires_in,
    expires_at: dto.session.expires_at,
    user: mapUserDtoToUser(dto.user),
  };
}
