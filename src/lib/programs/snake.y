
// This is snake, being emulated in my CPU,
// The code that defines this program is all below
// You can switch programs using the picker above,
// or you can make your own!
// - Controls are WASD to move (click the canvas)
// - Score is printed in base 10 after death
// - If you get >=15 points, you get a smiley face
// - The board loops around

// data seg
message = "\n\n Score: \0"
message2 = "\n Press any key to restart\0"
dataD = [64]    // node position list
dataCD = [64]   // table list
keysD = [26]
keysD[('a'-'a')] = 1
keysD[('d'-'a')] = -1
keysD[('s'-'a')] = 8
keysD[('w'-'a')] = -8

// aliases
keys := R0
data := R9
dataC := R8
one := R11
head := R3
length := R1
apple := R2
sixty_four := R7
idx := R5

// init (text segment)
VR << &keysD
keys << VR        // R0 = keys
VR << &dataD
data << VR        // R9 = data
VR << &dataCD
dataC << VR        // R8 = dataC
VR << ('a')
keys << keys - VR   // tweak R0 to avoid subtraction

one << 1        // R11 = 1
VR << (2 ** 10)
R10 << VR
sixty_four << 64

head << 16                // R3 = head
length << 0
idx << 0
R6 << 1
screen << ZR

mmm:
length << length + one  // increment length
screen << apple
apple << rand           // generate apple
apple << apple / R10    // limit to 64
R4 << length - one //start index
shift:
VR << R4 - idx
PC << VR ?=0 shiftBr
VR << R4 - one
VR << data[VR]
data[R4] << VR
R4 << R4 - one
PC << shift

shiftBr:
data[idx] << apple
dataC[apple] << ZR
loop:
VR << cin

PC << VR ?=0 noPress
VR << keys[VR]   // newDelta
PC << VR ?=0 noPress
VR << R6 + VR
PC << VR ?=0 noPress // if newDelta cancels out then ignore
R6 << VR - R6
noPress:

VR << 40
delay80: // delay by 80 instructions (80ms)
VR << VR - one
PC << VR ?>0 delay80
VR << head - apple        // if apple found, jump to mmm
PC << VR ?=0 mmm

VR << R6 * R6 //^2 delta
VR << R6 - one
PC << VR ?>0 normalMove
VR << 8
R4 << head / VR
head << head + R6
VR << head / VR
VR << VR - R4
PC << VR ?=0 correctMove
VR << 8
VR << R6 * VR
head << head - VR
PC << correctMove
normalMove:
head << head + R6           // head to new position
correctMove:
VR << head / sixty_four
VR << VR * sixty_four
head << head - VR        // head %= 64
VR << dataC[head]        // check node presence
PC << VR ?>0 exit       // die if self intersected
screen << head          // display head
VR << data[idx]
screen << VR    // turn off tail
dataC[VR] << ZR // remove tail from collision bounds
dataC[head] << one // add head to collision bounds

data[idx] << head
idx << idx + one
idx << idx - length
PC << idx ?=0 loop
idx << idx + length
PC << loop
exit: // everything beyond handles losing/resetting the game for the next play

// remove snake
R7 << -1
R4 << idx // set i
R3 << length // set bound
VR << 80
removeLoop:
// delay
VR << VR - one
PC << VR ?>0 removeLoop
VR << R3 - R4 // if(i != len)
PC << VR ?=0 brRemoveLoop
VR << data[R4]
screen << VR
R4 << R4 + one

VR << 25
PC << removeLoop
brRemoveLoop:
R7 << R7 + one
R4 << 0
R3 << idx
VR << 23
PC << R7 ?=0 removeLoop // loop again
// remove apple
screen << apple

// output num (final score)
VR << &message
R0 << VR
PC@ << printMsg

R5 << 10
R2 << length / R5       // top digit
R4 << R2 * R5           // xy -> x0
R5 << ('0')
PC << R2 ?=0 skipTopDig // skip printing top digit if 0
R2 << R2 + R5
cout << R2              // print top digit
skipTopDig:
R4 << R1 - R4           // xy - x0 -> y
R4 << R4 + R5
cout << R4              // print bottom digit

VR << &message2
R0 << VR
PC@ << printMsg

// clear key buffer
clearBuffer:
VR << cin
PC << VR ?>0 clearBuffer // repeat until no key


R7 << 0
// display face
// eyes
VR << 18
screen << VR
VR << 21
screen << VR
R0 << 14
VR << length - R0
PC << VR ?>0 smile

frown:
VR << 45
screen << VR
VR << 42
screen << VR
VR << 36
screen << VR
VR << 35
screen << VR

PC << R7 ?>0 reset
keyLoop:
R7 << cin
PC << R7 ?=0 keyLoop
PC << frown

smile:
VR << 37
screen << VR
VR << 34
screen << VR
VR << 43
screen << VR
VR << 44
screen << VR


PC << R7 ?>0 reset
keyLoop2:
R7 << cin
PC << R7 ?=0 keyLoop2
PC << smile


reset:
// undo eyes
VR << 18
screen << VR
VR << 21
screen << VR
// clear terminal
VR << ('\x0C')
cout << VR

apple << 0
// empty collision data
VR << 64
emptyC:
VR << VR - one
dataC[VR] << ZR
PC << VR ?=0 ZR // to top if done
PC << emptyC

// printMsg method, prints R0 as string
printMsg:
R2 << R0[ZR]
PC << R2 ?=0 LR // return if reached '\0'
cout << R2
R0 << R0 + one
PC << printMsg // tail recursion


//// {"keys":[["", "w", ""], ["a", "s", "d"]]}