import { useState } from 'react';
import { SimpleGrid, Center, Heading, IconButton, Stack } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RoundSummaryDrawer from './RoundSummaryDrawer';
import { team1Styles, team2Styles } from '../../helpers/utils/constants';
import RoundSummaryField from './RoundSummaryField';

function RoundSummary({
  roundNumber,
  team1RoundScore,
  team2RoundScore,
  team1RoundBags,
  team2RoundBags,
  team1Stats,
  team2Stats,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: 'var(--app-spacing-5)' }}>
      <Center>
        <Heading style={{ marginTop: 'var(--app-spacing-2)', marginBottom: 'var(--app-spacing-3)' }} size={'lg'}>
          Round Summary
        </Heading>
      </Center>
      
      <SimpleGrid columns={2} width="full" mb="var(--app-spacing-4)">
        <Stack style={team1Styles} alignItems="center" gap="var(--app-spacing-4)">
          <RoundSummaryField 
            label={`Round ${roundNumber} Score`} 
            value={team1RoundScore} 
          />
          <RoundSummaryField 
            label={`Round ${roundNumber} Bags`} 
            value={team1RoundBags} 
          />
        </Stack>
        <Stack style={team2Styles} alignItems="center" gap="var(--app-spacing-4)">
          <RoundSummaryField 
            label={`Round ${roundNumber} Score`} 
            value={team2RoundScore} 
          />
          <RoundSummaryField 
            label={`Round ${roundNumber} Bags`} 
            value={team2RoundBags} 
          />
        </Stack>
      </SimpleGrid>

      {(team1Stats && team2Stats) && (
        <>
          <Center mt="-12px" position="relative" zIndex="1">
            <IconButton
              aria-label="Toggle details"
              onClick={() => setIsOpen(!isOpen)}
              rounded="full"
              width="24px"
              height="24px"
              minW="0"
              p="var(--app-spacing-0)"
              variant="outline"
              bg="bg"
              borderColor="white"
              color="white"
              _hover={{ bg: 'gray.700' }}
            >
              {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </IconButton>
          </Center>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <RoundSummaryDrawer team1Stats={team1Stats} team2Stats={team2Stats} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default RoundSummary;
