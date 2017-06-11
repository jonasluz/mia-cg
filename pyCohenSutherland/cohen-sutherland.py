# -*- coding: utf-8 -*-

import sys
import cs

def main():
    """
    Rotina principal.
    """

    # Lê arquivo de dados. 
    filename = sys.argv[1] if len(sys.argv) > 1 else 'input.dat' 
    file = open(filename, 'r')
    data = file.read()
    lines = data.split("\n")
    wlims = [int(s) for s in lines[0].split(" ")]
    left, right, bottom, top = wlims[0], wlims[1], wlims[2], wlims[3]
    segments, name = {}, "A"
    for i in range(1, len(lines)-1):
        segment = [int(s) for s in lines[i].split(' ')]
        segments[name] = ( segment[0], segment[1], segment[2], segment[3] )
        name = chr(ord(name)+1)
    
    print('Janela: ({:}, {:}) - ({:}, {:})'.format(left, right, bottom, top))
    print('Segmentos: {}'.format(len(segments)))
    for name, segment in segments.items():
        print('{} - ({:}, {:}) - ({:}, {:})'
              .format(name, segment[0], segment[1], segment[2], segment[3]))

    cs.drawWindow(left, right, bottom, top) 
    
    for name, points in segments.items():
        cs.drawLine(name, *points, color='red')
        result = cs.CohenSutherland(left, right, bottom, top, *points)
        if result:
            cs.drawLine(None, *result, linewidth=1.5, color='blue')
            
    cs.show()
    

if __name__ == "__main__":
    main()
    