(() => {
    const { Binning } = require('./lib/binning.js');
    const { Univariate } = require('./lib/univariate.js');

    // TODO should we even bother doing it? Use window.Univariate?.. Just module.exports?..
    // Name must be short & reflect (math, statistics, logarithm)
    const logstat = { Binning, Univariate };

    // We may have both window & module if running as a dependency under webpack
    if (typeof window !== 'undefined')
        window.logstat = logstat;
    if (typeof module === 'object')
        module.exports = logstat;
})();
