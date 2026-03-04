import React from 'react';
import styles from './Input.module.css';

export type InputStatus = 'default' | 'error' | 'success';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  status?: InputStatus;
  size?: InputSize;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      helperText,
      errorText,
      status = 'default',
      size = 'md',
      prefix,
      suffix,
      required,
      id,
      className,
      ...rest
    },
    ref
  ) {
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const rootClasses = [
      styles.root,
      styles[size],
      status !== 'default' ? styles[status] : '',
      prefix ? styles.hasPrefix : '',
      suffix ? styles.hasSuffix : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={rootClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {prefix && (
            <span className={styles.prefix} aria-hidden="true">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={status === 'error'}
            aria-describedby={
              errorText
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            required={required}
            {...rest}
          />

          {suffix && (
            <span className={styles.suffix} aria-hidden="true">
              {suffix}
            </span>
          )}
        </div>

        {/* error takes priority over helper text */}
        {status === 'error' && errorText && (
          <span id={`${inputId}-error`} className={styles.errorText} role="alert">
            {errorText}
          </span>
        )}

        {helperText && status !== 'error' && (
          <span id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

export default Input;