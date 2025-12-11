/**
 * 업로드 상태 로컬 저장 (네트워크 단절 대비)
 */

export interface UploadState {
  transactionId: string;
  uploadedUrls: string[];
  formData: Record<string, any>; // 범용적으로 사용할 수 있도록 변경
  timestamp: number;
}

const STORAGE_KEY = 'pending_creation';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24시간

/**
 * 업로드 상태를 localStorage에 저장
 */
export function saveUploadState(state: UploadState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('로컬 저장 실패:', error);
  }
}

/**
 * 저장된 업로드 상태 조회
 * - 24시간 이상 지난 상태는 자동 삭제 후 null 반환
 */
export function getUploadState(): UploadState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const state: UploadState = JSON.parse(stored);

    // 24시간 이상 지난 상태는 무시
    if (Date.now() - state.timestamp > MAX_AGE_MS) {
      clearUploadState();
      return null;
    }

    return state;
  } catch (error) {
    console.error('로컬 상태 조회 실패:', error);
    return null;
  }
}

/**
 * 저장된 업로드 상태 삭제
 */
export function clearUploadState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('로컬 상태 삭제 실패:', error);
  }
}

/**
 * 저장된 상태가 있는지 확인
 */
export function hasUploadState(): boolean {
  return getUploadState() !== null;
}
