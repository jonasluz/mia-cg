/**
 * Cyrus-Beck Clipping Algorithm 
 * @author Jonas de A Luz Jr. <unifor@jonasluz.com>
 */

/**
 *  Espaço de nomes para esta aplicação.
 */
var CYRUSBECK = CYRUSBECK || { }

/**
 * Inicializa o ambiente.
 */
CYRUSBECK.init = function() 
{
    // Canvas HTML5 para saída do algoritmo.
    var canvas  = document.getElementById('canvas');
    if (canvas == null) console.error('Elemento canvas não encontrado na página.'); 

    // Contexto 2D do canvas.
    CYRUSBECK.canvas = canvas;
    CYRUSBECK.context = canvas.getContext('2d');
}

/**
 * Plano de recorte.
 * @param {array} points Vetor de pontos que formam o polígono de recorte.
 */
CYRUSBECK.ClippingPlane = function(points) 
{
    this.points = points;                       // vetor dos vértices do plano de recorte.

    /* Guarda também as arestas e suas normais internas */
    this.edges = new Array();
    this.normals = new Array();
    var x, y, edge;
    for (var i = 0; i < this.points.length - 1; i++) 
    {
        edge = new CG.Line(this.points[i], this.points[i+1]);
        this.edges[i] = edge;
        this.normals[i] = edge.normals()[1];
    }
    edge = new CG.Line(this.points[this.points.length-1], this.points[0]);
    this.edges[this.edges.length] = edge;
    this.normals[this.normals.length] = edge.normals()[1];

    /**
     * Desenha este plano de recorte.
     */
    this.draw = function(withNormals=false) 
    {
        var size = this.points.length;          // tamanho do vetor de pontos.
        if (size < 3) 
        {   // Tamanho do vetor de vértices do plano de recorte não é um polígono.
            console.error("Plano de recorte deve ter pelo menos três vértices.");
            return;
        }
        var canvas = CYRUSBECK.canvas;          // canvas.
        var ctx = CYRUSBECK.context;            // contexto 2d do canvas.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        HELPERS.drawRulers(canvas, 100);
        ctx.beginPath();                        // inicia traçado.
        ctx.moveTo(points[0].x, points[0].y);   // move-se para o primeiro ponto.
        for (i = 1; i < size; i++) 
        {   // para cada ponto adicional, traça um segmento de reta.
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[0].x, points[0].y);   // fecha o polígono.
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        if (withNormals) this.drawNormals();
    }

    /**
     * Desenha as normais às arestas.
     */
    this.drawNormals = function() 
    {
        var ctx = CYRUSBECK.context;            // contexto 2d do canvas.
        this.edges.forEach(function(edge) {
            var normals = edge.normals(10);
            var middle = edge.midPoint();
            ctx.beginPath();                    // inicia traçado.
            var normal = normals[1];            // só nos interessa a normal interna. 
            ctx.moveTo(middle.x, middle.y);
            ctx.lineTo(middle.x + normal.x, middle.y + normal.y);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();            
        }, this);        
    }
}

/**
 * Linhas aleatórias criadas para demonstrar algoritmo.
 * @param {number} n número de linhas a criar.
 */
CYRUSBECK.RandomLines = function(n) 
{
    /**
     * Cria uma linha aleatória dentro do canvas.
     * @return {CG.Line} linha criada.
     */
    this.createLine = function() 
    {
        var canvas = CYRUSBECK.canvas;
        // Primeiro ponto.
        var x = CG.Random(0, canvas.width);
        var y = CG.Random(0, canvas.height);
        var p1 = new CG.Point(x, y);
        // Segundo ponto.
        x = CG.Random(0, canvas.width);
        y = CG.Random(0, canvas.height);
        var p2 = new CG.Point(x, y);
        // Retorna a linha aleatória.
        return new CG.Line(p1, p2);
    }

    /**
     * Desenha as linhas aleatórias no canvas.
     */
    this.draw = function() 
    {
        var canvas = CYRUSBECK.canvas;          // canvas.
        var ctx = CYRUSBECK.context;            // contexto 2d do canvas.
        this.lines.forEach(function(line) {
            ctx.beginPath();                    // inicia traçado.
            ctx.moveTo(line.p1.x, line.p1.y);   // move-se para o primeiro ponto.
            ctx.lineTo(line.p2.x, line.p2.y);   // desenha linha.
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#6666ff';
            ctx.stroke();
        }, this);
    }

    // cria e guarda as linhas.
    this.lines = new Array();
    for (i = 0; i < n; i++) 
        this.lines[i] = this.createLine();
}

/**
 * Função de recorte de uma linha.
 * @see ROGERS, pp 204-207.
 * @param {CYRUSBECK.ClippingPlane} cp polígono de recorte.
 * @param {CG.Line} line Linha a recortar.
 * @return {CG.Line} segmento de reta a desenhar.
 */
CYRUSBECK.clip = function(cp, line) 
{
    /* Recupera valores */
    var p1 = line.p1;
    var p2 = line.p2;
    var n = cp.normals;
    var f = cp.points;
    var k = f.length;
    var d = line.direction;

    /* Inicializa valores */
    // Assume que a linha é inteiramente visível.
    var tl = 0, tu = 1;

    /* laço principal */
    for (var i = 0; i < k; i++)
    {
        // calcula w, D.n e w.n para este valor de i;
        w = new CG.Point(p1.x - f[i].x, p1.y - f[i].y); 
        ddotn = d.dotProduct(n[i]); 
        wdotn = w.dotProduct(n[i]);

        if (ddotn != 0)     // a linha não é um ponto.
        {
            var t = -wdotn / ddotn;
            // buscando pelo maior ou menor limite?
            if (ddotn > 0) 
            {   // ... buscando pelo menor limite.
                // t está na faixa 0-1? 
                if (t > 1)  // região inteiramente à direita da linha.
                    return; // linha trivialmente invisível -- sai.
                else 
                    tl = Math.max(t, tl);
            } else {        // ddotn < 0
                // ... buscando pelo maior limite.
                // t está na faixa 0-1? 
                if (t < 0)  // região inteiramente à esquerda da linha.
                    return; // linha trivialmente invisível -- sai.
                else 
                    tu = Math.min(t, tu);
            }
        } else {            // ddotn == 0
            if (wdotn < 0)  // a linha é trivialmente invisível.
                return;
        }
    }   // saída do loop principal.

    // Verifica se a linha é, de fato, invisível.
    if (tl <= tu)           // recupera um trecho visível.
    {
        // retorna o trecho tl -> tu.
        var pl = line.parametricPoint(tl);
        var pu = line.parametricPoint(tu);
        return new CG.Line(pl, pu);
    }
}

/**
 * Recorta e desenha as linhas.
 * @param {CYRUSBECK.ClippingPlane} cp polígono de recorte.
 * @param {Array} lines Linhas a recortar.
 */
CYRUSBECK.clipAndDraw = function(cg, lines) 
{
    lines.forEach(function(line) {
        var segment = CYRUSBECK.clip(cg, line);
        if (segment !== undefined) 
        {
            var ctx = CYRUSBECK.context;            // contexto 2d do canvas.
            ctx.beginPath();                        // inicia traçado.
            ctx.moveTo(segment.p1.x, segment.p1.y); // move-se para o primeiro ponto.
            ctx.lineTo(segment.p2.x, segment.p2.y);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#0033cc';
            ctx.stroke();
        }
    }, this);
}