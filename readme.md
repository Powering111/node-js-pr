# WEB SERVER
Using Node.JS

## Features
- make web server
- use database to login, chat
- make realtime chatting
- make some realtime game

## Rules Of Files
Every user files should be in 'Files' folder.
### File Structure
Basic File Structure is this:
```
Files/
├─ methods.js
├─ hypertext/
│  ├─ index.html
│  ├─ about.html
├─ style/
│  ├─ style1.css
│  ├─ style2.css
├─ resources/
│  ├─ image.png
├─ base/
```
- You should put your methods you will use for command in *methods.js*
- HTML files(.html) should be in *hypertext* folder
- Stylesheet files(.css) should be in *style* folder
- Resources files(.jpg/.png/.gif/.bmp) should be in *resource* folder
- base HTML Files(.html) which will replace base command should be in *base* folder

### Additional Syntax of HTML documents (backend)
- **${functionName}** (like JS string) calls **methods.functionName()** and replaced by the function's return value.
- **${functionName:parameter}** calls **methods.functionName(parameter)** and replaced by the function's return value.
- **\$#{functionName}** or **$#{functionName:parameter}** calls **functionName** with additional parameter *variables* as last parameter. You can access your custom variables as member variable of *variables*.
- **${:basename}** is replaced by basefile *basename.html*
- **#{variableName}** is replaced by custom variable *variableName*
- **#{variableName=value}** will make custom variable *variableName* to *value*
- If *functionName* starts with **_** (underscore character), the function is called with *req* as first parameter, *res* as second parameter, and *parameter* as third parameter if exists.
- You should make your method in *methods.js* with correct parameters. Or your code will not work and even server can die.


## Contributors
- Juntae Jeong