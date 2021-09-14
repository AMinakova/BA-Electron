REM execute "npm run build" before

npx electron-packager . electron-todo-app --platform=win32 --arch=ia32 --prune=true --out=release-builds --overwrite --ignore=^^src --ignore=\.csv --ignore=\.cmd --ignore=\.git* --ignore=node_modules/\.cache --ignore=node_modules/[@hjmr\.]
