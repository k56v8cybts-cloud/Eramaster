import React from 'react';
import ProfileContent from '@/components/ProfileContent';

export default function Profil() {
  return (
    <div className="min-h-screen bg-background overflow-auto pb-safe">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border pt-safe">
        <div className="px-5 py-3 max-w-md mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground">Einstellungen</h1>
        </div>
      </div>
      <ProfileContent />
    </div>
  );
}