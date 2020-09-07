build:
	electron-packager . once --platform=win32 --arch=x64 --overwrite --icon "app/imgs/icons/mipmap-mdpi/ic_launcher.png"

drun:
	set LDEV=1
	npm start