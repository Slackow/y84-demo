

str = "Hello, World!\0"
one := R11

one << 1
R0 << 0
VR << &str
loop:
R1 << VR[R0]
PC << R1 ?=0 exit
cout << R1
R0 << R0 + one
PC << loop
exit:

R0 << rand
screen << R0
PC << exit
