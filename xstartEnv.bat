cd C:\Users\Olena\AppData\Local\Android\Sdk\emulator
start cmd /k "emulator.exe -avd Pixel_XL_API_30"

timeout /t 10

cd %~dp0
start cmd /k "npm start"