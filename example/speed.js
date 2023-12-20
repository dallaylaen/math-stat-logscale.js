'use strict';

const { Univariate } = require( '../index.js' );

const perf = new Univariate({precision: 1e-10});

const measurements = 100;
const points = Number.parseInt(process.argv[2] ?? 0) || 1000;

for (let i = 0; i < measurements; i++) {
    const t0 = new Date();
    const stat = new Univariate();
    for (let j = 0; j < points; j++)
        stat.add(j);
    stat.mean();
    stat.stdev();
    for (let j = 0; j <= 100; j+= 10)
        stat.percentile(j);
    stat.histogram();
    perf.add( (new Date() - t0) / points );
}

const hist = perf.histogram({count:16, scale:70})
    .map( x => perf.shorten(x[1], x[2])+'\t'+'+'.repeat(x[0]) )
    .join('\n');

console.log(hist);

console.log( 'average: ', perf.neat.mean(), ' +- ', perf.neat.stdev(), ' ms per data point');
console.log( 'median:  ', perf.neat.median() );
console.log( '90%:     ', perf.neat.percentile(90) );

console.log(JSON.stringify(perf));
