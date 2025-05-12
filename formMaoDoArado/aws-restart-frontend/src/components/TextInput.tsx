import { ChangeEvent } from 'react';

interface TextInputProps {
    id: string;
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function TextInput({
                                      id,
                                      label,
                                      name,
                                      type = 'text',
                                      value,
                                      onChange,
                                      placeholder = '',
                                      disabled = false,
                                  }: TextInputProps) {
    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                disabled={disabled}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
            />
        </div>
    );
}
