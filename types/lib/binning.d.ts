export class Binning {
    /**
     * @param {object} args
     * @param {number} args.base should be >1, unless uniform = true
     * @param {number} args.precision should be >0
     * @param {boolean} args.flat if true, don't use log binning at all
     */
    constructor(args?: {
        base: number;
        precision: number;
        flat: boolean;
    });
    _flat: boolean;
    _base: number;
    _thresh: number;
    _precision: number;
    /**
     *
     * @return {Object}
     */
    toJSON(): any;
    getBase(): number;
    getPrecision(): number;
    round(x: any): any;
    upper(x: any): any;
    lower(x: any): any;
    shorten(x: any, y: any): any;
}
export function shorten(min: any, max: any, base?: number): any;
