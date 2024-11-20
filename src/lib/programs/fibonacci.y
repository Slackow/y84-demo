// Prints the Fibonaccis
// Limited by 16-bit

zero := R9
ten := R10
one := R11
// fib
R0 << 0
R1 << 1
one << 1
R8 << 24
loop:
R2 << R0 + R1
R0 << R1
R1 << R2
SP << SP - one
SP[ZR] << R0
SP << SP - one
SP[ZR] << R1
SP << SP - one
SP[ZR] << R2

PC@ << printNum
R2 << SP[ZR]
SP << SP + one
R1 << SP[ZR]
SP << SP + one
R0 << SP[ZR]
SP << SP + one
VR << (' ')
cout << VR
R8 << R8 - one
PC << R8 ?=0 PC
PC << loop


printNum: //protoPrintf (prints R0 to terminal)
zero << ('0')
ten << 10
one << 1
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