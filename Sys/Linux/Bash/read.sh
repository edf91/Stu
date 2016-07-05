#!/bin/bash

read -p "read -p:please input your name:" name
echo "$name"

read -p "read -p:please input your age -t 5 (timeout 5s) :" -t 5 age
echo "$age"

read -p "read -p:pleans input your password -s (cant see) :" -s password
echo -e "\n"
echo "password :$password"

read -p "reade -p:please input your sex [M/F] -n 1 :" -n 1 sex
echo -e "\n"
echo "sex :$sex"