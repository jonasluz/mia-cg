/**
 * Classes e funções para computação gráfica
 */

// Namespace.
var CG = CG || {}

/**
 * Um ponto bidimensional.
 * @param {Number} x Coordenada x.
 * @param {Number} y Coordenada y.
 */
CG.Point = function(x, y=undefined, z=0) 
{
    if (y===undefined) 
    {
        if (Array.isArray(x) && x.length > 1)
        {
            this.x = x[0];
            this.y = x[1];
            this.z = x.length > 2 ? x[2] : 0;
        } else {
            console.error(`Can't create a CG.Point with ${x.length} elements.`);
        }
    } else {
        this.x = x; 
        this.y = y;
        this.z = z;
    }

    CG.Point.prototype.toString = function() 
    {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

    this.toArray = () => [this.x, this.y, this.z];

    /**
     * Normaliza esse ponto/vetor.
     * @param {number} factor Fator de normalização. Default: 1.
     */
    this.normalized = function(factor=1) 
    {
        factor /= Math.max(Math.abs(this.x), Math.abs(this.y));
        let x = this.x * factor;
        let y = this.y * factor;
        
        return new CG.Point(x, y);
    }

    /**
     * A norma do vetor formado pelo ponto é o conprimento daquele.
     * @return {number} a norma do vetor.
     */
    this.norm = function() 
    {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    /**
     * Calcula o seno, cosseno e ângulo diretores do vetor formado pelo ponto.
     * @return {object} O ângulo, seno e cosseno diretores.
     */
    this.directors = function() 
    {
        return {
            sin : x / this.norm,
            cos : y / this.norm,
            angle : acos(this.dirCos)
        };
    }

    /**
     * O produto interno deste vetor com outro.
     * @param {CG.Point} other o outro vetor.
     * @return {number} o escalar do produto do interno.
     */
    this.dotProduct = function(other) 
    {
        return other === undefined ? undefined :
            this.x * other.x + this.y * other.y;
    }

    /**
     * O produto vetorial deste vetor com outro. Requer 3D. 
     * @param {CG.point} other o outro vetor.
     * @return {CG.Point} o vetor resultante do produto vetorial.
     */
    this.crossProduct = function(other) 
    {
        return other === undefined ? undefined : 
            new CG.Point(
                this.y*other.z - this.z*other.y,
                this.z*other.x - this.x*other.z,
                this.x*other.y - this.y*other.x
            );
    }
}

/**
 * Uma linha
 * @param {Point} p1 primeiro ponto.
 * @param {Point} p2 segundo ponto.
 */
CG.Line = function(p1, p2) 
{
    this.p1 = p1; 
    this.p2 = p2;

    this.dx = p2.x - p1.x;
    this.dy = p2.y - p1.y;
    this.direction = new CG.Point(this.dx, this.dy);

    let midpoint; 
    let normals = new Array();

    /**
     * Equação paramétrica da reta.
     * @param {number} t parâmetro desejado.
     * @return {CG.Point} ponto na reta na posição t.
     */
    this.parametricPoint = function(t) 
    {
        const x = this.p1.x + this.dx * t;
        const y = this.p1.y + this.dy * t;
        
        return new CG.Point(x, y);
    }

    /**
     * Ponto médio do segmento de reta (esta linha).
     * @return {CG.Point} ponto médio.
     */
    this.midPoint = function() 
    {
        if (midpoint === undefined) midpoint = this.parametricPoint(.5);
        return midpoint;
    }

    /**
     * Vetores normais a essa linha.
     * @see http://stackoverflow.com/questions/1243614/how-do-i-calculate-the-normal-vector-of-a-line-segment
     * @param {number} factor Fator de normalização. Default: 1.
     */
    this.normals = function(factor=1) 
    {
        let n1, n2;
        if (normals.length < 2) 
        {
            n1 = new CG.Point(-this.dy, this.dx);
            n2 = new CG.Point(this.dy, -this.dx);
            normals[0] = n1;
            normals[1] = n2;
        }
        n1 = normals[0].normalized(factor);
        n2 = normals[1].normalized(factor);

        return [n1, n2];
    }
}

/**
 * Gera um número randômico entre o início e o fim indicados.
 * @param {number} start valor inicial do intervalo.
 * @param {number} end valor final do intervalo.
 */
CG.Random = function(start, end) 
{
    return Math.floor(Math.random() * end + start);
}

CG.translate = function(V, delta, neg=false) 
{
    if (Array.isArray(V))
    {
        let R = [];
        for (v of V) 
            R.push(CG.translate(v, delta, neg));
        return R;
    } else {
        let d = Array.isArray(delta) ? new CG.Point(delta) : delta;
        let f = neg ? -1 : 1;
        return new CG.Point(V.x + f*d.x, V.y + f*d.y, V.z + f*d.z);
    }
}

CG.rotate2d = function(V, theta) 
{
    if (Array.isArray(V))
    {
        let R = [];
        for (v of V) 
            R.push(CG.rotate2d(v, theta));
        return R;
    } else {
        if (theta instanceof CG.Point) 
            theta = Math.atan2(theta.y, theta.x); 
        let s = Math.sin(theta);
        let c = Math.cos(theta);
        let x = c * V.x + s * V.y;
        let y = -s * V.x + c * V.y;
        return new CG.Point(x, y);
    }
}

/**
 * Ordenação de pontos em sentido do relógio.
 * @see http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
 * @param {array} points Vetor de pontos a ordenar.
 */
CG.clockwiseSort = function(points) 
{

}
