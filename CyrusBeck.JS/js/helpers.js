/**
 * Rotinas auxiliares de operação do canvas HTML5.
 */

var HELPERS = HELPERS || {}

/**
 * Desenha as réguas no canvas.
 * @param {DOM} canvas Elemento canvas no DOM.
 * @param {number} grade tamanho da gradação da régua.
 * @param {number} smallLine tamanho da linha menor.
 * @param {number} line tamanho da linha padrão.
 */
HELPERS.drawRulers = function(canvas, grade, smallLine=10, line=20) 
{
    const w = canvas.width;
    const h = canvas.height;

    const smallGrade = grade / 10;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0,1); 
    ctx.lineTo(w, 1);
    for (let i = 0; i < w; i += smallGrade) 
    {
        ctx.moveTo(i, 1);
        let l = i % grade == 0 ? line : smallLine;
        ctx.lineTo(i, l);
    }
    for (let i = 0; i < h; i += smallGrade) 
    {
        ctx.moveTo(1, i);
        let l = i % grade == 0 ? line : smallLine;
        ctx.lineTo(l, i);
    }
    ctx.lineWidth = .5;
    ctx.strokeStyle = '#444444';
    ctx.stroke();
}