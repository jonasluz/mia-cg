/**
 * Entrada dos dados.
 * @author Jonas de A Luz Jr. <unifor@jonasluz.com>
 */

var vertices = [
    /* Dados de testes */
    {x: 30, y: 40}, {x: 130, y: 430},
    {x: 276, y: 520}, {x: 470, y: 330},
    /* */
];

var cp, rl;

/**
 * Inicializa o JSGrid
 */
initInput = function() 
{
    $("#jsGrid").jsGrid({
        width       : "100%",
        height      : "500px",

        inserting   : true,
        editing     : true,
        sorting     : true,
        paging      : true,

        data: vertices,

        fields      : [
            { name: "x", type: "number", width: 20, validate: "required" },
            { name: "y", type: "number", width: 20, validate: "required" },
            { type: "control" }
        ]
    });
}

/**
 * Converte entrada e chama a rotina de desenho.
 */
draw = function() 
{
    // Valida entrada. Polígono precisa de, pelo menos, três vértices.
    if (vertices.length < 3) 
    {
        alert("O plano de recorte deve ter pelo menos três vértices para ser um polígono!");
        return;
    }

    // Converte os vértices informados na datagrid em um vetor de pontos para o ClippingPlane.
    var points = [];
    vertices.forEach(function(point) 
    {
        points.push(new CG.Point(point.x, point.y));
    }, this);

    // Faz o desenho do plano de recorte.
    cp = new CYRUSBECK.ClippingPlane(points);
    cp.draw(true);
    
   // Cria e desenha as linhas aleatórias.
   var n = $("#inLines")[0].value;
   rl = new CYRUSBECK.RandomLines(n);
   rl.draw(); 

}

clip = function() 
{
    // Recorta as linhas aleatórias criadas.
    CYRUSBECK.clipAndDraw(cp, rl.lines);
}