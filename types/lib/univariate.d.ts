/**
 *  @classdesc Univariate statistical distribution analysis tool
 *  It works by sorting data into bins.
 *  This bin size depends on absolute & relative precision
 *  of the incoming data.
 *  Thus, very large samples can be processed fast
 *  with reasonable memory usage.
 */
export class Univariate extends Binning {
    /**
     * @param {Object} args
     * @param {Number} [args.base]      Must be between 1 and 1.5. Default is 1.001
     * @param {Number} [args.precision] Must be positive. Default is 1E-9.
     * @param {Boolean} [args.flat]     If true, only use linear bins
     *                                  however large the stored values get.
     * @param {Array}  [args.bins]      See addWeighted() for description
     */
    constructor(args?: {
        base?: number;
        precision?: number;
        flat?: boolean;
        bins?: any[];
    });
    storage: Map<any, any>;
    _count: number;
    _cache: {};
    neat: Neat;
    /**
     * @desc Add value(s) to sample.
     * @param {...Number} data Number(s) to add to sample
     * @returns {Univariate} this (chainable)
     * @example
     * for (let i=0; i<10000; i++)
     *    stat.add(-Math.log(Math.random()));
     * // creates exponential distribution
     * @example
     * stat.add( 1,2,3,4,5,6 );
     * // a d6
     */
    add(...data: number[]): Univariate;
    /**
     * @desc Add values to sample, with weights.
     * @param {Array<[bin: Number, weight: number]>} pairs Array of (bin, weight) pairs
     * Negative quantity is allowed and means we're erasing data.
     * @returns {Univariate} this (chainable)
     * @example
     * stat.addWeighted( [ [0.1, 5], [0.2, 4], [0.3, 3] ] )
     * // adds 0.1 x 5, 0.2 x 4, 0.3 x 3
     */
    addWeighted(pairs: Array<[bin: number, weight: number]>): Univariate;
    /**
     *   @desc create a copy of sample object, possibly modifying precision
     *   settings and/or filtering data.
     *   @param {Object} [args]
     *   @param {Boolean} [args.flat] Make the new distribution flat (no logarithmic bins)
     *   @param {Number} [args.precision] Override absolute precision
     *   @param {Number} [args.base] Override relative precision
     *   @param {Number} [args.min] Filter values less than this
     *   @param {Number} [args.max] Filter values greater than this
     *   @param {Number} [args.ltrim] Filter values less than Xth percentile
     *   @param {Number} [args.rtrim] Filter values greater than 100-Xth percentile
     *   @param {Boolean} [args.winsorize] If a data point doesn't fit the bounds,
     *       truncate it instead of discarding.
     *   @param {function(Number): Number} [args.transform] Apply function to sample data
     *   @returns {Univariate} copy of the original object
     */
    clone(args?: {
        flat?: boolean;
        precision?: number;
        base?: number;
        min?: number;
        max?: number;
        ltrim?: number;
        rtrim?: number;
        winsorize?: boolean;
        transform?: (arg0: number) => number;
    }): Univariate;
    /**
     *   @desc  Returns a sorted list of pairs containing numbers in the sample
     *          and their respective counts.
     *          See addWeighted().
     *   @param {Object} [args]
     *   @param {Boolean} [args.flat] Make the new distribution flat (no logarithmic bins)
     *   @param {Number} [args.precision] Override absolute precision
     *   @param {Number} [args.base] Override relative precision
     *   @param {Number} [args.min] Filter values less than this
     *   @param {Number} [args.max] Filter values greater than this
     *   @param {Number} [args.ltrim] Filter values less than Xth percentile
     *   @param {Number} [args.rtrim] Filter values greater than 100-Xth percentile
     *   @param {Boolean} [args.winsorize] If a data point doesn't fit the bounds,
     *       truncate it instead of discarding.
     *   @returns {Array<[bin: Number, weight: number]>} Array of (bin, weight) pairs
     */
    getBins(args?: {
        flat?: boolean;
        precision?: number;
        base?: number;
        min?: number;
        max?: number;
        ltrim?: number;
        rtrim?: number;
        winsorize?: boolean;
    }): Array<[bin: number, weight: number]>;
    /**
     *   @desc     Number of values in the sample.
     *   @returns   {Number} count
     */
    count(): number;
    /**
     *   @desc Minimal value in the sample.
     *          This value is somewhat rounded down to guarantee
     *          it is less than _any_ value in the sample.
     *   @returns {Number} Minimum value
     */
    min(): number;
    /**
     *   @desc Maximal value in the sample.
     *          This value is somewhat rounded up to guarantee
     *          it is greater than _any_ value in the sample.
     *   @returns {Number} Maximum value
     */
    max(): number;
    /**
     *   @desc Sum of arbitrary function over the sample.
     *   @param {(arg: Number) => Number} fun function to integrate
     *   @returns {Number}
     *   @example
     *   stat.sumOf( x => 1 ); // same as stat.count()
     *   @example
     *   stat.sumOf( x => x ); // same as stat.count() * stat.mean()
     */
    sumOf(fun: (arg: number) => number): number;
    /**
     *  @desc Calculate expected value of a given function over the sample.
     *  @param {function(Number): Number} fun
     *  @returns {Number}
     */
    E(fun: (arg0: number) => number): number;
    /**
     * @desc Average value of the sample.
     * @returns {Number}
     */
    mean(): number;
    /**
     * @desc Standard deviation of the sample.
     * Bessel's correction is used:
     * stdev = sqrt( E<(x - E<x>)**2> * n/(n-1) )
     * @returns {Number} Standard deviation
     */
    stdev(): number;
    /**
     *  @desc Skewness is a measure of the asymmetry of a distribution.
     *  Equals to 3rd standardized moment times n^2/(n-1)(n-2) correction
     *  Undefined if there are less than 3 data points.
     *  @returns {Number | undefined}
     */
    skewness(): number | undefined;
    /**
     *  @desc Kurtosis is a measure of how much of the distribution is
     *        contained in the "tails".
     *        Equals to 4th standardized moment minus 3,
     *        with a correction.
     *  @returns {Number | undefined}
     */
    kurtosis(): number | undefined;
    /**
     *  @desc Moment of nth power, i.e. E((x-offset)**power)
     *  @param {Number} power Integer power to raise to.
     *  @param {Number} [offset] Number to subtract. Default is mean.
     *  @returns {Number}
     */
    moment(power: number, offset?: number): number;
    /**
     *  @desc Absolute moment of nth power, i.e. E(|x-offset|**power)
     *  @param {Number} power Power to raise to. May be fractional. Default is 1.
     *  @param {Number} [offset] Number to subtract. Default is mean.
     *  @returns {Number}
     */
    momentAbs(power?: number, offset?: number): number;
    /**
     *  @desc Standardized moment of nth power, i.e. nth moment / stdev**n.
     *  @param {Number} power Integer power to raise to
     *  @returns {Number}
     */
    momentStd(power: number): number;
    /**
     *  @desc A number x such that P(value <= x) === p
     *  @param {Number} p from 0 to 1
     *  @return {Number} value
     *  @example
     *  const stat = new Univariate();
     *  stat.add( 1,2,3,4,5 );
     *  stat.quantile( 0.2 ); // slightly greater than 1
     *  stat.quantile( 0.5 ); // 3
     */
    quantile(p: number): number;
    /**
     *  @desc Returns x such that P(value < x) === p%.
     *        Same as quantile(p/100).
     *  @param {Number} p
     *  @returns {Number} x
     */
    percentile(p: number): number;
    /**
     *  @desc Returns x such that half of the sample is less than x.
     *        Same as quantile(0.5).
     *  @returns {Number} x
     */
    median(): number;
    /**
     *  @desc Cumulative distribution function, i.e. P(value < x).
     *  This is the inverse of quantile.
     *  @param {Number} x
     *  @returns {Number} probability
     */
    cdf(x: number): number;
    _rawCdf(x: any): any;
    /**
     *   @desc Histogram based on the sample
     *   @param {Object} args
     *   @param {Number} [args.count] Number of bars in the histogram.
     *                                 Default is 10.
     *   @param {Number}  [args.scale] If given, make sure it's
     *   the height of the highest bar.
     *   @return {Array<[barHeight: Number, leftBorder: Number, rightBorder: Number]>}
     *   Array of triplets. rightBorder equals to the next bar's leftBorder.
     */
    histogram(args?: {
        count?: number;
        scale?: number;
    }): Array<[barHeight: number, leftBorder: number, rightBorder: number]>;
    _cumulative(): any;
}
import { Binning } from "./binning.js";
declare class Neat {
    constructor(main: any);
    _main: any;
    min(): any;
    max(): any;
}
export {};
