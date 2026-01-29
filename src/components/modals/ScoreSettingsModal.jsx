import React from 'react';
import { AppModal } from '../ui';
import { SettingDescription, SettingExample } from '../game';
import { calculateRoundScore } from '../../helpers/math/spadesMath';
import {
  TAKES_BAGS,
  HELPS_TEAM_BID,
  NO_BAGS_NO_HELP,
  NIL,
  BLIND_NIL,
} from '../../helpers/utils/constants';

function ScoreSettingsModal({ isOpen, setIsModalOpen }) {
  const sections = [
    {
      title: 'Takes Bags',
      desc: 'If a teammate bids Nil and takes tricks, those tricks count as bags for their team. Partner’s bid is scored normally.',
      nilSetting: TAKES_BAGS,
      examples: [
        // Nil succeeds, partner overbids by 1
        { p1Bid: NIL, p1Actual: 0, p2Bid: '5', p2Actual: '6' },
        // Nil fails, partner gets 6
        { p1Bid: NIL, p1Actual: '2', p2Bid: '5', p2Actual: '6' },
        // Blind Nil fails
        { p1Bid: BLIND_NIL, p1Actual: '3', p2Bid: '5', p2Actual: '6' },
      ],
    },
    {
      title: 'Helps Team Bid',
      desc: 'A successful Nil is worth +100 (or +200 for Blind Nil) and does not produce bags. Partner’s bid is evaluated against the team bid (Nil helps meet team bid).',
      nilSetting: HELPS_TEAM_BID,
      examples: [
        { p1Bid: NIL, p1Actual: 0, p2Bid: '5', p2Actual: '6' },
        { p1Bid: NIL, p1Actual: '2', p2Bid: '5', p2Actual: '6' },
      ],
    },
    {
      title: 'No Bags / No Help',
      desc: 'Nil does not create bags and does not help partner meet their bid. Partner’s bid is scored independently of the Nil attempt.',
      nilSetting: NO_BAGS_NO_HELP,
      examples: [
        { p1Bid: NIL, p1Actual: 0, p2Bid: '5', p2Actual: '6' },
        { p1Bid: NIL, p1Actual: '2', p2Bid: '5', p2Actual: '6' },
      ],
    },
  ];

  return (
    <>
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title="Score Settings"
    >
      {sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: '12px' }}>
          <SettingDescription title={section.title} desc={section.desc} />
          {section.examples.map((ex, j) => {
            const result = calculateRoundScore(
              ex.p1Bid,
              ex.p2Bid,
              ex.p1Actual,
              ex.p2Actual,
              section.nilSetting
            );
            return (
              <SettingExample
                key={`${idx}-${j}`}
                p1Bid={ex.p1Bid}
                p1Actual={ex.p1Actual}
                p2Bid={ex.p2Bid}
                p2Actual={ex.p2Actual}
                score={result.score}
                bags={result.bags}
              />
            );
          })}
        </div>
      ))}
    </AppModal>
    </>
  );
}

export default ScoreSettingsModal;
