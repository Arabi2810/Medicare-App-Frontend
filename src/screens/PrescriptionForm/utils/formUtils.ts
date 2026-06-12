/**
 * Utility functions for prescription form rendering
 */

/**
 * Filter out null values from objects and arrays
 */
export const filterNullValues = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.filter(item => item !== null);
    }
    if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {} as any);
    }
    return obj;
};

/**
 * Format label (convert camelCase to Title Case)
 */
export const formatLabel = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
};

/**
 * Get icon for section based on key
 */
export const getSectionIcon = (key: string): string => {
    const iconMap: { [key: string]: string } = {
        patient: '🩺',
        doctor: '👨‍⚕️',
        medicines: '💊',
        symptoms: '📋',
        diagnosis: '🔬',
        tests: '🧪',
        notes: '📝',
    };
    return iconMap[key] || '';
};

/**
 * Get dosage value combining name and dosage
 */
export const getDosageValue = (item: any): string | null => {
    if ('dosage' in item && 'name' in item && item.dosage !== null) {
        return `${item.name} (${item.dosage})`;
    }
    return null;
};

/**
 * Check if value is array of objects
 */
export const isArrayOfObjects = (value: any): boolean => {
    return Array.isArray(value) && value.length > 0 && typeof value[0] === 'object';
};

/**
 * Check if value is array of strings
 */
export const isArrayOfStrings = (value: any): boolean => {
    return Array.isArray(value) && value.length > 0 && typeof value[0] === 'string';
};

/**
 * Check if field should be skipped
 */
export const shouldSkipField = (key: string): boolean => {
    const skipFields = [
        'ocrText', 'isCurrent', 'imageUrl',
        '_id', '__v', 'id', 'userId', 'user_id',
        'status', 'processingStatus', 'isComplete', 'completedAt',
        'uploadedAt', 'parsedAt', 'createdAt', 'updatedAt',
    ];
    return skipFields.includes(key);
};
