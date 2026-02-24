import { Text, Stack, Box } from "../ui";
import { Switch } from "../ui/switch";
import { useFeatureFlag } from "../../helpers/utils/useFeatureFlag";
import { FEATURE_FLAGS } from "../../helpers/utils/featureFlags";

function UIModeSetting() {
  const [useTableUI, toggleTableUI] = useFeatureFlag(
    FEATURE_FLAGS.TABLE_ROUND_UI,
  );

  return (
    <Box mt={4} p={1}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        UI Mode
      </Text>
      <Stack direction="row" alignItems="center">
        <Switch checked={useTableUI} onCheckedChange={toggleTableUI} />
        <Text ml={3} fontSize="md" color="gray.200">
          {useTableUI ? "Table Layout" : "Classic Layout"}
        </Text>
      </Stack>
    </Box>
  );
}

export default UIModeSetting;
