import { Center, Heading, Flex, Box } from "../ui";
import { team1Styles, team2Styles } from "../../helpers/utils/constants";

interface RoundHeadingProps {
  roundNumber: number;
  names: {
    team1Name: string;
    team2Name: string;
  };
}

function RoundHeading({ roundNumber, names }: RoundHeadingProps) {
  return (
    <div>
      <Heading style={{ fontSize: "var(--app-font-2xl)" }} as={"h3"}>
        Round {roundNumber}
      </Heading>
      <Box mb={"8px"}>
        <Flex direction={"row"} height={"30px"}>
          <Box
            width={"100%"}
            borderBottom={"1px solid gray"}
            mr={"5px"}
            ml={"5px"}
          >
            <Center style={team1Styles}>
              <Heading style={{ fontSize: "15px" }}>{names.team1Name}</Heading>
            </Center>
          </Box>
          <Box
            width={"100%"}
            borderBottom={"1px solid gray"}
            mr={"5px"}
            ml={"5px"}
          >
            <Center style={team2Styles}>
              <Heading style={{ fontSize: "15px" }}>{names.team2Name}</Heading>
            </Center>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default RoundHeading;
