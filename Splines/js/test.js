/**
 * test.js
 * Testes
 */

let runTest = () => {
    const data = {
        xs: [10, 12, 30, 50],
        ys: [100, 150, 60, 50]
    }
    data.ks = SPLINE.calcNaturalKs(data.xs, data.ys); 
    console.log(SPLINE.calcSpline(31, data.xs, data.ys, data.ks));

    const canvas = document.getElementById('theCanvas');
    if (canvas == null) console.error('Canvas não encontrado na página.');
    //else console.dir(canvas);

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(data.xs[0], data.ys[0]);
    for (let i=1; i < data.xs.length-1; i++) {
        let delta = (data.xs[i] - data.xs[i-1]) / 100;
        for(let x=data.xs[i]; x<=data.xs[i+1]; ++x)
            ctx.lineTo(x, SPLINE.calcSpline(x, data.xs, data.ys, data.ks));
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}