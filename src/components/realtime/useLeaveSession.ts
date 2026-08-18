import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../store/GlobalContext';
import { toaster } from '../ui/toaster';
import { hasOwnLocalGame, persistViewerSeat } from '../../helpers/utils/viewerSession';

/**
 * The viewer's "Leave" action. Leaving is non-destructive (the viewer's own
 * local game is untouched; only the live sync stops), so it happens instantly
 * and offers an undoable toast instead of a confirm dialog.
 *
 * Smart landing: if this device has its own game in localStorage, go to
 * `/spades-calculator` (their board); otherwise go to `/` (the name form).
 * The session id + seat are captured for the ~5s undo window so "Undo" can
 * re-join seamlessly (seat re-persisted so the picker doesn't re-prompt).
 */
export const useLeaveSession = () => {
  const navigate = useNavigate();
  const { sessionId, seat, endSession, joinSession } =
    useContext(GlobalContext);

  return useCallback(() => {
    if (!sessionId) return;

    endSession();

    const destination = hasOwnLocalGame() ? '/spades-calculator' : '/';
    navigate(destination);

    toaster.create({
      title: 'Left the live board',
      action: {
        label: 'Undo',
        onClick: () => {
          persistViewerSeat(seat);
          joinSession(sessionId);
          navigate(`/spades-calculator?session=${sessionId}`);
        },
      },
      duration: 5000,
    });
  }, [sessionId, seat, endSession, joinSession, navigate]);
};
