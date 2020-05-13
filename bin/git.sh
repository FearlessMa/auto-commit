#!/bin/bash

echo 'git bash 脚本';
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
# 输出内容
# while read line
# do
#    echo $line
# done < CHANGELOG.md

read -p "是否进行版本号升级? [y/n] " versionNumber

case $versionNumber in
  [yY]*)
    read -p "是否是预发版本? [y/n] " versionAlpha
    if [ $versionAlpha = "y" ] || [ $versionAlpha = "Y" ]
    then
      echo "版本号升级"
      npm run releasealpha
      echo "打印所有tags"
      git tag
    else
      echo "版本号升级"
      npm run release
      echo "打印所有tags"
      git tag
    fi
    ;;
  [nN]*)
    echo "跳过版本升级"
    ;;
esac



read -p "是否进行git提交? [y/n] " input

case $input in
        [yY]*)
                echo "git 操作"
                git add . 
                git cz 
                ;;
        [nN]*)
                echo "跳过git提交"
                #exit
                ;;
        # *)
        #         echo "Just enter y or n, please."
        #         exit
        #         ;;
esac


read -p "是否更新changelog? [y/n] " changelog

case $changelog in
        [yY]*)
                echo "changelog 操作"
                npm run changelog
                git add .
                git cz 
                ;;
        [nN]*)
                echo "跳过changelog"
                #exit
                ;;
        # *)
        #         echo "Just enter y or n, please."
        #         exit
        #         ;;
esac

if [ $input = "y" ] || [ $input = "Y" ]
then
  echo "**************git pull**************"
  git pull 
  echo "**************git push**************"
  git push 
  echo "**************git push --tags**************"
  git push --tags
fi
echo "************** end **************"
