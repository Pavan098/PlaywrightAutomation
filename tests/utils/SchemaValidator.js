/**
 * Lightweight JSON schema validator — no external dependencies.
 *
 * Schema field rules:
 *   required: boolean   — field must be present (not undefined)
 *   type: string        — 'string' | 'number' | 'boolean' | 'object' | 'array'
 *   nullable: boolean   — allow null values even when required
 *   minLength: number   — minimum string length
 *   min: number         — minimum numeric value
 */

function validateSchema(data, schema, path = '') {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
        const fullPath = path ? `${path}.${field}` : field;
        const value = data[field];

        if (value === undefined || value === null) {
            if (rules.required && !rules.nullable) {
                errors.push(`[MISSING] ${fullPath} is required`);
            }
            continue;
        }

        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (rules.type && actualType !== rules.type) {
            errors.push(`[TYPE] ${fullPath}: expected ${rules.type}, got ${actualType}`);
        }

        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
            errors.push(`[LENGTH] ${fullPath}: length ${value.length} < minLength ${rules.minLength}`);
        }

        if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
            errors.push(`[VALUE] ${fullPath}: ${value} < min ${rules.min}`);
        }

        if (rules.type === 'array' && rules.items && Array.isArray(value) && value.length > 0) {
            const itemErrors = validateSchema(value[0], rules.items, `${fullPath}[0]`);
            errors.push(...itemErrors);
        }

        if (rules.type === 'object' && rules.properties && value && typeof value === 'object') {
            const nestedErrors = validateSchema(value, rules.properties, fullPath);
            errors.push(...nestedErrors);
        }
    }

    return errors;
}

/**
 * Assert that data matches schema — throws with a readable error list if not.
 * Use inside a Playwright test: assertSchema(responseBody, mySchema)
 */
function assertSchema(data, schema, label = 'Response') {
    const errors = validateSchema(data, schema);
    if (errors.length > 0) {
        throw new Error(`${label} schema validation failed:\n  ${errors.join('\n  ')}`);
    }
}

module.exports = { validateSchema, assertSchema };
