import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';

type Props = {
  fallbackHref?: string;
  className?: string;
  children?: React.ReactNode;
};

export function BackButton({
  fallbackHref = '/',
  className = '',
  children = '← 戻る',
}: Props) {
  const router = useRouter();

  function onClick() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      className={`${styles.buttonLink} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}


