git checkout gh-pages
git merge master

yarn build-js
yarn build-sass
git add -A

git commit -m "New deploy"
git push origin gh-pages
git checkout master
