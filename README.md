# stats-logscale

A memory-efficient approximate statistical analysis tool
using logarithmic binning.

![Example: repeated setTimeout(0) execution times](example/images/settimeout-duration-distribution.png)
_Example: repeated setTimeout(0) execution times_

# DESCRIPTION

* data is split into bins (aka buckets),
linear close to zero and logarithmic for large numbers (hence the name),
thus maintaining desired absolute and relative precision.

* can calculate mean, variance, median, moments, percentiles,
cumulative distribution function (i.e. probability that a value is less than x),
and expected values of arbitrary functions over the sample.

* can generate histograms for plotting the data.

* all calculated values are cached. Cache is reset upon adding new data.

* (almost) every function has a "neat" counterpart which rounds the result
to the shortest possible number within the precision bounds. 
E.g. `foo.mean() // 1.0100047`, but `foo.neat.mean() // 1.01`.

* is (de)serializable, multiple samples can be combined into one.

# USAGE

```javascript
const { Univariate } = require( 'stats-logscale' );

// Specify absolute/relative precision in the constructor.
// The defaults are 1e-9 and 1.001, respectively.
const stat = new Univariate({precision: 0.001, base: 1.001});

// Adding data: one by one, ...
for (let i = 1; i<1000; i++)
    stat.add(Math.random() * Math.random());

// ... multiple values at once, ...
// Strings are fine, too (but non-numeric ones will cause an exception)
stat.add( '3', '14', '15', 9, 26, 53 );

// ... or as an array of (value, weight) pairs
stat.addWeighted( [[1.1, 10], [2.2, 5], [3.3, 3]] );

// Query data. Each value is cached once requested.
// The cache is reset upon entering new data.

stat.count();           // number of data points
stat.mean();            // average
stat.stdev();           // standard deviation
stat.median();          // half of data is lower than this value
stat.percentile(90);    // 90% of data below this point
stat.quantile(0.9);     // ditto
stat.cdf(0.5);          // Cumulative distribution function, which means
                        // the probability that a data point is less than 0.5
stat.moment(power);     // central moment of an integer power
stat.momentAbs(power);  // < |x-<x>| ** power >, power may be fractional
stat.E( x => x\*x );    // expected value of arbitrary function

// Round arbitrary numbers
stat.round(1.7);        // center of respective bucket
stat.lower(1.7);
stat.upper(1.7);        // bucket boundaries
stat.shorten(1.7);      // the shortest number within the bucket
                        // may be useful for eye-candy

// Query data but the returned values are rounded to the shortest number
//     within the precision bounds
stat.neat.mean();
stat.neat.stdev();
stat.neat.median();

// Extract partial samples

stat.clone( { min: 0.5, max: 0.7 } );

// Serialize, deserialize, and combine data from multiple sources

const str = JSON.stringify(stat);
// send over the network here
const copy = new Univariate (JSON.parse(str));
mainStat.addWeighted( copy.getBins() );
mainStat.addWeighted( JSON.parse(str).bins ); // ditto

// Create histograms and plot data.

stat.histogram({scale: 768, count:1024});
    // this produces 1024 bars of the form
    // [ bar_height, lower_boundary, upper_boundary ]
    // The intervals are consecutive.
    // The bar heights are limited to 768.

stat.histogram({scale: 70, count:20})
    .map( x => stat.shorten(x[1], x[2]) + '\t' + '+'.repeat(x[0]) )
    .join('\n')
    // "Draw" a vertical histogram for text console
    // You'll use PNG in production instead, right? Right?

```

See also the [playground](https://dallaylaen.github.io/stats-logscale-js/).

# COPYRIGHT AND LICENSE

Copyright (c) 2022 Konstantin Uvarin

This software is free software available under MIT license.
