import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrientation } from '@/hooks/useOrientation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimelineColumn from '@/components/geo/TimelineColumn';
import InfoOverlay from '@/components/geo/InfoOverlay';

export default function Knowledge() {
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const { modeId } = useParams();
  const isLandscape = useOrientation();

  const handleBack = () => {
    if (modeId) navigate(`/mode/${modeId}`);
    else navigate('/');
  };

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">Zeitstrahl</h1>
        </div>
        <div className="flex border-t border-border bg-muted/50">
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '22%' }}>Äon</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '26%' }}>Ära</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '32%' }}>Periode</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '20%' }}>Ma</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-auto hide-scrollbar flex-1">
        <TimelineColumn
          mode="knowledge"
          onTileClick={(item) => setSelectedItem(item)}
          onInfoClick={(item) => setSelectedItem(item)}
          isLandscape={isLandscape}
        />
      </div>

      {/* Info overlay */}
      {selectedItem && (
        <InfoOverlay item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}