#!/bin/bash

num1=$1
num2=$2
sum=$(($num1 + $num2))
echo 'var sum: ' $sum
sum=$((5 + 1))
echo $sum

echo "\$* (can not use for in,is all var as string)var is : $*"
echo "\$* for i in \"\$*\""
for i in "$*"
	do
		echo "\$* var for in value : $i"
	done
echo "but \$* use for i in \$* can as \$@"
for i in $*
	do
		echo "\$* var for in value : $i"
	done
echo "\$@ (can use for in) var is : $@"
for i in "$@"
	do
		echo "\$@ var for in value : $i"
	done
echo "\$# var is : $#"
