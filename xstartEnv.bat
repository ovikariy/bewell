cd C:\Users\Olena\AppData\Local\Android\Sdk\emulator
start cmd /k "emulator.exe -avd Pixel_3a_API_30_x86"

timeout /t 10

cd %~dp0
start cmd /k "npm start"