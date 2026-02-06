/**
 * Utility functions to convert between camelCase and snake_case
 * Used to maintain consistent naming conventions between frontend (camelCase)
 * and database (snake_case)
 */

/**
 * Converts a camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Converts a snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts an object's keys from camelCase to snake_case
 * Handles nested objects and arrays
 */
export function toSnakeCase<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (obj instanceof Date) {
        return obj as any;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => toSnakeCase(item)) as any;
    }

    if (typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const snakeKey = camelToSnake(key);
                result[snakeKey] = toSnakeCase(obj[key]);
            }
        }
        return result;
    }

    return obj;
}

/**
 * Converts an object's keys from snake_case to camelCase
 * Handles nested objects and arrays
 */
export function toCamelCase<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (obj instanceof Date) {
        return obj as any;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item)) as any;
    }

    if (typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const camelKey = snakeToCamel(key);
                result[camelKey] = toCamelCase(obj[key]);
            }
        }
        return result;
    }

    return obj;
}
