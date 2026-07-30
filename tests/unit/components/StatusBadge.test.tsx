// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../../client/src/components/StatusBadge';

describe('StatusBadge', () => {
    it('renders the correct label for open status', () => {
        render(<StatusBadge status='open' />);

        const badge = screen.getByText('Open');

        expect(badge).toBeDefined();
    });

    it('renders the correct label for in_progress status', () => {
        render(<StatusBadge status='in_progress' />);

        const badge = screen.getByText('In Progress');

        expect(badge).toBeDefined();
    });

    it('renders the correct label for resolved status', () => {
        render(<StatusBadge status='resolved' />);

        const badge = screen.getByText('Resolved');

        expect(badge).toBeDefined();
    });

    it('renders the correct label for closed status', () => {
        render(<StatusBadge status='closed' />);

        const badge = screen.getByText('Closed');

        expect(badge).toBeDefined();
    });
});