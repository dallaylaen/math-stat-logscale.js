const graphColoring = [
    [0,    'orange'],
    [0.05, 'yellow'],
    [0.25, 'blue' ],
    [0.5,  'yellow' ],
    [0.75, 'blue' ],
    [0.95, 'orange'],
    [1,    'red']
];

const em = 8;

function univariateToPng(copy, canvas, options={}) {
    const height = Math.floor(Number.parseInt(window.innerHeight) / 5);
    const width  = Math.floor(Number.parseInt(window.innerWidth) * 0.8) - 10;

    canvas.height = height + em*2;
    canvas.width = width + em*6;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(em, 0, canvas.width-em*6, canvas.height-em*2);
    ctx.stroke();

    if(!copy.count())
        return;

    const min = copy.min();
    const step = (copy.max() - min) / width;
    const num2pic = x => (x - min) / step + em;

    ctx.lineWidth = 1;

    const hist = copy.histogram({count:width, scale:height});
    const parts = graphColoring.map( x => [ copy.quantile(x[0]), x[1]] );
    let partNum = 0;

    for (let i = 0; i<width; i++) {
        if (hist[i][1] >= parts[partNum][0])
            ctx.strokeStyle = parts[partNum++][1];

        ctx.beginPath();
        ctx.moveTo( i + em, height );
        ctx.lineTo( i + em, height - Math.ceil(hist[i][0]) );
        ctx.stroke();
    }

    // mean +- stdev
    const meanStd = [-1,0,1].map( x => copy.mean() + x*copy.stdev() )
        .map( num2pic );
    ctx.beginPath();
    ctx.strokeStyle = 'orange';
    ctx.moveTo( meanStd[0], canvas.height-em );
    ctx.lineTo( meanStd[2], canvas.height-em );
    ctx.moveTo( meanStd[0], canvas.height-em*1.4 );
    ctx.lineTo( meanStd[0], canvas.height-em*0.6 );
    ctx.moveTo( meanStd[1], canvas.height-em*1.6 );
    ctx.lineTo( meanStd[1], canvas.height-em*0.4 );
    ctx.moveTo( meanStd[2], canvas.height-em*1.4 );
    ctx.lineTo( meanStd[2], canvas.height-em*0.6 );
    ctx.stroke();

    for (let i = 0; i<11; i++) {
        ctx.beginPath();
        ctx.fillStyle = '#222222';
        ctx.font = em + 'px Sans';
        const label = copy.shorten(copy.min() + (copy.max() - copy.min())*i/10);
        ctx.setLineDash([1,3]);
        ctx.moveTo( width*i/10 + em, canvas.height-em*1.5 );
        ctx.lineTo( width*i/10 + em, 0 );
        ctx.stroke();
        ctx.strokeStyle = 'black';
        ctx.setLineDash([1,0]);
        ctx.fillText( label, width*i/10 + em, canvas.height-1 );
    }

    for (let i = 0; i<graphColoring.length-1; i++) {
        ctx.beginPath();
        ctx.fillStyle = graphColoring[i][1];
        ctx.fillRect(em+width+2, i*em*2+2, em*1.5, em*1.5);
        ctx.stroke();

        const label = graphColoring[i+1][0] * 100 + '%';
        ctx.beginPath();
        ctx.fillStyle = '#222222';
        ctx.fillText( label,  em*3+width, i*em*2+em*1.5);
    }
}

module.exports = { univariateToPng };
