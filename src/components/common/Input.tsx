import { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
}

export default function Input({
    label,
    error,
    icon,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputClasses = [
        styles.input,
        error ? styles.inputError : '',
        icon ? styles.inputWithIcon : '',
        className
    ].join(' ');

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                {icon && <div className={styles.icon}>{icon}</div>}
                <input id={id} className={inputClasses} {...props} />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
}
