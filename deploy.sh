git checkout gh-pages
git merge master
yarn install
npm run build
rm -R assets/
mv dist/* .
git add *.html assets/
git commit -m "New deploy"
git push origin gh-pages
git checkout master
