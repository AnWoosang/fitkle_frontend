'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { PreRegisterModal } from './PreRegisterModal';

export function PreRegisterButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('preRegister');

  return (
    <>
      {/* Fixed Bottom Bar - Mobile: Above BottomNav (bottom-16), Web: At bottom (bottom-0) */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-lg pb-2 md:pb-safe">
        <div className="max-w-md mx-auto px-4 py-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {t('button')}
          </Button>
        </div>
      </div>

      {/* Modal */}
      <PreRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
