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
CG.Point = function(x, y) 
{
    this.x = x; 
    this.y = y;

    /**
     * Normaliza esse ponto/vetor.
     * @param {number} factor Fator de normalização. Default: 1.
     */
    this.normalized = function(factor=1) 
    {
        factor /= Math.max(Math.abs(this.x), Math.abs(this.y));
        var x = this.x * factor;
        var y = this.y * factor;
        
        return new CG.Point(x, y);
    }

    /**
     * A norma do vetor formado pelo ponto é o conprimento daquele.
     * @return {number} a norma do vetor.
     */
    this.norm = function() 
    {
        return Math.sqrt(x^2 + y^2);
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

    var midpoint; 
    var normals = new Array();

    /**
     * Equação paramétrica da reta.
     * @param {number} t parâmetro desejado.
     * @return {CG.Point} ponto na reta na posição t.
     */
    this.parametricPoint = function(t) 
    {
        var x = this.p1.x + this.dx * t;
        var y = this.p1.y + this.dy * t;
        
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
        var n1, n2;
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

CG.Random = function(start, end) 
{
    return Math.floor(Math.random() * end + start);
}

/**
 * Ordenação de pontos em sentido do relógio.
 * @see http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
 * @param {array} points Vetor de pontos a ordenar.
 */
CG.clockwiseSort = function(points) 
{

}
