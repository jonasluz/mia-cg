# -*- coding: utf-8 -*-

## common.py
#   Common functions and dat astructures.
from typing import List
Vector = List[float]

import numpy as np

def dcos(v: Vector, verbose=False):
    """
    Calcula os cosenos diretores do vetor a.
    Para cada componente c1, c2, ... cn do vetor v, o cosseno diretor é dado por:
        dcosk = ck / ||v||
    """
    result = []
    
    norm = np.linalg.norm(v)    # norma do vetor dado ||v||
    if verbose:
        print("Norm of vector {} is {}".format(v, norm))
    
    for component in v:
        result.append(component / norm)
        
    return result

def energy(photons=1):
    """
    Função da energia emitida pelo número indicado de photons.
    """
    
    # Plank constant
    h = 6.6e-34 # J s
    
    # Speed of light
    c = 3e8 # m/s
    
    # Photon wavelength
    photon_wl = 650 # nm
    
    # Nanometer factor
    nm = 1e-9
    
    # Photon energy
    sigma = photon_wl * nm
    e = (h * c) / sigma
    
    return(photons * e)
