#!/bin/sh
home_path=/www/0701.info/balancefit-7201/balancefit-v1-server

echo ${home_path}
cd ${home_path}
# git checkout develop
git stash
sleep 1
git pull
sleep 1
npm install pm2 -g
sleep 5 
npm install 
sleep 5 
pm2 stop ${home_path}/ecosystem.config.cjs
sleep 1
npm run build
sleep 5 
# pm2 start ${home_path}/ecosystem.config.cjs --env production
pm2 start ${home_path}/ecosystem.config.cjs --env development 

echo 'finsh deploy'
