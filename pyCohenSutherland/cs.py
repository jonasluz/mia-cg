# -*- coding: utf-8 -*-
"""
UNIVERSIDADE DE FORTALEZA - UNIFOR
DEPARTAMENTO DE PÓS-GRADUAÇÃO EM INFORMÁTICA APLICADA - PPGIA
Disciplina: Probabilidade e Estatística
Resolução de Exercícios
----
Aluno: Jonas de Araújo Luz Jr. <jonasluzjr@edu.unifor.br>
"""

## BIBLIOTECAS
#
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.lines as lines
from mpl_toolkits.axes_grid.axislines import SubplotZero

def initplot(size):
    """
    Inicializa o desenho de gráficos.
    """
    fig = plt.figure(1)
    ax = SubplotZero(fig, 111)
    fig.add_subplot(ax)
    for direction in ["xzero", "yzero"]:
        ax.axis[direction].set_axisline_style("-|>")
        ax.axis[direction].set_visible(True)
    for direction in ["left", "right", "bottom", "top"]:
        ax.axis[direction].set_visible(False)
    ax.set_xlim(-10, size)
    ax.set_ylim(-10, size)
    
    return (fig, ax)

def drawWindow(left, right, bottom, top):
    """
    Desenha a janela de visualização.
    """
    limR = right + 100
    ix, iy = np.linspace(0, limR, limR - left), np.zeros(limR - left)
    xw, xh = np.linspace(left, right, right-left+1), np.zeros(top-bottom+1)
    yw, yh = np.zeros(right-left+1), np.linspace(bottom, top, top-bottom+1)    
    for mark in (bottom, top):
        ax.plot(ix, iy + mark, linestyle=(0, (1, 5)), linewidth=1.0, color='black')
        ax.plot(xw, yw + mark, linestyle=(0, ()), linewidth=1.5, color='black')
    for mark in (left, right):
        ax.plot(iy + mark, ix, linestyle=(0, (1, 5)), linewidth=1.0, color='black')
        ax.plot(xh + mark, yh, linestyle=(0, ()), linewidth=1.5, color='black')    
    
def drawLine(item, p1x, p1y, p2x, p2y, linewidth=1.0, color='blue'):
    """
    Desenha a linha passada.
    """

    mx, my = p2x - p1x, p2y - p1y  # deltas x e y.
    pm = (p1x + mx/2, p1y + my/2)  # ponto médio.
    m = my / mx if mx != 0 else float('inf')  # inclinação da reta.
    
    x, y = [], []
    if m == float('inf'):
        x = np.zeros(100) + p1x
        y = np.linspace(p1y, p2y, 100)
    else: 
        x = np.linspace(p1x, p2x, 100)
        y = p1y + m * (x - p1x)
        
    ax.plot(x, y, linewidth=linewidth, color=color)
    if item: 
        ax.annotate(item,
                xy=pm, xycoords='data',
                xytext=(30, -15), textcoords='offset points',
                arrowprops=dict(facecolor='black', shrink=0.05),
                horizontalalignment='right', verticalalignment='middle')

INF = float('inf')     # infinito.

BIT_L = 0B0001
BIT_R = 0B0010
BIT_B = 0B0100
BIT_T = 0B1000

def f(x, m, x1, y1):
    """
    Equação da reta para y
    """
    return y1 + m * (x - x1)

def fi(y, m, x1, y1):
    """
    Equação da reta para x
    """
    return ( x1 + (y - y1) / m ) if m != INF else x1

def csBinaryCode(left, right, bottom, top, x, y):
    """
    Algoritmo de Cohen-Sutherland para recorte bidimensional em uma janela retangular.
    Subrotina para calcular o código de determinado ponto.
    """
    result = 0b0000
    if x < left:    result |= BIT_L
    elif x > right: result |= BIT_R
    if y < bottom:  result |= BIT_B
    elif y > top:   result |= BIT_T
        
    return result
    
def csIntersect(left, right, bottom, top, x, y, m, c, verbose=None):
    """
    Calcula o ponto de intersecção válido a partir do ponto (x, y)
    """
    p = (x, y)
    if c: 
        if c & BIT_L:                            # ponto à esquerda.
            p = (left, f(left, m, x, y))         # intersecção com esquerda.
        elif c & BIT_R:                          # ponto à direita.
            p = (right, f(right, m, x, y))       # intersecção à direita.
        c = csBinaryCode(left, right, bottom, top, *p)
        if verbose: print('{}\'={} - código: {:b}'.format(verbose, p, c))
        if c & BIT_B:                            # ponto abaixo.
            p = (fi(bottom, m, x, y), bottom)    # intersecção abaixo. 
        elif c & BIT_T:                          # ponto acima.
            p = (fi(top, m, x, y), top)          # intersecção acima.
        c = csBinaryCode(left, right, bottom, top, *p)
        if verbose: print('{}\'={} - código: {:b}'.format(verbose, p, c))
            
    return (p, c)
    
def CohenSutherland(left, right, bottom, top, p1x, p1y, p2x, p2y, verbose=False):
    """
    Algoritmo de Cohen-Sutherland para recorte bidimensional em uma janela retangular.
    """    
    p1, p2 = (p1x, p1y), (p2x, p2y)
    c1 = csBinaryCode(left, right, bottom, top, *p1)
    c2 = csBinaryCode(left, right, bottom, top, *p2)

    if verbose: 
        print('VERIFICANDO O SEGMENTO DE RETA {}-{} NA JANELA {}'.
              format(p1, p2, (left, right, bottom, top)))
        print('--------------------------------------------------------------------')
        print('Os códigos binários são: P1{}: {:b} e P2{}: {:b}.'.
              format(p1, c1, p2, c2))
    
    result, m = None, None
    if c1 & c2:     # caso trivial de invisitibilidade total.
        assert True
    
    # senão, c1 & c2 == 0 - é total ou parcialmente visível.
    elif c1 | c2:     # parcialmente visível.
        mx, my = p2x - p1x, p2y - p1y             # deltas x e y.
        m = my / mx if mx != 0 else INF           # inclinação da reta.
        
        ## Calcula intersecções com as arestas.
        #
        p1, c1 = csIntersect(left, right, bottom, top, *p1, m, c1, 
                             'P1' if verbose else None)
        p2, c2 = csIntersect(left, right, bottom, top, *p2, m, c2, 
                             'P2' if verbose else None)
        result = (*p1, *p2)
        
    else:           # totalmente visível.
        result = (*p1, *p2)
    
    if verbose: 
        msg = 'TRIVIAL E COMPLETAMENTE IN' if result == None else ('PARCIALMENTE ' if c1 | c2 else 'TOTALMENTE ')
        print('O segmento de reta é {}VISÍVEL'.format(msg))            
        if result != None:
            print('A inclinação da reta é {}'.format(m))
            print('Deve-se traçar o segmento {}-{}'.
                  format((result[0], result[1]), (result[2], result[3])))
        print('====================================================================\n')
        
    return result

def show():
    plt.tight_layout()
    plt.show()
    
fig, ax = initplot(1000) 