import { useState, useCallback, useEffect } from 'react';
import { savePageJson } from './cmsStorage';

export function useCmsHistory<T>(pageFilename?: string, maxHistory = 40) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T | null>(null);
  const [future, setFuture] = useState<T[]>([]);

  const dispatchHistoryEvent = (canUndo: boolean, canRedo: boolean) => {
    window.dispatchEvent(
      new CustomEvent('cms-history-change', {
        detail: { canUndo, canRedo },
      })
    );
  };

  const setInitialData = useCallback((data: T) => {
    setPresent(data);
    setPast([]);
    setFuture([]);
    dispatchHistoryEvent(false, false);
  }, []);

  const updateData = useCallback(
    (nextState: T | ((prev: T | null) => T)) => {
      setPresent((prevPresent) => {
        const resolvedNext =
          typeof nextState === 'function'
            ? (nextState as (prev: T | null) => T)(prevPresent)
            : nextState;

        if (prevPresent !== null && resolvedNext !== null) {
          if (JSON.stringify(prevPresent) !== JSON.stringify(resolvedNext)) {
            setPast((prevPast) => {
              const updatedPast = [...prevPast, prevPresent];
              const trimmed =
                updatedPast.length > maxHistory
                  ? updatedPast.slice(updatedPast.length - maxHistory)
                  : updatedPast;
              dispatchHistoryEvent(trimmed.length > 0, false);
              return trimmed;
            });
            setFuture([]);
          }
        }
        return resolvedNext;
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);

      setPresent((currentPresent) => {
        if (currentPresent !== null) {
          setFuture((prevFuture) => [currentPresent, ...prevFuture]);
        }
        if (pageFilename && previous) {
          savePageJson(pageFilename, previous).catch(() => {});
        }
        return previous;
      });

      dispatchHistoryEvent(newPast.length > 0, true);
      return newPast;
    });
  }, [pageFilename]);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setPresent((currentPresent) => {
        if (currentPresent !== null) {
          setPast((prevPast) => [...prevPast, currentPresent]);
        }
        if (pageFilename && next) {
          savePageJson(pageFilename, next).catch(() => {});
        }
        return next;
      });

      dispatchHistoryEvent(true, newFuture.length > 0);
      return newFuture;
    });
  }, [pageFilename]);

  useEffect(() => {
    const handleTriggerUndo = () => {
      undo();
    };

    const handleTriggerRedo = () => {
      redo();
    };

    window.addEventListener('cms-trigger-undo', handleTriggerUndo);
    window.addEventListener('cms-trigger-redo', handleTriggerRedo);

    return () => {
      window.removeEventListener('cms-trigger-undo', handleTriggerUndo);
      window.removeEventListener('cms-trigger-redo', handleTriggerRedo);
    };
  }, [undo, redo]);

  return {
    data: present,
    setData: updateData,
    setInitialData,
    updateData,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    pastCount: past.length,
  };
}
