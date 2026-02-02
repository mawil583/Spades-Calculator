import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from '../../components/ui/provider';
import DealerTag from '../../components/ui/DealerTag';
import { GlobalContext } from '../../helpers/context/GlobalContext';

// Mock dependencies
jest.mock('../../helpers/math/spadesMath', () => ({
  getDealerIdHistory: jest.fn(() => []),
  getCurrentDealerId: jest.fn(() => 'p1'),
}));

// Mock Dialog components to force bubbling (remove Chakra/Portal magic for test)
jest.mock('../../components/ui/dialog', () => ({
    DialogRoot: ({ children, open }) => open ? <div>{children}</div> : null,
    DialogBackdrop: () => <div>Backdrop</div>,
    DialogContent: ({ children, ...props }) => (
        <div data-testid="dialog-content" {...props} onClick={props.onClick}>
            {children}
        </div>
    ),
    DialogCloseTrigger: ({ children, ...props }) => (
        <button aria-label="Close" {...props}>
            {children}
        </button>
    ), // Basic button bubbles
    DialogHeader: ({ children }) => <div>{children}</div>,
    DialogBody: ({ children }) => <div>{children}</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() =>
    JSON.stringify({ t1p1Name: 'Player 1', t1p2Name: 'Player 2', t2p1Name: 'Player 3', t2p2Name: 'Player 4' })
  ),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Modal Propagation Bug', () => {
    it('should NOT propagate clicks from the modal close button to the parent container', async () => {
        const handleParentClick = jest.fn();
        const setDealerOverride = jest.fn();
        
        const mockContext = {
            firstDealerOrder: ['p1'],
            currentRound: {},
            setDealerOverride,
        };

        // Mimic structure: TablePlayerInput (onClick) -> DealerTag -> DealerSelectionModal -> CloseButton
        render(
            <Provider>
                <GlobalContext.Provider value={mockContext}>
                    <div data-testid="parent-container" onClick={handleParentClick}>
                        <DealerTag 
                            id="p1" 
                            index={0} 
                            isCurrent={true} 
                            roundHistory={[]} 
                        />
                    </div>
                </GlobalContext.Provider>
            </Provider>
        );

        // 1. Open Modal
        const dealerBadge = screen.getByTestId('dealerBadge');
        fireEvent.click(dealerBadge);

        // Verify Modal is Open
        expect(await screen.findByText('Select the dealer')).toBeInTheDocument();

        // 2. Click Close Button (X)
        // Chakra CloseButton usually has aria-label="Close"
        const closeButton = screen.getByLabelText('Close');
        
        // We use fireEvent.click. In a real browser/React, this bubbles from Portal -> Parent component.
        // RTL renders into a container, but React event system handles bubbling.
        fireEvent.click(closeButton);

        // 3. Assert Parent Handler was NOT called
        // If bug exists, this might fail (it will be called)
        expect(handleParentClick).not.toHaveBeenCalled(); 
    });
});
