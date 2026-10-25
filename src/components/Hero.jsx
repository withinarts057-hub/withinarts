import React from 'react';
import ShaderShowcase from '@/components/ui/hero';

export function Hero({ studioInfo, onExploreClick }) {
  return (
    <ShaderShowcase
      studioInfo={studioInfo}
      onExploreClick={onExploreClick}
      isWhiteTheme={true}
    />
  );
}
