import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../../../client/src/components/PriorityBadge';

describe('PriorityBadge', () => {
    it('renders the correct label for low priority', () => {
        render(<PriorityBadge priority="low"/>);

        const badge = screen.getByText('Low');

        expect(badge).toBeDefined();
    });
});