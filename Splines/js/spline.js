/**
 * splines.js **
 * Funções de desenho da spline.
 * Por Jonas Luz Jr. 
 * 
 */

/** Namespace SPLINE */
var SPLINE = SPLINE || {};

SPLINE._gaussJ = {};

SPLINE._gaussJ.solve = (M) => {

    const L = M.length;
    result = new Array(L);

    for (let k = 0; k < L; ++k) {
        let ix = 0;
        let vi = Number.NEGATIVE_INFINITY;
        for (let i = k; i < L; ++i) {
            let av = Math.abs(M[i][k]); 
            if (av > vi) {
                ix = i;
                vi = av;
            }
        }
        SPLINE._gaussJ.swapRows(M, k, ix);

        for (let i = k + 1; i < L; ++i) {
            let cf = M[i][k] / M[k][k];
            for (let j = k; j < L + 1; ++j)
                M[i][j] -= M[k][j] * cf;
        }
    }

    for (let i = L - 1; i >= 0; --i) {
        result[i] = M[i][L] / M[i][i];
        for (let j = i - 1; j >= 0; --j) {
            M[j][L] -= M[j][i] * result[i];
            M[j][i] = 0;
        }
    }

    return result;
} // solve

/**
 * Retorna uma matrix nula de tamanho r X c.
 */
SPLINE._gaussJ.zerosMatrix = (r, c) => {
    let M = [];
    for (let i = 0; i < r; ++i) {
        M.push([]);
        for (let j = 0; j < c; ++j)
            M[i].push(0);
    }
    return M;
} // zerosMatrix.

/**
 * Imprime uma matriz.
 */
SPLINE._gaussJ.printMatrix = (M) => {
    for (let i = 0; i < M.length; ++i) 
        console.log(M[i]);
} // printMatrix.

/**
 * Troca as linhas na matriz;
 */
SPLINE._gaussJ.swapRows = (m, k, l) => {
    let p = m[k]; 
    m[k] = m[l];
    m[l] = p; 
} // swaptRows.

/**
 * Calcula os Ks
 */
SPLINE.calcNaturalKs = (xs, ys) => {

    let n = xs.length - 1;
    let M = SPLINE._gaussJ.zerosMatrix(n + 1, n + 2);

    for (let i = 1; i < n; ++i) {

            M[i][i-1] = 1/(xs[i] - xs[i-1]);
			M[i][i  ] = 2 * (1/(xs[i] - xs[i-1]) + 1/(xs[i+1] - xs[i]));
			M[i][i+1] = 1/(xs[i+1] - xs[i]);
			M[i][n+1] = 3*( (ys[i]-ys[i-1])/((xs[i] - xs[i-1])*(xs[i] - xs[i-1]))  +  
                            (ys[i+1]-ys[i])/ ((xs[i+1] - xs[i])*(xs[i+1] - xs[i])) );     
    }

    M[0][0  ] = 2/(xs[1] - xs[0]);
    M[0][1  ] = 1/(xs[1] - xs[0]);
    M[0][n+1] = 3 * (ys[1] - ys[0]) / ((xs[1]-xs[0])*(xs[1]-xs[0]));
    
    M[n][n-1] = 1/(xs[n] - xs[n-1]);
    M[n][n  ] = 2/(xs[n] - xs[n-1]);
    M[n][n+1] = 3 * (ys[n] - ys[n-1]) / ((xs[n]-xs[n-1])*(xs[n]-xs[n-1]));

    return SPLINE._gaussJ.solve(M);
} // calcNaturalKs

/**
 * Calcula a spline.
 */
SPLINE.calcSpline = (x, xs, ys, ks) => {
		
    let i = 1;
    while(xs[i]<x) ++i;
    
    let t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
    
    let a =  ks[i-1]*(xs[i]-xs[i-1]) - (ys[i]-ys[i-1]);
    let b = -ks[i  ]*(xs[i]-xs[i-1]) + (ys[i]-ys[i-1]);
    
    let q = (1-t)*ys[i-1] + t*ys[i] + t*(1-t)*(a*(1-t)+b*t);
    return isNaN(q) ? ys[i-1] : q;
}

