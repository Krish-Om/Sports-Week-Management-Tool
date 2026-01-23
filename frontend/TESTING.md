# Testing Guide

This document outlines the testing setup and practices for the Sports Week Management Tool frontend.

## Setup

### Testing Framework
- **Vitest** - Fast unit test framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers

### Installation

```bash
cd frontend
bun install vitest @testing-library/react @testing-library/jest-dom happy-dom
```

### Configuration

The testing setup is configured in:
- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Global test setup
- `src/test/test-utils.tsx` - Custom render function with providers

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/__tests__/components/Skeleton.test.tsx

# Run tests with coverage
bun test --coverage
```

## Test Structure

Tests are organized in `src/__tests__/` following the source structure:

```
__tests__/
├── components/      # Component tests
├── hooks/          # Hook tests
├── pages/          # Page tests
└── utils/          # Utility tests
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    renderWithProviders(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### Using renderWithProviders

The `renderWithProviders` helper automatically wraps components with:
- BrowserRouter
- AuthProvider
- SocketProvider
- ToastProvider

```typescript
import { renderWithProviders, screen } from '../test-utils';

renderWithProviders(<MyComponent />);
```

### Common Testing Patterns

#### Testing Component Render
```typescript
it('should render component', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Expected')).toBeInTheDocument();
});
```

#### Testing User Input
```typescript
it('should update on user input', () => {
  renderWithProviders(<InputComponent />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'new value' } });
  expect(input).toHaveValue('new value');
});
```

#### Testing Async Operations
```typescript
it('should load data', async () => {
  renderWithProviders(<DataComponent />);
  const element = await screen.findByText('Data Loaded');
  expect(element).toBeInTheDocument();
});
```

#### Testing Conditional Rendering
```typescript
it('should show error state', () => {
  renderWithProviders(<Component error={true} />);
  expect(screen.getByText('Error Message')).toBeInTheDocument();
});
```

## Test Coverage Goals

- **Components**: 80%+ coverage
- **Hooks**: 85%+ coverage
- **Utils**: 90%+ coverage
- **Pages**: 70%+ coverage (complex navigation logic excluded)

## Best Practices

1. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
2. **Test behavior, not implementation**: Focus on what users see and do
3. **Keep tests focused**: One test per behavior
4. **Use descriptive names**: Test names should clearly describe what is tested
5. **Avoid testing implementation details**: Don't test internal state or structure
6. **Mock external dependencies**: Mock API calls, WebSockets, etc.
7. **Clean up after tests**: Use `afterEach` for cleanup

## Mocking

### Mocking API Calls
```typescript
import { vi } from 'vitest';

vi.mock('../../config/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: { data: [] } })),
  },
}));
```

### Mocking Hooks
```typescript
import { vi } from 'vitest';
import * as AuthContext from '../../contexts/AuthContext';

vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
  user: { id: '1', username: 'test' },
  // ... other values
});
```

## Debugging Tests

### Print DOM Elements
```typescript
import { screen, debug } from '@testing-library/react';

debug(); // Print entire DOM
debug(screen.getByRole('button')); // Print specific element
```

### Use screen.logTestingPlaygroundURL
```typescript
import { screen } from '@testing-library/react';

screen.logTestingPlaygroundURL(); // Get interactive query suggestions
```

### Visual Debugging
```typescript
import { screen } from '@testing-library/react';

console.log(screen.getByRole('button').outerHTML);
```

## CI/CD Integration

Tests should be run as part of CI/CD pipeline:

```yaml
- name: Run tests
  run: bun test

- name: Generate coverage
  run: bun test --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
