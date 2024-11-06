import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dropdown from '../../src/components/Dropdown';

describe('Dropdown Component', () => {
  const mockItems = [
    { id: 'item-1', name: 'Item 1', color: '#FF0000', onSelect: vi.fn() },
    { id: 'item-2', name: 'Item 2', color: '#00FF00', onSelect: vi.fn() },
    { id: 'item-3', name: 'Item 3', color: '#0000FF', onSelect: vi.fn() },
  ];

  it('should render the selected item by default', () => {
    render(<Dropdown items={mockItems} />);
    const selectedItem = screen.getByText('Item 1');
    expect(selectedItem).toBeInTheDocument();
    expect(selectedItem).toHaveStyle({ color: '#FF0000' });
  });

  it('should toggle the dropdown menu visibility when clicked', () => {
    render(<Dropdown items={mockItems} />);
    const selectedItem = screen.getByText('Item 1');

    // Initially, the dropdown items should not be visible
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    // Click to open the dropdown
    fireEvent.click(selectedItem);
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    // Click again to close the dropdown
    fireEvent.click(selectedItem);
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('should select an item, call onSelect, and close the dropdown', () => {
    render(<Dropdown items={mockItems} />);
    const selectedItem = screen.getByText('Item 1');

    // Open the dropdown
    fireEvent.click(selectedItem);

    // Select the second item
    const itemToSelect = screen.getByText('Item 2');
    fireEvent.click(itemToSelect);

    // Verify the selected item has changed
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(mockItems[1].onSelect).toHaveBeenCalledTimes(1);

    // Dropdown menu should be closed after selection
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('should close the dropdown when clicking outside', () => {
    render(
      <div>
        <Dropdown items={mockItems} />
        <div data-testid="outside">Outside Element</div>
      </div>
    );

    const selectedItem = screen.getByText('Item 1');

    // Open the dropdown
    fireEvent.click(selectedItem);
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });
});
