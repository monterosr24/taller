import { Component, Input, Output, EventEmitter, OnInit, ViewChild, TemplateRef, ContentChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ColumnConfig, TableAction, TableConfig } from './models/table-config.model';
import { FilterType } from './models/filter-config.model';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.css']
})
export class DataTableComponent<T = any> implements OnInit {
    // Inputs (touched for recompile)
    @Input() data: T[] = [];
    @Input() columns: ColumnConfig<T>[] = [];
    @Input() actions: TableAction<T>[] = [];
    @Input() config: TableConfig = {};
    @Input() loading = false;

    // Outputs
    @Output() rowClick = new EventEmitter<T>();
    @Output() selectionChange = new EventEmitter<T[]>();
    @Output() pageChange = new EventEmitter<PageEvent>();
    @Output() sortChange = new EventEmitter<Sort>();

    // ViewChildren
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // Data source
    dataSource: MatTableDataSource<T>;
    displayedColumns: string[] = [];
    selectedRows: Set<T> = new Set();
    searchValue = '';
    columnFilters: Map<string, string> = new Map(); // Track column-specific filters

    // Expose FilterType enum to template
    readonly FilterType = FilterType;

    // Configuration with defaults
    tableConfig: Required<TableConfig> = {
        enableSearch: true,
        enablePagination: true,
        pageSizeOptions: [10, 25, 50, 100],
        defaultPageSize: 10,
        enableRowClick: false,
        enableSelection: false,
        stickyHeader: true,
        showRowNumbers: false,
        emptyMessage: 'No data available',
        loadingMessage: 'Loading...',
        enableColumnFilters: false
    };

    constructor() {
        this.dataSource = new MatTableDataSource<T>([]);
    }

    ngOnInit(): void {
        // Merge user config with defaults
        this.tableConfig = { ...this.tableConfig, ...this.config };

        // Setup displayed columns
        this.setupColumns();

        // Initialize data source
        this.dataSource.data = this.data;

        // Setup custom filter
        this.dataSource.filterPredicate = this.createFilterPredicate();
    }

    ngAfterViewInit(): void {
        if (this.tableConfig.enablePagination) {
            this.dataSource.paginator = this.paginator;
        }
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(): void {
        if (this.dataSource) {
            this.dataSource.data = this.data;
        }
    }

    private setupColumns(): void {
        this.displayedColumns = [];

        if (this.tableConfig.enableSelection) {
            this.displayedColumns.push('select');
        }

        if (this.tableConfig.showRowNumbers) {
            this.displayedColumns.push('rowNumber');
        }

        this.displayedColumns.push(...this.columns.map(col => String(col.key)));

        if (this.actions.length > 0) {
            this.displayedColumns.push('actions');
        }
    }

    private createFilterPredicate(): (data: T, filter: string) => boolean {
        return (data: T, filter: string): boolean => {
            // If no filters are active, show all rows
            if (this.columnFilters.size === 0) {
                return true;
            }

            // Column-specific filtering - all active filters must match (AND logic)
            for (const [columnKey, filterValue] of this.columnFilters.entries()) {
                if (!filterValue) continue;

                const column = this.columns.find(col => String(col.key) === columnKey);
                if (!column) continue;

                const cellValue = this.getCellValue(data, column);
                const cellValueStr = String(cellValue || '').toLowerCase();
                const filterValueStr = filterValue.toLowerCase();

                if (!cellValueStr.includes(filterValueStr)) {
                    return false;
                }
            }

            return true;
        };
    }

    getCellValue(row: T, column: ColumnConfig<T>): any {
        const key = column.key as keyof T;
        const rawValue = row[key];

        if (column.formatter) {
            return column.formatter(rawValue, row);
        }

        return rawValue;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchValue = filterValue;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    clearFilter(): void {
        this.searchValue = '';
        this.dataSource.filter = '';
    }

    applyColumnFilter(columnKey: string, filterValue: string): void {
        if (filterValue) {
            this.columnFilters.set(columnKey, filterValue);
        } else {
            this.columnFilters.delete(columnKey);
        }

        // Trigger filter update
        this.dataSource.filter = Math.random().toString();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    clearColumnFilters(): void {
        this.columnFilters.clear();
        this.dataSource.filter = '';
    }

    onRowClick(row: T): void {
        if (this.tableConfig.enableRowClick) {
            this.rowClick.emit(row);
        }
    }

    onSortChange(sort: Sort): void {
        this.sortChange.emit(sort);
    }

    onPageChange(event: PageEvent): void {
        this.pageChange.emit(event);
    }

    isRowSelected(row: T): boolean {
        return this.selectedRows.has(row);
    }

    toggleRowSelection(row: T): void {
        if (this.selectedRows.has(row)) {
            this.selectedRows.delete(row);
        } else {
            this.selectedRows.add(row);
        }
        this.selectionChange.emit(Array.from(this.selectedRows));
    }

    toggleAllRows(): void {
        if (this.isAllSelected()) {
            this.selectedRows.clear();
        } else {
            this.dataSource.data.forEach(row => this.selectedRows.add(row));
        }
        this.selectionChange.emit(Array.from(this.selectedRows));
    }

    isAllSelected(): boolean {
        return this.selectedRows.size === this.dataSource.data.length;
    }

    isActionVisible(action: TableAction<T>, row: T): boolean {
        return action.condition ? action.condition(row) : true;
    }

    isActionDisabled(action: TableAction<T>, row: T): boolean {
        return action.disabled ? action.disabled(row) : false;
    }

    executeAction(action: TableAction<T>, row: T, event: Event): void {
        event.stopPropagation();
        action.action(row);
    }

    getColumnCssClass(column: ColumnConfig<T>): string {
        const classes: string[] = [];

        if (column.cssClass) {
            classes.push(column.cssClass);
        }

        if (column.align) {
            classes.push(`text-${column.align}`);
        }

        if (column.hideOnMobile) {
            classes.push('hide-mobile');
        }

        return classes.join(' ');
    }
}
