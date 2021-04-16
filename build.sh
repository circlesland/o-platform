#!/bin/bash
echo "Installing build dependencies .."
npm i
npx --no-install lerna bootstrap || exit

echo "Building 'o-utils' .."
cd packages/o-utils || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'o-events' .."
cd o-events || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'o-process' .."
cd o-process || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'o-interfaces' .."
cd o-interfaces || exit
npx --no-install tsc || exit
cd ../.. || exit

echo "Building 'shell' with dapps .."
cd shell || exit
npm run build
cd .. || exit
