// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../../../client/src/components/PriorityBadge';

describe('PriorityBadge', () => {
    it('renders the correct label for low priority', () => {
        render(<PriorityBadge priority='low'/>);

        const badge = screen.getByText('Low');

        expect(badge).toBeDefined();
    });

    it('renders the correct label for medium priority', () => {
        render(<PriorityBadge priority='medium' />);

        const badge = screen.getByText('Medium');

        expect(badge).toBeDefined();
    });

    it('renders the correct label for high priority', () => {
        render(<PriorityBadge priority='high' />);

        const badge = screen.getByText('High');

        expect(badge).toBeDefined();
    });

    it('renders the correct label for critical priority', () => {
        render(<PriorityBadge priority='critical' />);

        const badge = screen.getByText('Critical');

        expect(badge).toBeDefined();
    });
});