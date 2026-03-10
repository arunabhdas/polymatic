import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple mock component to test the pipeline
const DemoHelloWorld = () => <div>Hello Test World</div>;

describe('Test Pipeline', () => {
  it('should render the component and pass the test', () => {
    render(<DemoHelloWorld />);
    expect(screen.getByText('Hello Test World')).toBeInTheDocument();
  });
});
