import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, Leaf, Sparkles } from 'lucide-react';
import { formatMa } from '@/lib/geoUtils';
import { Button } from '@/components/ui/button';

export default function InfoOverlay({ item, onClose }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg bg-card rounded-t-2xl shadow-2xl overflow-hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header bar with color */}
          <div
            className="h-2 w-full"
            style={{ backgroundColor: item.color }}
          />

          <div className="px-5 pt-4 pb-2 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">
                {item.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {formatMa(item.start_ma)} – {formatMa(item.end_ma)}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mr-2 -mt-1">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-5 pb-6 space-y-4">
            {item.info && (
              <>
                <InfoRow icon={Thermometer} label="Klima" text={item.info.climate} />
                <InfoRow icon={Leaf} label="Leben" text={item.info.life} />
                <InfoRow icon={Sparkles} label="Ereignisse" text={item.info.events} />
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoRow({ icon: Icon, label, text }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm text-foreground leading-relaxed mt-0.5">{text}</p>
      </div>
    </div>
  );
}