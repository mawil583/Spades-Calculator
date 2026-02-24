import { SimpleGrid, Text, Stack } from "../ui";
import { team1Styles, team2Styles } from "../../helpers/utils/constants";
import { MoveRight } from "lucide-react";
import RoundSummaryField from "./RoundSummaryField";
import RoundSummarySubHeading from "./RoundSummarySubHeading";

import type { ReactNode } from "react";
import type { TeamStats } from "./RoundSummary";

interface SharedSectionProps {
  title: string;
  children: ReactNode;
}

const SharedSection = ({ title, children }: SharedSectionProps) => (
  <Stack
    gap="var(--app-spacing-2)"
    mb="var(--app-spacing-6)"
    alignItems="center"
    width="full"
  >
    <RoundSummarySubHeading color="inherit">{title}</RoundSummarySubHeading>
    <SimpleGrid columns={2} gap="var(--app-spacing-4)" width="full">
      {children}
    </SimpleGrid>
  </Stack>
);

interface ProgressionProps {
  start?: number;
  end?: number;
}

const Progression = ({ start, end }: ProgressionProps) => (
  <Stack direction="row" gap="var(--app-spacing-4)" alignItems="center">
    <Text>{start}</Text>
    <MoveRight size={14} strokeWidth={3} />
    <Text>{end}</Text>
  </Stack>
);

interface RoundSummaryDrawerProps {
  team1Stats: TeamStats;
  team2Stats: TeamStats;
}

