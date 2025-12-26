import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

export interface MultiSelectOption {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: (string | MultiSelectOption)[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selected,
    onChange,
    placeholder = 'Select...',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Normalize options to { label, value } format
    const normalizedOptions: MultiSelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    const toggleOption = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const removeOption = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selected.filter((item) => item !== value));
    };

    const getLabel = (value: string) => {
        const opt = normalizedOptions.find(o => o.value === value);
        return opt ? opt.label : value;
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div
                className="min-h-[38px] w-full px-2 py-1 bg-white border border-slate-300 rounded text-sm focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer flex items-center justify-between gap-2"
                onClick={() => setIsOpen(!isOpen)}
                title={selected.map(getLabel).join(', ')}
            >
                <div className="flex flex-wrap gap-1 flex-1">
                    {selected.length === 0 ? (
                        <span className="text-slate-500 px-1">{placeholder}</span>
                    ) : (
                        selected.map((value) => (
                            <span
                                key={value}
                                className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                            >
                                {getLabel(value)}
                                <X
                                    size={12}
                                    className="hover:text-indigo-900 cursor-pointer"
                                    onClick={(e) => removeOption(value, e)}
                                />
                            </span>
                        ))
                    )}
                </div>
                <ChevronDown size={16} className="text-slate-400 shrink-0" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {normalizedOptions.map((option) => (
                        <div
                            key={option.value}
                            className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-sm text-slate-700"
                            onClick={() => toggleOption(option.value)}
                        >
                            <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected.includes(option.value)
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'border-slate-300'
                                    }`}
                            >
                                {selected.includes(option.value) && <Check size={12} className="text-white" />}
                            </div>
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
