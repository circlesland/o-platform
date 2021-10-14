#!/bin/bash

export DEPLOY_ENVIRONMENT=$1

echo "Installing build dependencies .."
npm i
yarn --ignore-engines || exit

echo "Building 'o-utils' .."
cd packages/o-utils || exit
tsc || exit
cd .. || exit

echo "Building 'o-events' .."
rm -r -f o-events/dist
cd o-events || exit
tsc || exit
cd .. || exit

echo "Building 'o-interfaces' .."
cd o-interfaces || exit
tsc || exit
cd .. || exit

echo "Building 'o-process' .."
cd o-process || exit
tsc || exit
cd .. || exit

echo "Building 'o-circles' .."
cd o-circles || exit
tsc || exit
cd ../.. || exit

echo "Generating graphql types for shared/api/data"
echo "* api"
cd shell/src/shared/api/data
npx graphql-codegen
echo "* api"
npx graphql-codegen

cd ../../../../..
echo "Generating graphql types for dapps/o-passport"
#echo "* api"
#cd shell/src/dapps/o-passport/data/api
#npx graphql-codegen
echo "* auth"
cd shell/src/dapps/o-passport/data/auth
npx graphql-codegen

# cd ../../../../../..
# echo "Generating graphql types for dapps/o-contacts"
# echo "* api"
# cd shell/src/dapps/o-contacts/data/api
# npx graphql-codegen

cd ../../../../../..
echo "Generating graphql types for dapps/o-marketplace"
echo "* api"
cd shell/src/dapps/o-marketplace/data/api
npx graphql-codegen

cd ../../../../../..
echo "Generating graphql types for dapps/o-banking"
echo "* api"
cd shell/src/dapps/o-banking/data/api
npx graphql-codegen

cd ../../../../../..

echo "Building 'shell' with dapps .."
cd shell || exit
npm run build
cd .. || exit


search='__TIMESTAMP__'
replace=`date +"%s"`
search_replace="s/$search/$replace/g"
cp -f ./shell/public/index.template.html ./shell/public/index.html
sed -i.bak "$search_replace" ./shell/public/index.html
rm -f ./shell/public/index.html.bak