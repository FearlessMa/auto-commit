#!/bin/bash

echo 'run git add .';
# Default as minor, the argument major, minor or patch: 
if [ -z "$release" ]; then
    release="minor";
fi

# Default release branch is master 
if [ -z "$branch" ] ; then
    branch="master"; 
fi;


echo "Branch is $branch"
echo "Release as $release"
git add . 
git cz 