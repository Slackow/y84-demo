
// A Calculator that handles
// unsigned 16-bit multiplication
// simply type the problem in
// ex: 123*8\n => 984
// click the console or canvas to type


ten := R10
mult := R9
zero := R11
newline := R8
one := R6

R1 << ('>')
cout << R1
R1 << (' ')
cout << R1
ten << 10
mult << ('*')
zero << ('0')
newline << ('\n')
R1 << 0
R2 << 0
in1:
R3 << cin
PC << R3 ?=0 in1
cout << R3
R4 << R3 - mult
PC << R4 ?=0 in2
R1 << R1 * ten
R1 << R1 - zero
R1 << R1 + R3
PC << in1
in2:
R3 << cin
PC << R3 ?=0 in2
cout << R3
R4 << R3 - newline
PC << R4 ?=0 res
R2 << R2 * ten
R2 << R2 - zero
R2 << R2 + R3
PC << in2
res:
R0 << R1 * R2

R1 << ('=')
cout << R1
R1 << (' ')
cout << R1
SP << -1
PC@ << printNum
VR << (' ')
cout << VR
VR << (':')
cout << VR
VR << (')')
cout << VR

PC << PC

printNum: //protoPrintf (prints R0 to terminal)
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


//// {"keys":[["7","8","9"],["4","5","6"],["1","2","3"],["*","0","\n⏎"]]}