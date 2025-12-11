import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/app/router/apiRoutes';
import { BusinessError } from '@/shared/error/BusinessError';

export interface ResendEmailForm {
  email: string;
  type?: 'signup' | 'email_change';
}

interface UseResendEmailReturn {
  isResending: boolean;
  resendMessage: string;
  resendEmail: (form: ResendEmailForm) => Promise<boolean>;
  clearMessage: () => void;
}

// 이메일 재발송 Mutation
const useResendEmailMutation = () => {
  return useMutation({
    mutationFn: async (form: ResendEmailForm) => {
      const response = await apiClient.post(API_ROUTES.AUTH.RESEND_EMAIL, {
        email: form.email,
        type: form.type || 'signup',
      });
      return response;
    },
  });
};

export function useResendEmail(): UseResendEmailReturn {
  const [resendMessage, setResendMessage] = useState('');
  const resendEmailMutation = useResendEmailMutation();

  const resendEmail = useCallback(
    async (form: ResendEmailForm): Promise<boolean> => {
      if (!form.email) {
        setResendMessage('이메일 주소가 필요합니다.');
        return false;
      }

      setResendMessage('');

      try {
        await resendEmailMutation.mutateAsync(form);
        setResendMessage('인증 메일이 다시 발송되었습니다. 이메일을 확인해주세요.');
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof BusinessError
            ? error.message
            : '메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.';
        setResendMessage(errorMessage);
        return false;
      }
    },
    [resendEmailMutation]
  );

  const clearMessage = useCallback(() => {
    setResendMessage('');
  }, []);

  return {
    isResending: resendEmailMutation.isPending,
    resendMessage,
    resendEmail,
    clearMessage,
  };
}
