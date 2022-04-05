import fs from 'fs/promises';
import { constants as FS_CONSTANTS } from 'fs';

/**
 * generate uuid of v4 format
 * @see https://stackoverflow.com/a/21963136/11027903
 * @returns {string}
 */
function uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.trunc(Math.random() * 16),
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function pathExists(path: string) {
    return fs
        .access(path, FS_CONSTANTS.F_OK)
        .then(() => true)
        .catch(() => false);
}

/**
 * like Number.prototype.toFixed, but will remove redundant zero and round decimal
 * @param {number} num
 * @param {number} [fractionDigits=3]
 */
function toFixed(num: number, fractionDigits = 3) {
    const numStr = num.toString(10);
    const dotIndex = numStr.indexOf('.');
    if (dotIndex === -1) return num;

    if (fractionDigits === undefined) fractionDigits = 3;
    const multiplex = Math.pow(10, fractionDigits);
    return Math.round(num * multiplex) / multiplex;
}

function escapeStringAppleScript(string: string) {
    // eslint-disable-next-line unicorn/better-regex
    return string.replace(/[\\"]/g, '\\$&');
}

function debounce<F extends (...args: any) => any>(fn: F, delay: number, immediate: boolean) {
    let timerId: NodeJS.Timeout | undefined;
    function debouncedFn(this: any, ...args: Parameters<F>) {
        return new Promise((resolve) => {
            if (timerId !== undefined) {
                clearTimeout(timerId);
            }

            if (immediate && timerId === undefined) {
                timerId = setTimeout(() => {
                    timerId = undefined;
                }, delay);
                resolve(fn.apply(this, args));
            } else {
                timerId = setTimeout(() => {
                    resolve(fn.apply(this, args));
                    timerId = undefined;
                }, delay);
            }
        });
    }

    debouncedFn.cancel = function () {
        if (timerId !== undefined) clearTimeout(timerId);
        timerId = undefined;
    };

    return debouncedFn;
}

function dateFormat(date: Date, formatStr: string, isUtc: boolean) {
    const getPrefix = isUtc ? 'getUTC' : 'get';
    // eslint-disable-next-line unicorn/better-regex
    return formatStr.replace(/%[YmdHMS]/g, (m: string) => {
        let replaceStrNum: number;
        switch (m) {
            case '%Y':
                return String(date[`${getPrefix}FullYear`]()); // no leading zeros required
            case '%m':
                replaceStrNum = 1 + date[`${getPrefix}Month`]();
                break;
            case '%d':
                replaceStrNum = date[`${getPrefix}Date`]();
                break;
            case '%H':
                replaceStrNum = date[`${getPrefix}Hours`]();
                break;
            case '%M':
                replaceStrNum = date[`${getPrefix}Minutes`]();
                break;
            case '%S':
                replaceStrNum = date[`${getPrefix}Seconds`]();
                break;
            default:
                return m.slice(1); // unknown code, remove %
        }
        // add leading zero if required
        return `0${replaceStrNum}`.slice(-2);
    });
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export { uuidV4, pathExists, toFixed, escapeStringAppleScript, debounce, dateFormat, getNonce };
