
one := R11
dot := R8
delta := R6
dot << 4
one << 1
screen << dot
delta << 57 // 57
R7 << 64
VR << R7 - dot
screen << VR
loop:
VR << 100
delay:
VR << VR - one
PC << VR ?>0 delay
screen << dot
VR << R7 - dot
screen << VR
dot << dot + delta
VR << R7 - dot
screen << VR
screen << dot
PC << loop