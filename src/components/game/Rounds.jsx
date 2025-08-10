import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Round } from './';
import { GlobalContext } from '../../helpers/context/GlobalContext';

function Rounds() {
  const { roundHistory, currentRound } = useContext(GlobalContext);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showNewRound, setShowNewRound] = useState(true);
  const [previousRoundHistoryLength, setPreviousRoundHistoryLength] = useState(
    roundHistory.length
  );

  // Detect when a round is completed (roundHistory length increases)
  useEffect(() => {
    if (roundHistory.length > previousRoundHistoryLength) {
      // A round was just completed - start the animation sequence
      setIsCompleting(true);
      setShowNewRound(false);

      // After the slide-down animation completes, show the new round
      const timer = setTimeout(() => {
        setShowNewRound(true);
        setIsCompleting(false);
      }, 600); // Slightly shorter than the slide animation

      return () => clearTimeout(timer);
    }

    setPreviousRoundHistoryLength(roundHistory.length);
  }, [roundHistory.length, previousRoundHistoryLength]);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <AnimatePresence>
        {showNewRound && (
          <motion.div
            key={`current-${roundHistory.length}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            <Round
              isCurrent
              roundHistory={roundHistory}
              roundIndex={roundHistory.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {roundHistory.length > 0 &&
        roundHistory
          .map((round, i) => ({ round, i }))
          .filter(({ round }) => !!round)
          .map(({ i }) => (
            <motion.div
              key={`history-${i}`}
              animate={
                isCompleting && i === roundHistory.length - 1
                  ? { y: 200, transition: { duration: 0.8, ease: 'easeInOut' } }
                  : { y: 0 }
              }
            >
              <Round roundHistory={roundHistory} roundIndex={i} />
            </motion.div>
          ))
          .reverse()}
    </div>
  );
}

export default Rounds;
