zero := R9
one := R11
ten := R10

one << 1
zero << ('0')
ten << 10
R6 << 0
R7 << 1
R8 << 2

loop:
R0 << R6
R6 << R6 + R7
R7 << R7 + R8
PC@ << printNum
VR << (' ')
cout << VR
PC << loop


printNum: //protoPrintf (prints R0 to terminal)

SP << SP - one
SP[ZR] << ZR
cont:
R1 << R0 / ten
R2 << R1 * ten
R2 << R0 - R2 // isolate digit (R0 % 10) = (R0 - (R0 / 10) * 10)
R2 << R2 + zero // + '0'
SP << SP - one
SP[ZR] << R2
R0 << R1 // R0 /= 10
PC << R1 ?>0 cont // continue if there's more digits

digLoop:
R1 << SP[ZR]
SP << SP + one
PC << R1 ?=0 LR
cout << R1
PC << digLoop