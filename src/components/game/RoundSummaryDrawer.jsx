import { SimpleGrid, Text, Stack } from '../ui';
import { team1Styles, team2Styles } from '../../helpers/utils/constants';
import { MoveRight } from 'lucide-react';

const SharedSection = ({ title, children }) => (
  <Stack gap="2" mb="8" alignItems="center" width="full">
    <Text color="gray.300" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
      {title}
    </Text>
    <SimpleGrid columns={2} gap={4} width="full">
      {children}
    </SimpleGrid>
  </Stack>
);

const Field = ({ label, value, color, children }) => (
  <Stack gap="0" alignItems="center">
    <Text color="gray.400" fontSize="2xs" fontWeight="bold" textTransform="uppercase">
      {label}
    </Text>
    <Text as="div" color={color}>
      {value !== undefined ? value : children}
    </Text>
  </Stack>
);

const Progression = ({ start, end }) => (
  <Stack direction="row" gap="4" alignItems="center">
    <Text>{start}</Text>
    <MoveRight size={14} strokeWidth={3} />
    <Text>{end}</Text>
  </Stack>
);

function RoundSummaryDrawer({ team1Stats, team2Stats }) {
  const calculateDerived = (stats) => {
    const { startBags, endBags, bagPenalty, setPenalty, nilPenalty, blindNilPenalty } = stats;
    const bagsTaken = endBags - startBags + (bagPenalty > 0 ? 10 : 0);
    const hasPenalties = bagPenalty > 0 || setPenalty > 0 || nilPenalty > 0 || blindNilPenalty > 0;
    const totalPointsLost = bagPenalty + setPenalty + nilPenalty + blindNilPenalty;
    return { bagsTaken, hasPenalties, totalPointsLost };
  };

  const t1Derived = calculateDerived(team1Stats);
  const t2Derived = calculateDerived(team2Stats);

  const hasAnyPenalties = t1Derived.hasPenalties || t2Derived.hasPenalties;

  return (
    <Stack mt="4" p="4" bg="bg">
      <SharedSection title="Initial to Final">
        <Stack style={team1Styles} alignItems="center" gap="4">
          <Field label="Game Score">
            <Progression start={team1Stats.startScore} end={team1Stats.endScore} />
          </Field>
          <Field label="Game Bags">
            <Progression start={team1Stats.startBags} end={team1Stats.endBags} />
          </Field>
        </Stack>
        <Stack style={team2Styles} alignItems="center" gap="4">
          <Field label="Game Score">
            <Progression start={team2Stats.startScore} end={team2Stats.endScore} />
          </Field>
          <Field label="Game Bags">
            <Progression start={team2Stats.startBags} end={team2Stats.endBags} />
          </Field>
        </Stack>
      </SharedSection>

      <SharedSection title="Net">
        <Stack style={team1Styles} alignItems="center" gap="4">
          <Field label="Points Gained" value={team1Stats.pointsGained} />
          <Field 
            label="Points Lost" 
            value={t1Derived.totalPointsLost} 
            color={t1Derived.totalPointsLost > 0 ? 'var(--chakra-colors-red-500)' : 'inherit'} 
          />
          <Field label="Net" value={team1Stats.netChange} />
        </Stack>
        <Stack style={team2Styles} alignItems="center" gap="4">
          <Field label="Points Gained" value={team2Stats.pointsGained} />
          <Field 
            label="Points Lost" 
            value={t2Derived.totalPointsLost} 
            color={t2Derived.totalPointsLost > 0 ? 'var(--chakra-colors-red-500)' : 'inherit'} 
          />
          <Field label="Net" value={team2Stats.netChange} />
        </Stack>
      </SharedSection>

      {hasAnyPenalties && (
        <SharedSection title="Penalties">
          <Stack style={team1Styles} alignItems="center" gap="4">
            {t1Derived.hasPenalties ? (
              <>
                {team1Stats.bagPenalty > 0 && <Field label="Bag Penalty" value={`-${team1Stats.bagPenalty}`} color="red.500" />}
                {team1Stats.setPenalty > 0 && <Field label="Set Penalty" value={`-${team1Stats.setPenalty}`} color="red.500" />}
                {team1Stats.nilPenalty > 0 && <Field label="Nil Penalty" value={`-${team1Stats.nilPenalty}`} color="red.500" />}
                {team1Stats.blindNilPenalty > 0 && <Field label="Blind Nil Penalty" value={`-${team1Stats.blindNilPenalty}`} color="red.500" />}
              </>
            ) : (
              <Text color={team1Styles.color} fontSize="sm">None</Text>
            )}
          </Stack>
          <Stack style={team2Styles} alignItems="center" gap="4">
            {t2Derived.hasPenalties ? (
              <>
                {team2Stats.bagPenalty > 0 && <Field label="Bag Penalty" value={`-${team2Stats.bagPenalty}`} color="red.500" />}
                {team2Stats.setPenalty > 0 && <Field label="Set Penalty" value={`-${team2Stats.setPenalty}`} color="red.500" />}
                {team2Stats.nilPenalty > 0 && <Field label="Nil Penalty" value={`-${team2Stats.nilPenalty}`} color="red.500" />}
                {team2Stats.blindNilPenalty > 0 && <Field label="Blind Nil Penalty" value={`-${team2Stats.blindNilPenalty}`} color="red.500" />}
              </>
            ) : (
              <Text color={team2Styles.color} fontSize="sm">None</Text>
            )}
          </Stack>
        </SharedSection>
      )}

      <SharedSection title="Bags">
        <Stack style={team1Styles} alignItems="center" gap="4">
          <Field label="Initial Bags" value={team1Stats.startBags} />
          <Field label="Bags Taken" value={t1Derived.bagsTaken} />
          <Field 
            label={team1Stats.bagPenalty > 0 ? 'Bag Result' : 'Total Bags'} 
            value={team1Stats.bagPenalty > 0 && team1Stats.endBags === 0 ? 'Reset to 0' : (team1Stats.bagPenalty > 0 ? `Carryover: ${team1Stats.endBags}` : team1Stats.endBags)} 
          />
        </Stack>
        <Stack style={team2Styles} alignItems="center" gap="4">
          <Field label="Initial Bags" value={team2Stats.startBags} />
          <Field label="Bags Taken" value={t2Derived.bagsTaken} />
          <Field 
            label={team2Stats.bagPenalty > 0 ? 'Bag Result' : 'Total Bags'} 
            value={team2Stats.bagPenalty > 0 && team2Stats.endBags === 0 ? 'Reset to 0' : (team2Stats.bagPenalty > 0 ? `Carryover: ${team2Stats.endBags}` : team2Stats.endBags)} 
          />
        </Stack>
      </SharedSection>
    </Stack>
  );
}

export default RoundSummaryDrawer;
