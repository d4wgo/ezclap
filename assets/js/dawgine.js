//image refrences
//---------------
var gameObjects = []; //gameobjects are seen by rayscans
var nullObjects = []; //null objects are not seen by rayscans
var ui = [];
var buttons = []; //clickable buttons
//gameObject
//syntax:
//new var newGO = GameObject(id,x,y,posX,posY,sizeX,sizeY);
//font:
var font = "myriad-pro";
var worldTextAlign = "center";
//gameObjects.push(newGO);
class GameObject{
    constructor(a,b,c,d,e){
        this.id = a;
        this.x = b;
        this.y = c;
        this.sizeX = d;
        this.sizeY = e;
        this.image = null;
        this.color = null;
        this.gravity = null;
        this.rotation = null;
        this.clicked = null;
        this.hovered = null;
        this.gravityTimer = 0;
        this.yForce = 0;
        this.text = null;
        this.textColor = "black";
        this.textSize = 20;
        this.textOffsetY = 0;
        this.textOffsetX = 0;
        this.parent = null;
        this.changeX = 0;
        this.changeY = 0;
        this.rotateBox = null;
    }
}
function findObject(id){
    for(var i = 0; i < gameObjects.length; i++){
        if(gameObjects[i].id == id){
            return gameObjects[i];
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        if(nullObjects[i].id == id){
            return nullObjects[i];
        }
    }
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i].id == id){
            return buttons[i];
        }
    }
    for(var i = 0; i < ui.length; i++){
        if(ui[i].id == id){
            return ui[i];
        }
    }
    return null;
}
function deleteObject(id){
    var found = false;
    for(var i = 0; i < gameObjects.length; i++){
        if(gameObjects[i].id == id){
            gameObjects.splice(i,1);
            found = true;
            break;
        }
    }
    if(!found){
        for(var i = 0; i < nullObjects.length; i++){
            if(nullObjects[i].id == id){
                nullObjects.splice(i,1);
                found = true;
                break;
            }
        }
        if(!found){
            for(var i = 0; i < buttons.length; i++){
                if(buttons[i].id == id){
                    buttons.splice(i,1);
                    found = true;
                    break;
                }
            }
            if(!found){
                for(var i = 0; i < ui.length; i++){
                    if(ui[i].id == id){
                        ui.splice(i,1);
                        break;
                    }
                }
            }
        }
    }
}
//rayscan
//syntax:
//rayscan(starting x, starting y, angle, distance)
function rayscan(startX,startY,angle,dist){
    var checkX = startX;
    var checkY = startY;
    var ang = angle;
    for(var i = 0; i < dist; i++){
        for(var j = 0; j < gameObjects.length; j++){
            var objCheck = gameObjects[j];
            if(objCheck.rotation == null || objCheck.rotation == 0){
                if(checkX >= (objCheck.x - objCheck.sizeX/2) && checkX <= (objCheck.x + objCheck.sizeX/2) && checkY <= (objCheck.y + objCheck.sizeY/2) && checkY >= (objCheck.y - objCheck.sizeY/2)){
                    return objCheck;
                }
            }
            else{
                if(pythagTheorem(objCheck.sizeX/2,objCheck.sizeY/2) > pythagTheorem(objCheck.x - checkX, objCheck.y - checkY)){
                    //tl
                    var farXtL = -(objCheck.sizeX / 2);
                    var farYtL = -(objCheck.sizeY / 2);
                    var radiustL = pythagTheorem(farXtL,farYtL);
                    var initRottL = Math.atan(farYtL / farXtL);
                    var paX = (Math.cos(objCheck.rotation + initRottL) * radiustL) + objCheck.x;
                    var paY = (Math.sin(objCheck.rotation + initRottL) * radiustL) + objCheck.y;
                    //tr
                    var farXtR = (objCheck.sizeX / 2);
                    var farYtR = -(objCheck.sizeY / 2);
                    var radiustR = pythagTheorem(farXtR,farYtR);
                    var initRottR = Math.atan(farYtR / farXtR);
                    var pbX = (Math.cos(objCheck.rotation + initRottR) * radiustR) + objCheck.x;
                    var pbY = (Math.sin(objCheck.rotation + initRottR) * radiustR) + objCheck.y;
                    //br
                    var farXbR = (objCheck.sizeX / 2);
                    var farYbR = (objCheck.sizeY / 2);
                    var radiusbR = pythagTheorem(farXbR,farYbR);
                    var initRotbR = Math.atan(farYbR / farXbR);
                    var pcX = -(Math.cos(objCheck.rotation + initRotbR) * radiusbR) + objCheck.x;
                    var pcY = -(Math.sin(objCheck.rotation + initRotbR) * radiusbR) + objCheck.y;
                    //a to objCheck checker/finder
                    var a1 = pbY - paY; 
                    var b1 = paX - pbX; 
                    var c1 = a1*(paX) + b1*(paY); 
                    var pdX = Math.cos(objCheck.rotation) + checkX;
                    var pdY = Math.sin(objCheck.rotation) + checkY;
                    var a2 = pdY - checkY; 
                    var b2 = checkX - pdX; 
                    var c2 = a2*(checkX)+ b2*(checkY); 
                    var determinant = a1*b2 - a2*b1;  
                    var rzX = (b2*c1 - b1*c2)/determinant;         
                    //objCheck to c checker/finder
                    a1 = pcY - pbY; 
                    b1 = pbX - pcX; 
                    c1 = a1*(pbX) + b1*(pbY); 
                    pdX = Math.cos(objCheck.rotation + 1.57) + checkX;
                    pdY = Math.sin(objCheck.rotation + 1.57) + checkY;
                    a2 = pdY - checkY; 
                    b2 = checkX - pdX; 
                    c2 = a2*(checkX)+ b2*(checkY); 
                    determinant = a1*b2 - a2*b1;  
                    var rz1X = (b2*c1 - b1*c2)/determinant;           
                    //check a -> objCheck
                    var hityes = false;
                    if(paX < pbX){
                        if(rzX > paX && rzX < pbX){
                            hityes = true;
                        }
                    }
                    else{
                        if(rzX < paX && rzX > pbX){
                            hityes = true;
                        }
                    }
                    if(hityes){
                        if(pbX < pcX){
                            if(rz1X > pbX && rz1X < pcX){
                                return objCheck;
                            }
                        }
                        else{
                            if(rz1X < pbX && rz1X > pcX){
                                return objCheck;
                            }
                        }
                    }
                }
            }
        }
        checkX += Math.cos(ang);
        checkY -= Math.sin(ang);
    }
    return null;
}
//input
var input = {
    w:false,
    a:false,
    s:false,
    d:false,
    up:false,
    left:false,
    down:false,
    right:false,
    space:false,
    f:false,
    shift:false,
    one:false,
    two:false,
    three:false,
    four:false,
    five:false,
    six:false,
    seven:false,
    mouse1:false
}
var clickInput = {
    w:false,
    a:false,
    s:false,
    d:false,
    up:false,
    left:false,
    down:false,
    right:false,
    space:false,
    f:false,
    shift:false,
    one:false,
    two:false,
    three:false,
    four:false,
    five:false,
    six:false,
    seven:false,
    mouse1:false
};
var nClick;
document.addEventListener('keydown', function(event) {
    switch(event.code){
        case "KeyW":
            input.w = true;
            clickInput.w = true;
            break;
        case "KeyA":
            input.a = true;
            clickInput.a = true;
            break;
        case "KeyS":
            input.s = true;
            clickInput.s = true;
            break;
        case "KeyD":
            input.d = true;
            clickInput.d = true;
            break;
        case "ArrowUp":
            input.up = true;
            clickInput.up = true;
            break;
        case "ArrowLeft":
            input.left = true;
            clickInput.left = true;
            break;
        case "ArrowDown":
            input.down = true;
            clickInput.down = true;
            break;
        case "ArrowRight":
            input.right = true;
            clickInput.right = true;
            break;
        case "Space":
            input.space = true;
            clickInput.space = true;
            break;
        case "KeyF":
            input.f = true;
            clickInput.f = true;
            break;
        case "ShiftLeft":
            input.shift = true;
            clickInput.shift = true;
            break;
        case "Digit1":
            input.one = true;
            clickInput.one = true;
            break;
        case "Digit2":
            input.two = true;
            clickInput.two = true;
            break;
        case "Digit3":
            input.three = true;
            clickInput.three = true;
            break;
        case "Digit4":
            input.four = true;
            clickInput.four = true;
            break;
        case "Digit5":
            input.five = true;
            clickInput.five = true;
            break;
        case "Digit6":
            input.six = true;
            clickInput.six = true;
            break;
        case "Digit7":
            input.seven = true;
            clickInput.seven = true;
            break;
    }
});
document.addEventListener('keyup', function(event) {
    switch(event.code){
        case "KeyW":
            input.w = false;
            break;
        case "KeyA":
            input.a = false;
            break;
        case "KeyS":
            input.s = false;
            break;
        case "KeyD":
            input.d = false;
            break;
        case "ArrowUp":
            input.up = false;
            break;
        case "ArrowLeft":
            input.left = false;
            break;
        case "ArrowDown":
            input.down = false;
            break;
        case "ArrowRight":
            input.right = false;
            break;
        case "Space":
            input.space = false;
            break;
        case "KeyF":
            input.f = false;
            break;
        case "ShiftLeft":
            input.shift = false;
            break;
        case "Digit1":
            input.one = false;
            break;
        case "Digit2":
            input.two = false;
            break;
        case "Digit3":
            input.three = false;
            break;
        case "Digit4":
            input.four = false;
            break;
        case "Digit5":
            input.five = false;
            break;
        case "Digit6":
            input.six = false;
            break;
        case "Digit7":
            input.seven = false;
            break;
    }
});
document.addEventListener('mousedown', function(event) {
    input.mouse1 = true;
    clickInput.mouse1 = true;
});
document.addEventListener('mouseup', function(event) {
    input.mouse1 = false;
});
document.addEventListener('mousemove', function(event) {
    getCursorPosition(canvas,event);
});
var mousePos = {
    x:0,
    y:0
}
//canvas creation
var canvasName = "myCanvas"; //replace with id of canvas within the html
var canvas = document.getElementById(canvasName);
var ctx = canvas.getContext("2d");
var virtualHeight = 900; //the width of the canvas things are being drawn on before scaling
var virtualWidth = 1600; //the height of the canvas things are being drawn on before scaling
fullScreen = false; //should the canvas fill the whole screen - make sure body and the canvas have a margin and padding of 0
fitAspectRatioFullscreen = true; //should the aspect ratio of the virtual canvas be forced - this removes distortion of stretching
fitDiv = false; //if you want the canvas to be in a part of the page instead of the whole page
/*recomended css settings for canvas
    padding:0;
    margin: 0 auto;
    display:block;
*/
var scaleX;
var scaleY;
if(fullScreen){
    fullScreenCanvas();
}
else if(fitAspectRatioFullscreen){
    aspectRatioFullScreenCanvas();
}
else if(fitDiv){
    fitDivCanvas();
}
scaleX = canvas.width / virtualWidth;
scaleY = canvas.height / virtualHeight;
window.addEventListener('resize', function(){
    if(fullScreen){
        fullScreenCanvas();
    }
    else if(fitAspectRatioFullscreen){
        aspectRatioFullScreenCanvas();
    }
    else if(fitDiv){
        fitDivCanvas();
    }
    scaleX = canvas.width / virtualWidth;
    scaleY = canvas.height / virtualHeight;
}); //refreshes canvas size a set times per second - the "10" is changeable to whatever tickrate works the best
//canvas fit functions
function fullScreenCanvas(){
    canvas.width = window.innerWidth;
    canvas.height =  window.innerHeight;
}
function aspectRatioFullScreenCanvas(){
    var ratio = 0.76;
    var heightW = window.innerHeight * ratio;
    var widthW = window.innerWidth * ratio;
    var aspectR = virtualWidth / virtualHeight;
    if(aspectR > widthW/heightW){
        canvas.width = widthW;
        canvas.height = widthW / aspectR;
    }
    else{
        canvas.height = heightW;
        canvas.width = heightW * aspectR;
    }
    document.getElementById('leftBar').style.width = (window.innerWidth - canvas.width)/2 + "px";
    document.getElementById('rightBar').style.width = (window.innerWidth - canvas.width)/2 + "px";
    document.getElementById('leftBar').style.height = canvas.height + "px";
    document.getElementById('rightBar').style.height = canvas.height + "px";
    var ntt = (window.innerHeight - canvas.height)/2;
    document.getElementById('topBar').style.height = ntt + "px";
    document.getElementById('bottomBar').style.height = ntt + "px";
    document.getElementById('leftBar').style.top = ntt + "px";
    document.getElementById('rightBar').style.top = ntt + "px";
}
function fitDivCanvas(){
    var divIn = document.getElementById("myDIV"); //replace myDiv with the div the canvas is within
    canvas.height = divIn.offsetHeight;
    canvas.height = divIn.offsetWidth;
}
//cursor pos
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    mousePos.x = x/scaleX;
    mousePos.y = y/scaleY;
}
function pythagTheorem(a,b){
    return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
}
var oDistX = 0;
var oDistY = 0;
var scene = 1;
function start(){
    scene = 1;
    switchScene(scene);
}
start();
var prevTime = Date.now();
var delta;
function runGame(){
    delta = Date.now() - prevTime;
    if(input.two){
        delta/=10;
    }
    prevTime = Date.now();
    var parents = [];
    for(var i = 0; i < gameObjects.length; i++){
        var a = gameObjects[i];
        if(a.parent != null){
            if(!parents.includes(a.parent)){
                parents.push(a.parent);
            }
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        var a = nullObjects[i];
        if(a.parent != null){
            if(!parents.includes(a.parent)){
                parents.push(a.parent);
            }
        }
    }
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.ogy = a.y;
        a.ogx = a.x;
    }
    for(var i = 0; i < buttons.length; i++){
        var button = buttons[i];
        if(mousePos.x <= (button.x + button.sizeX/2) && mousePos.x >= (button.x - button.sizeX/2) && mousePos.y >= (button.y - button.sizeY/2) && mousePos.y <= (button.y + button.sizeY/2)){
            button.hovered = true;
        }
        else{
            button.hovered = false;
        }
        if(button.hovered && clickInput.mouse1){
            button.clicked = true;
        }
        else{
            button.clicked = false;
        }
    }
    Object.keys(clickInput).forEach(function(key) {
        if(input[key] != clickInput[key]){
            nClick = clickInput[key];
        }   
    });
    nClick = false;
    switch(scene){
        case 1:
            scene1(null);
            break;
        case 2:
            scene2(null);
            break;
        case 3:
            scene3(null);
            break;
        case 4:
            scene4(null);
            break;
        case 5:
            scene5(null);
            break;
        case 6:
            scene6(null);
            break;
        case 7:
            scene7(null);
            break;
        case 8:
            scene8(null);
            break;
        case 9:
            scene9(null);
            break;
    }
    Object.keys(clickInput).forEach(function(key) {
        clickInput[key] = false;     
    });
    draw();
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.changeX = a.x - a.ogx;
        a.changeY = a.y - a.ogy;
    }
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.ogy = a.y;
        a.ogx = a.x;
    }
    for(var i = 0; i < gameObjects.length; i++){
        var a = gameObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        var a = nullObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.changeX = a.x - a.ogx;
        a.changeY = a.y - a.ogy;
    }
    for(var i = 0; i < gameObjects.length; i++){
        var a = gameObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        var a = nullObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    window.requestAnimationFrame(runGame);
}
window.requestAnimationFrame(runGame);
function draw(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.translate(oDistX * scaleX,oDistY * scaleY);
    for(var i = 0; i < nullObjects.length; i++){
        var tempObject = nullObjects[i];
        drawIt(tempObject);
    }
    for(var i = 0; i < gameObjects.length; i++){
        var tempObject = gameObjects[i];
        drawIt(tempObject);
    }
    for(var i = 0; i < buttons.length; i++){
        var tempObject = buttons[i];
        drawIt(tempObject);
    }
    for(var i = 0; i < ui.length; i++){
        var tempObject = ui[i];
        drawIt(tempObject);
    }
}
function drawIt(tempObject){
    if(tempObject.gravity != null){
        applyGravity(tempObject);
    }
    if(tempObject.rotation != null){
        ctx.translate(tempObject.x * scaleX,tempObject.y * scaleY);
        ctx.rotate(tempObject.rotation);
        ctx.translate(-tempObject.x * scaleX,-tempObject.y * scaleY);
    }
    if(tempObject.color != null){
        ctx.fillStyle = tempObject.color;
        ctx.fillRect((tempObject.x - tempObject.sizeX/2) * scaleX,(tempObject.y - tempObject.sizeY/2) * scaleY,tempObject.sizeX * scaleX,tempObject.sizeY * scaleY);
    }
    if(tempObject.image != null){
        ctx.drawImage(tempObject.image,(tempObject.x - tempObject.sizeX/2) * scaleX,(tempObject.y - tempObject.sizeY/2) * scaleY,tempObject.sizeX * scaleX,tempObject.sizeY * scaleY);
    }
    if(tempObject.rotation != null){
        ctx.translate(tempObject.x * scaleX,tempObject.y * scaleY);
        ctx.rotate(-tempObject.rotation);
        ctx.translate(-tempObject.x * scaleX,-tempObject.y * scaleY);
    }
    if(tempObject.text != null){
        ctx.textAlign = worldTextAlign;
        ctx.fillStyle = tempObject.textColor;
        ctx.font = (tempObject.textSize * ((scaleX + scaleY)/2)) + "px " + font;
        ctx.fillText(tempObject.text,(tempObject.x + tempObject.textOffsetX) * scaleX,(tempObject.y + tempObject.textOffsetY) * scaleY);
    }
}
function applyGravity(a){
    if(rayscan(a.x,a.y + (a.sizeY / 2) + 1, 4.71, 2) == null){
        a.gravityTimer += delta/1000;
        a.y += a.gravity * a.gravityTimer * delta/10;
    }
    else{
        a.gravityTimer = 0;
    }
    if(a.yForce != 0){
        a.y -= a.yForce * delta/8;
        a.yForce -= delta/10;
        if(a.yForce < 0){
            a.yForce = 0;
        }
    }
}
function loadNew(a){
    var load = a;
    var eachObj = load.split(">");
    for(var i = 0; i < eachObj.length; i++){
        var eachElement = eachObj[i].split("^");
        var type;
        var id;
        var x;
        var y;
        var sX;
        var sY;
        var color = null;
        var image = null;
        var rotation = null;
        for(var j = 0; j < eachElement.length; j++){
            var element = eachElement[j].split("=");
            var elementN = element[0];
            var elementB = element[1];
            if(elementN == "type"){
                type = elementB;
            }
            else if(elementN == "id"){
                id = elementB;
            }
            else if(elementN == "x"){
                x = parseInt(elementB);
            }
            else if(elementN == "y"){
                y = parseInt(elementB);
            }
            else if(elementN == "sx"){
                sX = parseInt(elementB);
            }
            else if(elementN == "sy"){
                sY = parseInt(elementB);
            }
            else if(elementN == "color"){
                color = elementB;
            }
            else if(elementN == "image"){
                image = elementB;
            }
            else if(elementN == "rotation"){
                rotation = parseFloat(elementB);
            }
        }
        var gameO = new GameObject(id,x,y,sX,sY);
        gameO.color = color;
        if(image != null){
            gameO.image = new Image();
            gameO.image.src = image;
        }
        gameO.rotation = rotation
        if(type == "gameObject"){
            gameObjects.push(gameO);
        }
        else if(type == "nullObject"){
            nullObjects.push(gameO);
        }
        else if(type == "button"){
            buttons.push(gameO);
        }
        else{
            ui.push(gameO);
        }
    }
}
function switchScene(a){
    gameObjects = [];
    nullObjects = [];
    buttons = [];
    ui = [];
    scene = a;
    switch(a){
        case 1:
            scene1("start");
            break;
        case 2:
            scene2("start");
            break;
        case 3:
            scene3("start");
            break;
        case 4:
            scene4("start");
            break;
        case 5:
            scene5("start");
            break;
        case 6:
            scene6("start");
            break;
        case 7:
            scene7("start");
            break;
        case 8:
            scene8("start");
            break;
        case 9:
            scene9("start");
            break;
    }
}
var goalScene = 1;
var dawgImage = new Image();
dawgImage.src = "/assets/main/dawglogo2x.png";
var dawgImageHovered = new Image();
dawgImageHovered.src = "/assets/main/dawglogo2xHovered.png";
function scene1(a){
    if(a == "start"){
        //start function for scene1
        ui.push(new GameObject("dawg",800,450,800,800));
        var d = findObject("dawg");
        d.image = new Image();
        d.image.src = "/assets/main/dawglogo2x.png";
        ui.push(new GameObject("clickm",800,450,0,0));
        var t = findObject("clickm");
        t.textColor = "black";
        t.textSize = 48;
        buttons.push(new GameObject("full",800,450,1600,900));
    }
    else{
        //logic for scene 1
        var d = findObject("dawg");
        var n = findObject("full");
        var t = findObject("clickm");
        if(n.hovered){
            d.image = dawgImageHovered;
            t.text = "(Click Me)";
        }
        else{
            d.image = dawgImage;
            t.text = "";
        }
        if(n.clicked){
            switchScene(2);
        }
    }
}
var tT = 0;
function scene2(a){
    if(a == "start"){
        tT = 0;
        ui.push(new GameObject("dawg",800,450,800,800));
        var d = findObject("dawg");
        d.image = new Image();
        d.image.src = "/assets/main/dawglogo2x.png";
        d.rotation = 0;
        buttons.push(new GameObject("full",800,450,1600,900));
    }
    else{
        var d = findObject("dawg");
        var n = findObject("full");
        if(n.hovered){
            d.image = dawgImageHovered;
        }
        else{
            d.image = dawgImage;
        }
        tT += delta;
        if(tT < 3000){
            d.rotation += delta/(3000 - tT) * 6;
            d.sizeX = 800 * (3000 - tT)/3000;
            d.sizeY = 800 * (3000 - tT)/3000;
        }
        if(tT > 3000){
            switchScene(3);
        }
    }
}
var rp = new Image();
rp.src = "/assets/main/panelReact.png";
var rpHovered = new Image();
rpHovered.src = "/assets/main/panelReactHovered.png";
//-
var ap = new Image();
ap.src = "/assets/main/panelAssets.png";
var apHovered = new Image();
apHovered.src = "/assets/main/panelAssetsHovered.png";
//-
var pp = new Image();
pp.src = "/assets/main/panelProjects.png";
var ppHovered = new Image();
ppHovered.src = "/assets/main/panelProjectsHovered.png";
//-
var pop = new Image();
pop.src = "/assets/main/panelPong.png";
var popHovered = new Image();
popHovered.src = "/assets/main/panelPongHovered.png";
function scene3(a){
    if(a == "start"){
        nullObjects.push(new GameObject("backG",800,450,1600,900));
        findObject("backG").color = "white";
        nullObjects.push(new GameObject("backText",800,250,0,0));
        var b = findObject("backText");
        b.text = "Welcome to Dawg.cc, go ahead and explore a bit.";
        b.textSize = 60;
        b.textColor = "black";
        ui.push(new GameObject("q1",400,225,800,450));
        findObject("q1").color = "black";
        ui.push(new GameObject("q2",1200,225,800,450));
        findObject("q2").color = "black";
        ui.push(new GameObject("q3",400,675,800,450));
        findObject("q3").color = "black";
        ui.push(new GameObject("q4",1200,675,800,450));
        findObject("q4").color = "black";
        buttons.push(new GameObject("reactPanel",400,450,400,200));
        buttons.push(new GameObject("assetsPanel",1200,450,400,200));
        buttons.push(new GameObject("projectsPanel",400,700,400,200));
        buttons.push(new GameObject("pongPanel",1200,700,400,200));
    }
    else{
        var q1 = findObject("q1");
        var q2 = findObject("q2");
        var q3 = findObject("q3");
        var q4 = findObject("q4");
        var rate = 5;
        q1.x -= delta / rate;
        q1.y -= delta / rate;
        q2.x += delta / rate;
        q2.y -= delta / rate;
        q3.x -= delta / rate;
        q3.y += delta / rate;
        q4.x += delta / rate;
        q4.y += delta / rate;
        var rpn = findObject("reactPanel");
        var apn = findObject("assetsPanel");
        var ppn = findObject("projectsPanel");
        var popn = findObject("pongPanel");
        if(rpn.hovered){
            rpn.image = rpHovered;
        }
        else{
            rpn.image = rp;
        }
        if(rpn.clicked){
            window.location.href = "https://react.dawg.cc";
        }
        //-
        if(apn.hovered){
            apn.image = apHovered;
        }
        else{
            apn.image = ap;
        }
        if(apn.clicked){
            window.location.href = "/assets";
        }
        //-
        if(ppn.hovered){
            ppn.image = ppHovered;
        }
        else{
            ppn.image = pp;
        }
        if(ppn.clicked){
            window.location.href = "/projects";
        }
        //-
        if(popn.hovered){
            popn.image = popHovered;
        }
        else{
            popn.image = pop;
        }
        if(popn.clicked){
            switchScene(1);
        }
    }
}
function scene4(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene5(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene6(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene7(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene8(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene9(a){
    if(a == "start"){

    }
    else{
        
    }
}
//game functions go down here




