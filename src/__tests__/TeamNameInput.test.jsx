import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TeamNameInput from '../components/forms/TeamNameInput';
import { Provider } from '../components/ui/provider';

describe('TeamNameInput Behavior', () => {
    const mockHandleChange = vi.fn();

    const renderComponent = () => {
        return render(
           <Provider>
            <TeamNameInput
                id="team1Name"
                teamClassName="team1"
                teamName="Team 1"
                handleChange={mockHandleChange}
            />
           </Provider>
        );
    };

    it('should select all text when input is focused (edit mode)', async () => {
        renderComponent();
        
        // Find the editable preview and click it to enter edit mode
        const preview = screen.getByText('Team 1');
        fireEvent.click(preview);

        // input should now be visible
        const input = screen.getByDisplayValue('Team 1'); // Assuming defaultValue populates this
        
        // We can't easily check "text selected" in JSDOM, but we can check if the prop is honored or if we can spy on select().
        // For Chakra's Editable, the `selectAllOnFocus` prop should exist on the Root.
        // We will simulate the behavior: if we check the logic, the input should be focused.
        
        // This test is tricky in JSDOM. "select all" usually means `selectionStart` is 0 and `selectionEnd` is length.
        // Let's verify that.
        expect(input.selectionStart).toBe(0);
        expect(input.selectionEnd).toBe(6); // "Team 1".length
    });

    it('should submit changes when clicking away (on blur)', async () => {
        renderComponent();
        
        // Enter edit mode
        fireEvent.click(screen.getByText('Team 1'));
        
        // Change value
        const input = screen.getByDisplayValue('Team 1');
        fireEvent.change(input, { target: { value: 'New Name' } });
        
        // Reset mock before blur
        mockHandleChange.mockClear();

        // Trigger blur
        fireEvent.blur(input);

        // Should have called handleChange
        expect(mockHandleChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({
                id: 'team1Name',
                value: 'New Name'
            })
        }));
    });
});
