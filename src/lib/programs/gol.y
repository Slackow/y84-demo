lim := R8
one := R11
old := R9
cur := R10
two := R6
oldD = [64]
curD = [64]

VR << &oldD
old << VR
VR << &curD
cur << VR
lim << 64
one << 1

two << 2
R4 << lim
startLoop:
R4 << R4 - one
R0 << rand
VR << R0 / two
VR << VR * two
VR << R0 - VR

cur[R4] << VR
PC << R4 ?>0 startLoop

R4 << lim
adjustDelta:
R4 << R4 - one
R0 << old[R4]
VR << cur[R4]
VR << VR - R0
PC << VR ?=0 skip
screen << R4
skip:
PC << R4 ?>0 adjustDelta

R4 << lim
copyToOld:
R4 << R4 - one
VR << cur[R4]
old[R4] << VR
PC << R4 ?>0 copyToOld

R4 << lim
neighborLoop:
R4 << R4 - one


PC << PC