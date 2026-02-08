import { TemplateRef } from '@angular/core';
import { ColumnFilterConfig } from './filter-config.model';

/**
 * Column configuration for data table
 * Generic type T represents the data model
 */
export interface ColumnConfig<T = any> {
    /** Property key from data model or custom string for computed columns */
    key: keyof T | string;

    /** Column header text */
    header: string;

    /** Enable sorting for this column */
    sortable?: boolean;

    /** 
     * Filter configuration for this column
     * Set to null or undefined to disable filtering
     */
    filter?: ColumnFilterConfig;

    /** Custom formatter function to transform cell value */
    formatter?: (value: any, row: T) => string | number;

    /** Custom template for cell rendering */
    cellTemplate?: TemplateRef<any>;

    /** Column width (CSS value) */
    width?: string;

    /** CSS class for column cells */
    cssClass?: string;

    /** Align text in column */
    align?: 'left' | 'center' | 'right';

    /** Hide column on mobile devices */
    hideOnMobile?: boolean;
}

/**
 * Row action configuration
 */
export interface TableAction<T = any> {
    /** Action label */
    label: string;

    /** Material icon name */
    icon?: string;

    /** Action handler function */
    action: (row: T) => void;

    /** Condition to show/enable action */
    condition?: (row: T) => boolean;

    /** Action button color */
    color?: 'primary' | 'accent' | 'warn' | 'default';

    /** Disable action */
    disabled?: (row: T) => boolean;
}

/**
 * Table configuration options
 */
export interface TableConfig {
    /** Enable global search */
    enableSearch?: boolean;

    /** Enable pagination */
    enablePagination?: boolean;

    /** Available page size options */
    pageSizeOptions?: number[];

    /** Default page size */
    defaultPageSize?: number;

    /** Enable row click */
    enableRowClick?: boolean;

    /** Enable row selection (checkboxes) */
    enableSelection?: boolean;

    /** Sticky header */
    stickyHeader?: boolean;

    /** Show row numbers */
    showRowNumbers?: boolean;

    /** Empty state message */
    emptyMessage?: string;

    /** Loading message */
    loadingMessage?: string;

    /** Enable column-level filters below headers */
    enableColumnFilters?: boolean;
}

/**
 * Filter configuration for a column
 */
export interface FilterConfig<T = any> {
    /** Column key to filter */
    columnKey: keyof T | string;

    /** Filter type */
    type: 'text' | 'select' | 'date' | 'number';

    /** Options for select filter */
    options?: Array<{ label: string; value: any }>;

    /** Custom filter function */
    filterFn?: (value: any, filterValue: any, row: T) => boolean;
}
