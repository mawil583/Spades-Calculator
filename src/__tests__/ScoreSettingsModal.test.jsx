import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ScoreSettingsModal } from '../components/modals';

const renderWithChakra = (component) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('ScoreSettingsModal', () => {
  it('renders examples without NaN values for score or bags', () => {
    renderWithChakra(
      <ScoreSettingsModal isOpen={true} setIsModalOpen={() => {}} />
    );

    // Find all Score: and Bags: fields
    const scoreLabels = screen.getAllByText(/Score:/i);
    const bagLabels = screen.getAllByText(/Bags:/i);

    // Ensure at least one example rendered
    expect(scoreLabels.length).toBeGreaterThan(0);
    expect(bagLabels.length).toBeGreaterThan(0);

    // Ensure no NaN is rendered next to Score or Bags
    const modalText = screen.getByText('Score Settings').closest('div');
    const textContent = modalText?.textContent || '';
    expect(textContent).not.toMatch(/NaN/);
  });

  it('renders all sections with visible content (not blank)', () => {
    renderWithChakra(
      <ScoreSettingsModal isOpen={true} setIsModalOpen={() => {}} />
    );

    // Section headings should exist
    expect(screen.getByText('Takes Bags')).toBeInTheDocument();
    expect(screen.getByText('Helps Team Bid')).toBeInTheDocument();
    expect(screen.getByText('No Bags / No Help')).toBeInTheDocument();

    // There should be multiple examples rendered overall
    // Count how many "Score:" labels exist — should be >= 7 based on the examples provided
    const scores = screen.getAllByText(/Score:/i);
    expect(scores.length).toBeGreaterThanOrEqual(7);

    // Ensure we show teammate labels and input labels, indicating the grid is populated
    expect(screen.getAllByText('Teammate 1').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('Teammate 2').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(/Bid:/).length).toBeGreaterThanOrEqual(7 * 2);
    expect(screen.getAllByText(/Made:/).length).toBeGreaterThanOrEqual(7 * 2);
  });
});
