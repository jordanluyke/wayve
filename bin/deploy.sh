#!/usr/bin/env bash

npm start build
git branch -D gh-pages
git push origin --delete gh-pages
git checkout -b gh-pages
git add site -f
git commit -m "site update"
git subtree push --prefix site origin gh-pages
git checkout master
git branch -D gh-pages
