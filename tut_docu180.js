txt_tutor=`+ Documentation - Code snippets

-

+ The program can be started with the "Run" button, with Ctrl+R, with Ctrl+Enter or with a double press on Enter.

i = 1
while i <= 10
  print i * i
  i += 1
.

+ Blocks end with *end* or with a dot. Line breaks have no other meaning than spaces. Variables do not have to be declared.

-

# play 10000 times 
# roulette betting on 13
# 
cash = 0
while i < 10000
  cash -= 10
  numb = random 37
  if numb = 13
    cash += 350
  .
  i += 1
.
print "Your cash: " & cash

+ *random 37* returns a random integer between 0 and 36 inclusive.

* Arrays

subr search_max
  max = f[0]
  i = 1
  while i < len f[]
    if f[i] > max
      max = f[i]
    .
    i += 1
  .
.
f[] = [ 27 44 -4 51 36 ]
call search_max
print "Max: " & max

+ *len* returns the array length.

* Floating point

# calculate PI using the 
# Leibniz formula
# 
numb_fmt 0 4
i = 1
while i < 1000
  s += 1 / i
  i += 2
  s -= 1 / i
  i += 2
.
s += 1 / i / 2
print "PI: " & s * 4

+ *numb_fmt* determines the fill space and the number of decimal places when a number is converted to a string. The default values are *0 2*.

-

# calculate PI using
# Monte Carlo method
# 
for i = 1 to 100000
  x = randomf
  y = randomf
  if x * x + y * y < 1
    hit += 1
  .
.
print "PI: " & 4.0 * hit / 100000

+ *randomf* returns a random float value between 0 and 1.

-

# get primes using the 
# Sieve of Eratosthenes
# 
len divisible[] 100
max = sqrt len divisible[]
for tst = 2 to max
  if divisible[tst] = 0
    i = tst * tst
    while i < len divisible[]
      divisible[i] = 1
      i += tst
    .
  .
.
for i = 2 to len divisible[] - 1
  if divisible[i] = 0
    print i
  .
.

+ With *len* you can set the array length. The numeral array elements are initialized with *0*, for string array elements with *""*.

* Strings

a$ = input
a = number a$
if error <> 0
  print a$ & " is not a number"
else
  pr a & " * " & a & " = " & a * a
.

+ String variables end with the *$* character. *input* requests an input from the user. *number* converts a string to an integer. *error* indicates a conversion error. Strings are concatenated with the *&* character.

+ *print* outputs a string to the text console with a line feed. Numbers are converted to strings. *pr* is a shortcut for *print*.

* Subroutines, Functions

subr gcd
  while b <> 0
    h = b
    b = a mod b
    a = h
  .
  res = a
.
a = 120
b = 35
call gcd
print res

+ Subroutines are defined with *subr* and called with *call*. Global variables are used for parameters and return values.

-

func gcd a b . res . 
  while b <> 0
    h = b
    b = a mod b
    a = h
  .
  res = a
.
call gcd 120 35 r
print r

+ Functions are defined with *func* and called with *call*. Value and reference parameters are specified after the function name. Variables that occur for the first time within a function are local to that function.

* Sound

# morse code
# 
txt$ = "sos sos"
# 
chars$[] = str_chars "abcdefghijklmnopqrstuvwxyz "
code$[] = [ ".-" "-..." "-.-." "-.." "." "..-." "--." "...." ".." ".---" "-.-" ".-.." "--" "-." "---" ".--." "--.-" ".-." "..." "-" "..-" "...-" ".--" "-..-" "-.--" "--.." " " ]
# 
func morse ch$ . .
  while ind < len chars$[] and chars$[ind] <> ch$
    ind += 1
  .
  if ind < len chars$[]
    write ch$ & " "
    sleep 0.4
    for c$ in str_chars code$[ind]
      write c$
      if c$ = "."
        play_sound [ 440 0.2 ]
        sleep 0.4
      elif c$ = "-"
        play_sound [ 440 0.6 ]
        sleep 0.8
      elif c$ = " "
        sleep 0.8
      .
    .
    print ""
  .
.
for ch$ in str_chars txt$
  call morse ch$
.

+ *play_sound* plays a list of tones defined by their frequency and duration. The duration in *play_sound* and in *sleep* is specified in seconds.

+ *str_chars* creates a string field from a string that contains the individual characters.

+ The *for in loop* iterates over each item in an array 

+ *write* prints a string without line feed.

* Graphics

# drawing a house
#
# fassad
set_color 993
move_pen 15 45
draw_rect 60 45
# roof
set_color 722
draw_polygon [ 45 20 10 45 80 45 ]
# windows
set_color 555
move_pen 25 50
draw_rect 10 10
move_pen 25 70
draw_rect 10 10
move_pen 55 50
draw_rect 10 10
# door
set_color 654
move_pen 50 70
draw_rect 15 19

+ Graphic coordinates: 0/0 is top left, 100/100 is bottom right. 

+ The colors are coded from 0 to 999, with the left digit specifying the red component, the middle digit the green component and the right digit the blue component. 

+ *set_color -1* sets the foreground color and *set_color -2* the background color as drawing color.

+ *draw_rect* draws a filled rectangle. *draw_polygon* draws a filled polygon.

-

# sine wave
# 
move_pen 10 5
draw_text "Sine wave"
# 
subr calc_y
  deg = x / 100 * 360
  y = 50 - 30 * sin deg
.
set_color 800
set_linewidth 0.5
x = 0
call calc_y
move_pen x y
while x < 100
  call calc_y
  draw_line x y
  x += 0.5
.

+ Coordinates are specified in floating point values and can also take intermediate values. *set_linewidth* sets the line width.

-

# turtle graphics
# 
deg = 0
x = 50
y = 50
down = 0
move_pen x y
func forward n . .
  x += cos deg * n
  y += sin deg * n
  if down = 1
    draw_line x y
  else
    move_pen x y
  .
.
func turn a . .
  deg += a
.
# 
call forward 35
call turn 90
down = 1
for i range 18
  call forward 12
  sleep 0.1
  call turn 20
.

+ In the *for-range* loop, the run variable takes values from 0 to exclusively the specified value. This loop works also well for iterating an array.

-

# visualization of the 
# Monte Carlo algorithm
# 
for i range 100000
  x = randomf
  y = randomf
  if x * x + y * y < 1
    hit += 1
    set_color 900
  else
    set_color 000
  .
  move_pen x * 100 y * 100
  draw_circle 0.5
  if i mod 1000 = 0
    sleep 0.01
  .
.
set_color 000
move_pen 10 10
draw_text "PI: " & 4.0 * hit / i

+ The drawing area is updated when *sleep* is called.

* Event-drivern programming

# simple drawing
#
on mouse_down
  down = 1
  move_pen mouse_x mouse_y
  draw_circle 1
.
on mouse_up
  down = 0
.
on mouse_move
  if down = 1
    draw_line mouse_x mouse_y
  .
.
on key
  if keyb_key = "r"
    set_color 900
  else
    set_color 000
  .
.
set_linewidth 2

+ The *mouse* events are triggered after the corresponding mouse actions. *mouse_x* and *mouse_y* return the mouse position as floating point numbers.

+ The *key* event is triggered when a keyboard key is pressed. *keyb_key* returns the key value.

-

# color picker
# 
c[] = [ 9 0 0 ]
func picker . .
  for i range 10
    f = 100
    for j range 3
      move_pen i * 10 j * 10
      set_color i * f
      draw_rect 10 10
      f = f / 10
    .
  .
  set_color 666
  for i range 3
    move_pen c[i] * 10 + 5 10 * i + 5
    draw_circle 1.5
    col = col * 10 + c[i]
  .
  set_color col
  move_pen 0 30
  draw_rect 100 70
  move_pen 20 50
  set_color 000
  if c[0] + c[1] + c[2] < 15
    set_color 888
  .
  draw_text "set_color " & c[0] & c[1] & c[2]
.
on mouse_down
  if mouse_y < 30
    i = mouse_y div 10
    c[i] = mouse_x div 10
    call picker
  .
.
call picker

*div* is an integer division. The number is rounded down after the division.

* Timer, Animation

# simple clock
# 
on timer
  if t <> floor sys_time
    t = floor sys_time
    clear_screen
    h$ = time_str t
    move_pen 10 15
    draw_text substr h$ 0 10
    move_pen 10 30
    draw_text substr h$ 11 8
  .
  set_timer 0.1
.
while i <= 100
  set_rgb 0 i / 100 0
  move_pen 0 i
  draw_line 100 i
  i += 1
.
set_background -1
set_textsize 12
set_timer 0

+ The set_timer event is triggered with a selectable delay by the *set_timer* command.

+ *sys_time* returns the time in seconds since 1/1/1970. *time_str* creates a time-date string for the specified seconds.

+ *substr* returns a substring from the specified position and length.

+ With *set_rgb* you can set the intensity (0.0 to 1.0) of the red, green and blue color components.

+ With *set_background -1* the current display is set as background, which can be displayed again with *clear_screen*. You can also set a background color with this function.

-

# bouncing ball
# 
rad = 12
x = 50
y = 50
on animate
  if sys_time > timeout
    # every 4 seconds
    timeout = sys_time + 4
    vx = randomf * 4 - 2
    vy = randomf * 4 - 2
    set_color random 999
  .
  clear_screen
  move_pen x y
  draw_circle rad
  x += vx
  y += vy
  if x > 100 - rad or x < rad
    vx = -vx
  .
  if y > 100 - rad or y < rad
    vy = -vy
  .
.

+ The *animate* event is triggered after each screen update (usually 60 times per second). *time* returns the time in seconds since program start.

* More about arrays

a[] = [ 3 4 8 ]
print a[]
# arrays can grow
a[] &= 9
print a[]
# and shrink
len a[] 3
print a[]
for i range len a[]
  print a[i]
.
# with strings
a$[] = [ "zero" "one" "two" "three" ]
print a$[]
# with floats
a[] = [ 1.1 2.2 3.3 ]
print a[]
# 2-dimensional arrays are arrays of arrays
# this defines 3 arrays with length 4
len a[][] 3
for i range len a[][]
  len a[i][] 4
.
a[1][2] = 99
print a[][]
a[1][] &= 12
print a[][]
a[][] &= [ 40 41 42 ]
print a[][]

* More about loops, input data

+ With *input_data* a text section is defined whose lines can be read with *input*.

sum = 0
repeat
  s$ = input
  until error = 1
  sum += number s$
.
print sum
#
input_data
10
-2
6

+ With *repeat* you can make loops, which you can leave in the loop body using *until*.

-

sum = 80036
for i range 50
  for j range 50
    if i * i + j * j * j = sum
      print i & "² + " & j & "³ = " & sum
      break 2
    .
  .
.

+ With *break n* you can leave nested loops. It can also be used to exit a function or a subroutine.

names$[] = [ ]
func name2id name$ . id .
  for id range len names$[]
    if names$[id] = name$
      # leave loop and function
      break 2
    .
  .
  names$[] &= name$
.
call name2id "alice" id
print id
call name2id "bob" id
print id
call name2id "alice" id
print id

* Namespaces

+ Namespaces are implemented with the *prefix* directive. All names - variables, functions, subroutines - within the range specified are prefixed with the specified string.

pos = 12345
# 
prefix st_
# 
len stack[] 100
pos = 0
func push v . .
  if pos < len stack[] - 2
    pos += 1
    stack[pos] = v
  .
.
func pop . v .
  v = stack[pos]
  if pos >= 0
    pos -= 1
  .
.
prefix
# 
call st_push 200
call st_push 100
call st_pop v
print v
call st_pop v
print v
print pos

* Builtin functions

print "--- operators ---"
print 7 + 3
print 7 - 3
print 7 * 3
print 7 / 3
print 7 div 3
print 7 mod 3
print "--- number functions ---"
print pow 2 10
print pow 2 0.5
print sqrt 2
print logn 10
print sin 45
print asin 0.707
print cos 45
print acos 0.707
print tan 45
print atan 1
print atan 100
print atan2 100 0
print pi
print abs -21.34
print number "114.2"
print sys_time
print mouse_x
print mouse_y
print randomf
print random 10
print number "123"
print floor 2.15
print abs -35
print str_ord "A"
print error
a[] = [ 1 2 3 ]
print len a[]
print len "Hello"
print "--- string functions ---"
print time_str sys_time
print str_chr 65
print substr "Hello world" 6 5
print keyb_key
# print input
print ""
a$[] = str_chars "abc"
print a$[]
print str_join a$[]
a$[] = str_split "10,15,22" ","
print a$[]
`

