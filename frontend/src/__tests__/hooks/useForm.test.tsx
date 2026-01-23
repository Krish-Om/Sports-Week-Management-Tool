import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import { useForm, createValidationRules } from '../../hooks/useForm';

describe('useForm Hook', () => {
  it('should initialize form with initial values', () => {
    const Component = () => {
      const { values } = useForm({
        initialValues: { email: '', password: '' },
      });

      return (
        <div>
          <span data-testid="email">{values.email}</span>
          <span data-testid="password">{values.password}</span>
        </div>
      );
    };

    renderWithProviders(<Component />);
    expect(screen.getByTestId('email')).toHaveTextContent('');
    expect(screen.getByTestId('password')).toHaveTextContent('');
  });

  it('should handle form value changes', () => {
    const Component = () => {
      const { values, handleChange } = useForm({
        initialValues: { email: '' },
      });

      return (
        <div>
          <input
            data-testid="email-input"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          <span data-testid="email-value">{values.email}</span>
        </div>
      );
    };

    renderWithProviders(<Component />);
    const input = screen.getByTestId('email-input') as HTMLInputElement;
    
    expect(input.value).toBe('');
  });

  it('should validate required fields', () => {
    const validationRules = createValidationRules();
    const Component = () => {
      const { errors, validateForm } = useForm({
        initialValues: { email: '' },
        validationRules: {
          email: validationRules.email(),
        },
      });

      return (
        <div>
          <button onClick={() => validateForm()}>Validate</button>
          <span data-testid="error">{errors.email}</span>
        </div>
      );
    };

    renderWithProviders(<Component />);
    const button = screen.getByRole('button');
    button.click();
    
    expect(screen.getByTestId('error')).toHaveTextContent('Email is required');
  });

  it('should reset form to initial values', () => {
    const Component = () => {
      const { values, handleChange, resetForm, setFormValues } = useForm({
        initialValues: { email: 'test@test.com' },
      });

      return (
        <div>
          <input
            data-testid="email-input"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          <button onClick={() => setFormValues({ email: 'changed@test.com' })}>
            Change
          </button>
          <button onClick={resetForm}>Reset</button>
          <span data-testid="email-value">{values.email}</span>
        </div>
      );
    };

    renderWithProviders(<Component />);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    
    resetButton.click();
    expect(screen.getByTestId('email-value')).toHaveTextContent('test@test.com');
  });
});
