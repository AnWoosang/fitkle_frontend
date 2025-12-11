/**
 * Throttle 함수
 * 지정된 시간 간격으로 함수 실행을 제한합니다.
 *
 * @param func - 실행할 함수
 * @param limit - 실행 간격 (밀리초)
 * @returns throttle이 적용된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = func.apply(this, args);

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }

    return lastResult;
  };
}
