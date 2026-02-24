import { Text, Stack } from "../ui";
import { Radio, RadioGroup } from "../ui/radio";
import { HelpCircle } from "lucide-react";
import {
  HELPS_TEAM_BID,
  NO_BAGS_NO_HELP,
  TAKES_BAGS,
} from "../../helpers/utils/constants";
import { useLocalStorage } from "../../helpers/utils/hooks";

interface ScoreSettingProps {
  onOpenScoreHelp?: () => void;
}

function ScoreSetting({ onOpenScoreHelp }: ScoreSettingProps) {
  const [nilRule, setNilRule] = useLocalStorage("nilScoringRule", TAKES_BAGS);

  const handleClick = () => {
    if (onOpenScoreHelp) {
      onOpenScoreHelp();
    }
  };
  return (
    <div style={{ padding: "var(--app-spacing-1)" }}>
      <Text fontSize="lg" mt={3} mb={4}>
        Select your preferred scoring rules for failed nil.{" "}
        {
          <HelpCircle
            size={18}
            onClick={handleClick}
            data-testid="score-help-button"
            style={{
              cursor: "pointer",
              verticalAlign: "middle",
              marginLeft: "8px",
              display: "inline",
              position: "relative",
              top: "-2px",
            }}
          />
        }
      </Text>
      <RadioGroup
        onValueChange={(e: { value: string | null }) =>
          setNilRule(e.value || "")
        }
        value={nilRule}
      >
        <Stack alignItems="start">
          <Radio value={TAKES_BAGS}>Takes Bags</Radio>
          <Radio value={HELPS_TEAM_BID}>Helps Team Bid</Radio>
          <Radio value={NO_BAGS_NO_HELP}>No Bags/No Help</Radio>
        </Stack>
      </RadioGroup>
    </div>
  );
}

export default ScoreSetting;