function RoundSummaryDrawer({
  team1Stats,
  team2Stats,
}: RoundSummaryDrawerProps) {
  const calculateDerived = (stats: TeamStats) => {
    const startBags = stats.startBags || 0;
    const endBags = stats.endBags || 0;
    const bagPenalty = stats.bagPenalty || 0;
    const setPenalty = stats.setPenalty || 0;
    const nilPenalty = stats.nilPenalty || 0;
    const blindNilPenalty = stats.blindNilPenalty || 0;
    const bagsTaken = endBags - startBags + (bagPenalty > 0 ? 10 : 0);
    const hasPenalties =
      bagPenalty > 0 || setPenalty > 0 || nilPenalty > 0 || blindNilPenalty > 0;
    const totalPointsLost =
      bagPenalty + setPenalty + nilPenalty + blindNilPenalty;
    return { bagsTaken, hasPenalties, totalPointsLost };
  };

  const t1Derived = calculateDerived(team1Stats);
  const t2Derived = calculateDerived(team2Stats);

  const hasAnyPenalties = t1Derived.hasPenalties || t2Derived.hasPenalties;

  return (
    <Stack mt="var(--app-spacing-4)" p="var(--app-spacing-4)" bg="bg">
      <SharedSection title="Initial to Final">
        <Stack
          style={team1Styles}
          alignItems="center"
          gap="var(--app-spacing-4)"
        >
          <RoundSummaryField label="Game Score">
            <Progression
              start={team1Stats.startScore}
              end={team1Stats.endScore}
            />
          </RoundSummaryField>
          <RoundSummaryField label="Game Bags">
            <Progression
              start={team1Stats.startBags}
              end={team1Stats.endBags}
            />
          </RoundSummaryField>
        </Stack>
        <Stack
          style={team2Styles}
          alignItems="center"
          gap="var(--app-spacing-4)"
        >
          <RoundSummaryField label="Game Score">
            <Progression
              start={team2Stats.startScore}
              end={team2Stats.endScore}
            />
          </RoundSummaryField>
          <RoundSummaryField label="Game Bags">
            <Progression
              start={team2Stats.startBags}
              end={team2Stats.endBags}
            />
          </RoundSummaryField>
        </Stack>
      </SharedSection>

      <SharedSection title="Net">
        <Stack
          style={team1Styles}
          alignItems="center"
          gap="var(--app-spacing-4)"
        >
          <RoundSummaryField
            label="Points Gained"
            value={team1Stats.pointsGained}
          />
          <RoundSummaryField
            label="Points Lost"
            value={t1Derived.totalPointsLost}
            color={
              t1Derived.totalPointsLost > 0 ? "var(--app-error-red)" : "inherit"
            }
          />
          <RoundSummaryField label="Net" value={team1Stats.netChange} />
        </Stack>
        <Stack
          style={team2Styles}
          alignItems="center"
          gap="var(--app-spacing-4)"
        >
          <RoundSummaryField
            label="Points Gained"
            value={team2Stats.pointsGained}
          />
          <RoundSummaryField
            label="Points Lost"
            value={t2Derived.totalPointsLost}
            color={
              t2Derived.totalPointsLost > 0 ? "var(--app-error-red)" : "inherit"
            }
          />
          <RoundSummaryField label="Net" value={team2Stats.netChange} />
        </Stack>
      </SharedSection>

      {hasAnyPenalties && (
        <SharedSection title="Penalties">
          <Stack
            style={team1Styles}
            alignItems="center"
            gap="var(--app-spacing-4)"
          >
            {t1Derived.hasPenalties ? (
              <>
                {(team1Stats.bagPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Bag Penalty"
                    value={`-${team1Stats.bagPenalty}`}
                    color="red.500"
                  />
                )}
                {(team1Stats.setPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Set Penalty"
                    value={`-${team1Stats.setPenalty}`}
                    color="red.500"
                  />
                )}
                {(team1Stats.nilPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Nil Penalty"
                    value={`-${team1Stats.nilPenalty}`}
                    color="red.500"
                  />
                )}
                {(team1Stats.blindNilPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Blind Nil Penalty"
                    value={`-${team1Stats.blindNilPenalty}`}
                    color="red.500"
                  />
                )}
              </>
            ) : (
              <Text color={team1Styles.color} fontSize="sm">
                None
              </Text>
            )}
          </Stack>
          <Stack
            style={team2Styles}
            alignItems="center"
            gap="var(--app-spacing-4)"
          >
            {t2Derived.hasPenalties ? (
              <>
                {(team2Stats.bagPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Bag Penalty"
                    value={`-${team2Stats.bagPenalty}`}
                    color="red.500"
                  />
                )}
                {(team2Stats.setPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Set Penalty"
                    value={`-${team2Stats.setPenalty}`}
                    color="red.500"
                  />
                )}
                {(team2Stats.nilPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Nil Penalty"
                    value={`-${team2Stats.nilPenalty}`}
                    color="red.500"
                  />
                )}
                {(team2Stats.blindNilPenalty ?? 0) > 0 && (
                  <RoundSummaryField
                    label="Blind Nil Penalty"
                    value={`-${team2Stats.blindNilPenalty}`}
                    color="red.500"
                  />
                )}
              </>
            ) : (
              <Text color={team2Styles.color} fontSize="sm">
                None
              </Text>
            )}
          </Stack>
        </SharedSection>
      )}

      <SharedSection title="Bags">
        <Stack
          style={team1Styles}
          alignItems="center"
          gap="var(--app-spacing-4)"
        >
          <RoundSummaryField
            label="Initial Bags"
            value={team1Stats.startBags}
          />
          <RoundSummaryField label="Bags Taken" value={t1Derived.bagsTaken} />
          <RoundSummaryField
            label={
              (team1Stats.bagPenalty ?? 0) > 0 ? "Bag Result" : "Total Bags"
            }
            value={
              (team1Stats.bagPenalty ?? 0) > 0 && team1Stats.endBags === 0
                ? "Reset to 0"
                : (team1Stats.bagPenalty ?? 0) > 0
                  ? `Carryover: ${team1Stats.endBags}`
                  : team1Stats.endBags
            }
          />
        </Stack>
        <Stack
          style={team2Styles}
          alignItems="center"
          gap="var(--app-spacing-4)"
        >
          <RoundSummaryField
            label="Initial Bags"
            value={team2Stats.startBags}
          />
          <RoundSummaryField label="Bags Taken" value={t2Derived.bagsTaken} />
          <RoundSummaryField
            label={
              (team2Stats.bagPenalty ?? 0) > 0 ? "Bag Result" : "Total Bags"
            }
            value={
              (team2Stats.bagPenalty ?? 0) > 0 && team2Stats.endBags === 0
                ? "Reset to 0"
                : (team2Stats.bagPenalty ?? 0) > 0
                  ? `Carryover: ${team2Stats.endBags}`
                  : team2Stats.endBags
            }
          />
        </Stack>
      </SharedSection>
    </Stack>
  );
}

export default RoundSummaryDrawer;
