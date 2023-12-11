import isNumber from 'is-number';

/**
 * @requires isNumber
 * Convert number to string with a given minimum length and fill with leading zeros
 * @param {number} number Input number
 * @param {number} [length = 2] Minimum length
 * @return {string} Number as string with leading zeros
 */
function zeroFiller(number: number, length: number = 2): string {
    if (!isNumber(number) || !isNumber(length)) return String(number);
    let numberAsString: string = number.toString();
    while (numberAsString.length < length) numberAsString = '0' + numberAsString;
    return numberAsString;
}

/**
 * @typedef Directive
 * @property {string} pattern
 * @property {string} value
 */
interface Directive {
    pattern: string;
    value: string | number;
}

/**
 * Returns the date as string with the given format and with the given local. Allows you to add custom directives.
 * @requires zeroFiller
 * @param {Date} date - date
 * @param {string} format - date format template
 * @param {string} [locales = 'default'] - locale identifier
 * @param {Directive[]} [directives = []] - directives array
 * @return {string} formatted date
 */
function strftime(
    date: Date,
    format: string,
    locales: string = 'default',
    directives: Directive[] = []
): string {
    const standard_directives: Array<Directive> = [
        { pattern: '%%', value: '%' },
        {
            pattern: '%a',
            value: date.toLocaleString(locales, { weekday: 'short' }),
        },
        { pattern: '%A', value: date.toLocaleString(locales, { weekday: 'long' }) },
        { pattern: '%w', value: date.getDay() },
        { pattern: '%d', value: date.format("dd") },
        { pattern: '%b', value: date.toDateString().slice(4,7) },
        { pattern: '%B', value: date.toLocaleString(locales, { month: 'long' }) },
        {
            pattern: '%m',
            value: date.format("MM"),
        },
        { pattern: '%y', value: date.format("YY") },
        { pattern: '%Y', value: date.format("YYYY") },
        { pattern: '%H', value: zeroFiller(date.getHours(), 2) },
        {
            pattern: '%I',
            value: date.format("ii"),
        },
        {
            pattern: '%p',
            value: date.format("P"),
        },
        { pattern: '%M', value: zeroFiller(date.getMinutes(), 2) },
        { pattern: '%S', value: zeroFiller(date.getSeconds(), 2) },
        { pattern: '%f', value: zeroFiller(date.getMilliseconds() * 1000, 6) },
        {
            pattern: '%z',
            value: date.toTimeString().split(' ')[1].replace('GMT', ''),
        },
        {
            pattern: '%Z',
            value: (<string>date
                .toLocaleString('default', { timeZoneName: 'short' })
                .split(' ')
                .pop()),
        },
        { pattern: '%j', value: '' }, // not implemented
        { pattern: '%U', value: '' }, // not implemented
        { pattern: '%W', value: '' }, // not implemented
        {
            pattern: '%c',
            value: date.toLocaleString(locales, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
        },
        { pattern: '%x', value: date.toLocaleDateString(locales) },
        { pattern: '%X', value: date.toLocaleTimeString(locales) },
    ];
    const custom_directives: Array<Directive> = [
        { pattern: '%C', value: '%d de %B de %Y' },
        { pattern: '%t', value: '%Y-%m-%d %H:%M:%S' },
    ];
    const all_directives: Array<Directive> = [
        ...directives,
        ...custom_directives,
        ...standard_directives,
    ];
    let strTime: string = format;
    all_directives.forEach((directive: Directive) => {
        strTime = strTime.replace(
            new RegExp(directive.pattern, 'g'),
            (<string>directive.value)
        );
    });
    return strTime;
}

export { strftime, zeroFiller }