/**
 * Entrada dos dados.
 * @author Jonas de A Luz Jr. <unifor@jonasluz.com>
 */

var INPUT = INPUT || {}

INPUT.vertices = [
    /* Dados de testes */
    {x: 100, y:100}, {x: 100, y: 500}, {x: 130, y: 530}, {x: 760, y: 420}, 
    {x: 250, y:350}, {x: 470, y: 100}, //{x: 200, y: 200},
    /* */
];

/**
 * Inicializa a entrada.
 */
INPUT.init = () => 
{
    $("#jsGrid").jsGrid({
        width       : "100%",
        height      : "500px",

        inserting   : true,
        editing     : true,
        sorting     : true,
        paging      : true,

        data: INPUT.vertices,

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
INPUT.draw = () => 
{
    // Valida entrada. Polígono precisa de, pelo menos, três vértices.
    if (INPUT.vertices.length < 3) {
        alert("O plano de recorte deve ter pelo menos três vértices para ser um polígono!");
        return;
    }

    // Converte os vértices informados na datagrid em um vetor de pontos para o ClippingPlane.
    let points = [];
    for (let point of INPUT.vertices) {
        points.push(new CG.Point(point.x, point.y));
    }

    // Faz o desenho do plano de recorte.
    cp = new CYRUSBECK.ClippingPlane(points);
    cp.draw(true);
    
   // Cria e desenha as linhas aleatórias.
   let n = $("#inLines")[0].value;
   rl = new CYRUSBECK.RandomLines(n);
   rl.draw(); 
}

INPUT.clip = function() 
{
    // Recorta as linhas aleatórias criadas.
    CYRUSBECK.clipAndDraw(cp, rl.lines);
}   