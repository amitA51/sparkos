import React, { Suspense, lazy } from 'react';
import { useModal } from '../state/ModalContext';
import SimpleQuickNote from './SimpleQuickNote';
import type { PersonalItem } from '../types';

// Lazy load the Roadmap screen to keep initial bundle small
const RoadmapScreen = lazy(() => import('./details/RoadmapDetails'));

// Type for roadmap screen modal payload
interface RoadmapScreenPayload {
  item: PersonalItem;
  onUpdate: (id: string, updates: Partial<PersonalItem>) => void;
  onDelete: (id: string) => void;
}

const ModalRoot: React.FC = () => {
  const { modals, closeModal } = useModal();

  return (
    <>
      {/* Quick Note Modal - always rendered, manages its own visibility */}
      <SimpleQuickNote />

      {Object.entries(modals).map(([key, modal]) => {
        if (!modal || !modal.isOpen) return null;

        switch (key) {
          case 'roadmapScreen': {
            const payload = modal.payload as unknown as RoadmapScreenPayload;
            return (
              <Suspense fallback={<div />} key={key}>
                <RoadmapScreen
                  item={payload.item}
                  onUpdate={payload.onUpdate}
                  onDelete={payload.onDelete}
                  onClose={() => closeModal(key)}
                />
              </Suspense>
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
};

export default ModalRoot;
