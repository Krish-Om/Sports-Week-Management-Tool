import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: string | boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: any) => string | true;
  custom?: (value: any, data: any) => string | true;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormValues {
  [key: string]: any;
}

interface UseFormProps {
  initialValues: FormValues;
  validationRules?: { [key: string]: ValidationRule };
  onSubmit?: (values: FormValues) => Promise<void> | void;
}

/**
 * Custom hook for form management and validation
 */
export const useForm = ({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormProps) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (fieldName: string, fieldValue: any) => {
      const rules = validationRules[fieldName];
      if (!rules) return '';

      // Required validation
      if (rules.required) {
        if (
          !fieldValue ||
          (typeof fieldValue === 'string' && fieldValue.trim() === '')
        ) {
          return typeof rules.required === 'string'
            ? rules.required
            : `${fieldName} is required`;
        }
      }

      // Min length validation
      if (rules.minLength && fieldValue) {
        if (fieldValue.length < rules.minLength.value) {
          return rules.minLength.message;
        }
      }

      // Max length validation
      if (rules.maxLength && fieldValue) {
        if (fieldValue.length > rules.maxLength.value) {
          return rules.maxLength.message;
        }
      }

      // Pattern validation
      if (rules.pattern && fieldValue) {
        if (!rules.pattern.value.test(fieldValue)) {
          return rules.pattern.message;
        }
      }

      // Custom validation
      if (rules.validate) {
        const result = rules.validate(fieldValue);
        if (result !== true) return result;
      }

      // Custom validation with all form data
      if (rules.custom) {
        const result = rules.custom(fieldValue, values);
        if (result !== true) return result;
      }

      return '';
    },
    [validationRules, values]
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, values, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue =
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Real-time validation if field has been touched
      if (touched[name]) {
        const error = validateField(name, fieldValue);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField, values]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, values, onSubmit]
  );

  /**
   * Set form values programmatically
   */
  const setFormValues = useCallback((newValues: Partial<FormValues>) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Set field error
   */
  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
    resetForm,
    setFieldError,
    validateField,
    validateForm,
  };
};

/**
 * Pre-built validation rules
 */
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]*$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
};

/**
 * Pre-built validation rules factory
 */
export const createValidationRules = () => ({
  email: (message = 'Invalid email address'): ValidationRule => ({
    required: 'Email is required',
    pattern: { value: validationPatterns.email, message },
  }),

  password: (message = 'Password must be at least 8 characters with uppercase, lowercase, number and special character'): ValidationRule => ({
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    pattern: { value: validationPatterns.password, message },
  }),

  username: (message = 'Username must be 3-20 characters, alphanumeric with _ or -'): ValidationRule => ({
    required: 'Username is required',
    pattern: { value: validationPatterns.username, message },
  }),

  phone: (message = 'Phone number must be at least 10 digits'): ValidationRule => ({
    required: 'Phone number is required',
    pattern: { value: validationPatterns.phone, message },
  }),

  url: (message = 'Invalid URL'): ValidationRule => ({
    required: 'URL is required',
    pattern: { value: validationPatterns.url, message },
  }),

  required: (fieldName: string): ValidationRule => ({
    required: `${fieldName} is required`,
  }),

  minLength: (length: number, fieldName = 'Field'): ValidationRule => ({
    minLength: { value: length, message: `${fieldName} must be at least ${length} characters` },
  }),

  maxLength: (length: number, fieldName = 'Field'): ValidationRule => ({
    maxLength: { value: length, message: `${fieldName} must not exceed ${length} characters` },
  }),
});
