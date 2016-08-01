#!/usr/bin/env bash

git checkout gh-pages
git add site -f && git commit -m "site update" && git subtree push --prefix site origin gh-pages
git checkout master
