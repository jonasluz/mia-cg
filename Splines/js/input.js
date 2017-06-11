/**
 * input.js
 * Funções de controle de entrada para o canvas.
 * Por Jonas Luz Jr.
 * 
 */

var INPUT = INPUT || {};

INPUT.POINT_RADIUS = 5;

/**
 * inicializa o controle de entrada.
 */
INPUT.init = () => {
    this.canvas = document.getElementById('theCanvas');
    this.ctx    = canvas.getContext('2d');
    this.width  = canvas.width;
    this.height = canvas.height;
    this.data   = {
        xs: [], 
        ys: [], 
        ks: []
    }

    // adiciona listener para click.
    canvas.addEventListener('click', INPUT._onCanvasClick, false);
};

/**
 * Acionamento do click.
 */
INPUT._onCanvasClick = (e) => {
        
    let point = INPUT._getCursorPosition(e); 
    //console.log(`Clicou em (${point.x},${point.y}).`);

    // insere o ponto na lista na ordem correta.
    this.data.xs.push(point.x);
    this.data.ys.push(point.y);
    let last = data.xs.length - 1;
    let i = last - 1; let j = -1;
    while (i > 0 && data.xs[i] > point.x) j = i--;
    if (j >= 0) {
        for (let k=last; k>j; --k) {
            data.xs[k] = data.xs[k-1];
            data.ys[k] = data.ys[k-1];
        }
        data.xs[j] = point.x;
        data.ys[j] = point.y;
    }
    data.ks = SPLINE.calcNaturalKs(data.xs, data.ys); 
    //console.table(data);

    // redesenha a spline.
    INPUT._drawSpline();
}

/**
 * Recupera a posição do ponto clicado relativa ao canvas.
 */
INPUT._getCursorPosition = (e) => {
    let x, y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    return { x, y };    
}

/**
 * Desenha um ponto de controle.
 */
INPUT._drawPoint = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, INPUT.POINT_RADIUS, 0, Math.PI * 2, false);
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fillStyle = "#4AF";
    ctx.fill();
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#444";
    ctx.fillText(`(${x},${y})`, x - INPUT.POINT_RADIUS * 5, y - INPUT.POINT_RADIUS * 2);
}

/**
 * Desenha a spline.
 */
INPUT._drawSpline = () => {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let last = data.xs.length - 1;

    for (let i=0; i <= last; ++i) 
        INPUT._drawPoint(data.xs[i], data.ys[i]);

    ctx.beginPath();
    ctx.moveTo(data.xs[0], data.ys[0]);
    for (let i=0; i < last; ++i) {
        let previous = i == 0 ? 0 : data.xs[i-1];
        let delta = (data.xs[i] - previous) / 100;
        for(let x=data.xs[i]; x<=data.xs[i+1]; ++x)
            ctx.lineTo(x, SPLINE.calcSpline(x, data.xs, data.ys, data.ks));
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}
