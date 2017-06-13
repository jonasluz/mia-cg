/**
 * Cyrus-Beck Clipping Algorithm 
 * @author Jonas de A Luz Jr. <unifor@jonasluz.com>
 */

/** Namespace */
var CYRUSBECK = CYRUSBECK || { 
    POINT_RADIUS: 5
}

/**
 * Inicializa o ambiente.
 */
CYRUSBECK.init = function() 
{
    // Canvas HTML5 para saída do algoritmo.
    this.canvas  = document.getElementById('canvas');
    if (canvas == null) console.error('Elemento canvas não encontrado na página.'); 
    // Contexto 2D do canvas.
    this.context = canvas.getContext('2d');
}

/**
 * Plano de recorte.
 * @param {array} points Vetor de pontos que formam o polígono de recorte.
 */
CYRUSBECK.ClippingPlane = function(points, alreadySplitted=false) 
{
    this.points = points;                       // vetor dos vértices do plano de recorte.
    this.splits = [];
    this.subplanes = [];

    /* Guarda também as arestas e suas normais internas */
    this.edges = [];
    this.normals = [];
    let x, y, edge;
    for (let i = 0; i < this.points.length - 1; i++) 
    {
        edge = new CG.Line(this.points[i], this.points[i+1]);
        this.edges[i] = edge;
        this.normals[i] = edge.normals()[1];
    }
    edge = new CG.Line(this.points[this.points.length-1], this.points[0]);
    this.edges[this.edges.length] = edge;
    this.normals[this.normals.length] = edge.normals()[1];

    /**
     * Separa o polígono côncavo em vários convexos.
     */
    this.split = function()
    {
        for (let i = 0; i < this.points.length - 1; ++i)
        {
            let T = CG.translate(this.points, this.points[i], true);    // translada...
            T = CG.rotate2d(T, T[(i+1)%this.points.length]);            // e rotaciona.

            if (T[(i+2)%this.points.length].y > 0) { // encontrou uma concavidade.
                let j = i+3;
                while(T[j%this.points.length].y > 0) j++;
                j = j % this.points.length;
                let split1 = [];
                let split2 = partial = this.points.slice(i, i + 2);
                if (j < i) { 
                    split1 = this.points.slice(i + 1)
                                .concat(this.points.slice(0, j + 1));
                    split2 = split2.concat(this.points.slice(j, i));
                } else {
                    split1 = this.points.slice(i + 1, j + 1);
                    split2 = split2.concat(this.points.slice(j));
                }
                debugger
                let s1 = new CYRUSBECK.ClippingPlane(split1);
                let s2 = new CYRUSBECK.ClippingPlane(split2);
                this.splits.push([this.points[i + 1], this.points[j]]);
                this.subplanes = [s1, s2];
            }
        }
    }
    this.split();

    /**
     * Desenha este plano de recorte.
     * @param {boolean} withNormals desenhar normais? 
     */
    this.draw = function(withNormals=false) 
    {
        const size = this.points.length;          // tamanho do vetor de pontos.
        if (size < 3) 
        {   // Tamanho do vetor de vértices do plano de recorte não é um polígono.
            console.error("Plano de recorte deve ter pelo menos três vértices.");
            return;
        }
        const canvas = CYRUSBECK.canvas;          // canvas.
        const ctx = CYRUSBECK.context;            // contexto 2d do canvas.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        HELPERS.drawRulers(canvas, 100);
        for (point of this.points)
            this.drawPoint(point);
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

        this.drawSplits();
        for (let plane in this.subplanes)
           //plane.draw();

        if (withNormals) this.drawNormals();
    }

    this.drawPoint = function(p) 
    {
        const ctx = CYRUSBECK.context;
        ctx.beginPath();
        ctx.arc(p.x, p.y, CYRUSBECK.POINT_RADIUS, 0, Math.PI * 2, false);
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fillStyle = "#4AF";
        ctx.fill();
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#444";
        ctx.fillText(`(${p.x},${p.y})`, p.x - CYRUSBECK.POINT_RADIUS * 5, p.y - CYRUSBECK.POINT_RADIUS * 2);
    }

    this.drawSplits = function() 
    {
        const ctx = CYRUSBECK.context;

        for (let split of this.splits)
        {
            ctx.beginPath();
            ctx.moveTo(split[0].x, split[0].y);
            ctx.lineTo(split[1].x, split[1].y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#00FFCC';
            ctx.stroke();
        }
        for (let subplane of this.subplanes) 
        {
            if (subplane.splits.length > 0)
                subplane.drawSplits();
        }
    }

    /**
     * Desenha as normais às arestas.
     */
    this.drawNormals = function() 
    {
        const ctx = CYRUSBECK.context;            // contexto 2d do canvas.
        for (let edge of this.edges) 
        {
            const normals = edge.normals(10);
            const middle = edge.midPoint();
            ctx.beginPath();                    // inicia traçado.
            const normal = normals[1];            // só nos interessa a normal interna. 
            ctx.moveTo(middle.x, middle.y);
            ctx.lineTo(middle.x + normal.x, middle.y + normal.y);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();            
        };        
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
        const canvas = CYRUSBECK.canvas;
        // Primeiro ponto.
        let x = CG.Random(0, canvas.width);
        let y = CG.Random(0, canvas.height);
        const p1 = new CG.Point(x, y);
        // Segundo ponto.
        x = CG.Random(0, canvas.width);
        y = CG.Random(0, canvas.height);
        const p2 = new CG.Point(x, y);
        // Retorna a linha aleatória.
        return new CG.Line(p1, p2);
    }

    /**
     * Desenha as linhas aleatórias no canvas.
     */
    this.draw = function() 
    {
        const canvas = CYRUSBECK.canvas;          // canvas.
        const ctx = CYRUSBECK.context;            // contexto 2d do canvas.
        for (let line of this.lines)
        {
            ctx.beginPath();                    // inicia traçado.
            ctx.moveTo(line.p1.x, line.p1.y);   // move-se para o primeiro ponto.
            ctx.lineTo(line.p2.x, line.p2.y);   // desenha linha.
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#6666ff';
            ctx.stroke();
        };
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
    if (cp.subplanes.length != 0) {
        let segments = [];
        for (plane of cp.subplanes) {
            let segs = this.clip(plane, line);
            segments = segments.concat(segs);
        }
        return segments; 
    }
    /* Recupera valores */
    const p1 = line.p1;
    const p2 = line.p2;
    const n = cp.normals;
    const f = cp.points;
    const k = f.length;
    const d = line.direction;

    /* Inicializa valores */
    // Assume que a linha é inteiramente visível.
    let tl = 0, tu = 1;

    /* laço principal */
    for (let i = 0; i < k; i++)
    {
        // calcula w, D.n e w.n para este valor de i;
        let w = new CG.Point(p1.x - f[i].x, p1.y - f[i].y); 
        let ddotn = d.dotProduct(n[i]); 
        let wdotn = w.dotProduct(n[i]);

        if (ddotn != 0)     // a linha não é um ponto.
        {
            const t = -wdotn / ddotn;
            // buscando pelo maior ou menor limite?
            if (ddotn > 0) 
            {   // ... buscando pelo menor limite.
                // t está na faixa 0-1? 
                if (t > 1)  // região inteiramente à direita da linha.
                    return []; // linha trivialmente invisível -- sai.
                else 
                    tl = Math.max(t, tl);
            } else {        // ddotn < 0
                // ... buscando pelo maior limite.
                // t está na faixa 0-1? 
                if (t < 0)  // região inteiramente à esquerda da linha.
                    return []; // linha trivialmente invisível -- sai.
                else 
                    tu = Math.min(t, tu);
            }
        } else {            // ddotn == 0
            if (wdotn < 0)  // a linha é trivialmente invisível.
                return [];
        }
    }   // saída do loop principal.

    // Verifica se a linha é, de fato, invisível.
    if (tl <= tu)           // recupera um trecho visível.
    {
        // retorna o trecho tl -> tu.
        const pl = line.parametricPoint(tl);
        const pu = line.parametricPoint(tu);
        return [new CG.Line(pl, pu)];
    }
}

/**
 * Recorta e desenha as linhas.
 * @param {CYRUSBECK.ClippingPlane} cp polígono de recorte.
 * @param {Array} lines Linhas a recortar.
 */
CYRUSBECK.clipAndDraw = function(cp, lines) 
{
    for (let line of lines) 
    {
        let segments = this.clip(cp, line);
        console.table(segments);
        //debugger
        for (let segment of segments)
        {
            if (!segment) continue;
            const ctx = this.context;            // contexto 2d do canvas.
            ctx.beginPath();                        // inicia traçado.
            ctx.moveTo(segment.p1.x, segment.p1.y); // move-se para o primeiro ponto.
            ctx.lineTo(segment.p2.x, segment.p2.y);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#0033cc';
            ctx.stroke();
        }
    };
}
