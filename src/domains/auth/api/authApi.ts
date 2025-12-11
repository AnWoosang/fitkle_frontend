import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/app/router/apiRoutes';
import {
  LoginRequestDto,
  LoginResponseDto,
  SignupResponseDto,
  UserResponseDto,
  RefreshTokenResponseDto,
  mapUserDtoToUser,
} from '../types/dto/authDto';
import { User, LoginForm, SignupForm } from '../types/auth';
import { BusinessError } from '@/shared/error/BusinessError';

// Auth API 함수들
export const authApi = {
  // 로그인
  loginWithEmail: async (form: LoginForm): Promise<User> => {
    try {
      const requestDto: LoginRequestDto = {
        email: form.email,
        password: form.password,
      };

      const response = await apiClient.post<LoginResponseDto>(
        API_ROUTES.AUTH.LOGIN,
        requestDto
      );

      // rememberMe 설정 저장
      if (form.rememberMe !== undefined) {
        localStorage.setItem('rememberMe', String(form.rememberMe));
      }

      // axios interceptor가 이미 data를 추출했으므로 response.user로 접근
      return mapUserDtoToUser((response as any).user);
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // 회원가입
  signupWithEmail: async (form: SignupForm): Promise<User> => {
    try {
      console.log('[authApi.signupWithEmail] 요청 시작:', { email: form.email, nickname: form.nickname });

      // confirmPassword는 프론트엔드 검증용이므로 DTO에 포함하지 않음
      // API는 email, password, nickname만 요구함
      const requestDto = {
        email: form.email,
        password: form.password,
        nickname: form.nickname,
      };

      console.log('[authApi.signupWithEmail] 요청 데이터:', requestDto);

      const response = await apiClient.post<SignupResponseDto>(
        API_ROUTES.AUTH.SIGNUP,
        requestDto
      );

      console.log('[authApi.signupWithEmail] 응답 성공:', response);
      console.log('[authApi.signupWithEmail] 응답 타입:', typeof response);
      console.log('[authApi.signupWithEmail] 응답 키들:', Object.keys(response));
      console.log('[authApi.signupWithEmail] response.user:', (response as any).user);

      // axios interceptor가 이미 data를 추출했으므로 response.user로 접근
      const userDto = (response as any).user;

      if (!userDto) {
        console.error('[authApi.signupWithEmail] userDto가 없습니다. 전체 응답:', response);
        throw new Error('서버 응답에서 사용자 정보를 찾을 수 없습니다');
      }

      console.log('[authApi.signupWithEmail] mapUserDtoToUser 호출 전:', userDto);
      const mappedUser = mapUserDtoToUser(userDto);
      console.log('[authApi.signupWithEmail] mapUserDtoToUser 완료:', mappedUser);

      return mappedUser;
    } catch (error) {
      console.error('[authApi.signupWithEmail] 에러 발생:', error);
      throw BusinessError.fromApiError(error);
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<UserResponseDto>(API_ROUTES.AUTH.ME);
      // axios interceptor가 이미 data를 추출했으므로 response를 직접 사용
      return mapUserDtoToUser(response as any);
    } catch (error: any) {
      // 401 에러는 로그인되지 않은 상태로 처리
      if (error.response?.status === 401) {
        return null;
      }
      throw BusinessError.fromApiError(error);
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT);
      localStorage.removeItem('rememberMe');
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // 세션 갱신
  refreshSession: async (): Promise<User> => {
    try {
      const response = await apiClient.post<RefreshTokenResponseDto>(
        API_ROUTES.AUTH.REFRESH
      );
      // axios interceptor가 이미 data를 추출했으므로 response.user로 접근
      return mapUserDtoToUser((response as any).user);
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // 비밀번호 찾기 (나중에 구현)
  findPassword: async (email: string): Promise<void> => {
    try {
      await apiClient.post(API_ROUTES.AUTH.FIND_PASSWORD, { email });
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // 비밀번호 재설정 (나중에 구현)
  resetPassword: async (password: string, token: string): Promise<void> => {
    try {
      await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, {
        password,
        token,
      });
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // 이메일 중복 확인
  checkEmailDuplicate: async (email: string): Promise<{ available: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ available: boolean; message: string }>(
        API_ROUTES.AUTH.CHECK_EMAIL,
        { email }
      );
      return response as any;
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // Google OAuth 로그인
  loginWithGoogle: async (): Promise<{ url: string }> => {
    try {
      const response = await apiClient.post<{ url: string }>(
        API_ROUTES.AUTH.OAUTH_GOOGLE
      );
      return response as any;
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // Kakao OAuth 로그인
  loginWithKakao: async (): Promise<{ url: string }> => {
    try {
      const response = await apiClient.post<{ url: string }>(
        API_ROUTES.AUTH.OAUTH_KAKAO
      );
      return response as any;
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // 이메일 인증 코드 전송
  sendEmailOtp: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>(
        API_ROUTES.AUTH.SEND_EMAIL_OTP,
        { email }
      );
      return response as any;
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },

  // 이메일 인증 코드 검증
  verifyEmailOtp: async (
    email: string,
    token: string
  ): Promise<{ verified: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ verified: boolean; message: string }>(
        API_ROUTES.AUTH.VERIFY_EMAIL_OTP,
        { email, token }
      );
      return response as any;
    } catch (error) {
      throw BusinessError.fromApiError(error);
    }
  },
};
