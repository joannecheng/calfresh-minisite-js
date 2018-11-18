git checkout gh-pages
git merge master

yarn build-js
yarn build-sass
git add -A

git push origin gh-pages
git checkout master
