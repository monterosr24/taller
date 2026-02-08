/**
 * Filter type enumeration
 * Defines the available filter input types for columns
 */
export enum FilterType {
    /** Text input field */
    TEXT = 'text',
    /** Dropdown/Select input */
    SELECT = 'select',
    /** Date picker */
    DATE = 'date',
    /** Number input */
    NUMBER = 'number',
    /** No filter */
    NONE = 'none'
}

/**
 * Filter configuration for a column
 * Defines how filtering should work for a specific column
 */
export interface ColumnFilterConfig {
    /** Type of filter input to display */
    type: FilterType;

    /** Placeholder text for the filter input */
    placeholder?: string;

    /** Options for SELECT type filters */
    options?: FilterOption[];

    /** Custom filter function for advanced filtering logic */
    customFilterFn?: (cellValue: any, filterValue: any) => boolean;
}

/**
 * Option for SELECT type filters
 */
export interface FilterOption {
    /** Display label */
    label: string;

    /** Value to filter by */
    value: any;
}
