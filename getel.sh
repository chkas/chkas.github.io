#!/bin/sh

# copies Easylang website to current directory

srv=https://tiki.li
test $1 && srv=$1

test $ZSH_VERSION && setopt SH_WORD_SPLIT
wget -N $srv/vers.txt $srv/index.html
v=$(cat vers.txt | cut -c3-)
echo "Easylang version: $v"

# ------------  IDE --------------------
mkdir -p ide; cd ide
s=$srv/ide
dl="$s/index.html $s/sw.js $s/mfst.json $s/icon.png $s/icon.svg"
dl="$dl $s/easyw$v.js $s/easyw$v.wasm"
for t in id learn learnx game docu func; do
	dl="$dl $s/tut_$t$v.js"
done
wget -N $dl
cd ..

# ------------  APPS --------------------
mkdir -p apps ; cd apps
s=$srv/apps
dl="$s/index.html $s/easy_code2.js $s/easy.js $s/easy_tut2.js $s/easy_tut2x.js $s/easyw.js $s/easyw.wasm"
echo $dl
wget -N $dl
files=$(grep "apps/.*\.html" index.html | sed "s/.*apps\/\(.*\)?.*/\1/g")
dl=""
for f in $files; do
	dl="$dl $s/$f"
done
wget -N $dl
cd ..

# ------------  RUN --------------------
mkdir -p run ; cd run
s=$srv/run
dl="$s/index.html $s/sw.js $s/mfst.json $s/icon.png $s/icon.svg"
dl="$dl $s/easyw$v.js $s/easyw$v.wasm"
wget -N $dl
cd ..

# ------------  GAMES --------------------
mkdir -p games ; cd games
s=$srv/games
wget -N $s/index.html
cd ..
