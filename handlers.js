debug = false;

resizeHandler = function (camera, renderer) {
  return function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}


keyPressHandler = function(ev) {
  var c = String.fromCharCode(ev.which);
  if (debug) {
    console.log('char: ', c);
  }
  keyHandle(c);
}
keyDownHandler = function(ev) {
  if (debug) {
    console.log('key: ', ev.keyCode);
  }
  var k = '';
  switch (ev.keyCode) {
    case 8:
      k = 'BACKSPACE';
      break;
    case 27:
      k = 'ESCAPE';
      break;
    case 37:
      k = 'LEFT';
      break;
    case 38:
      k = 'UP';
      break;
    case 39:
      k = 'RIGHT';
      break;
    case 40:
      k = 'DOWN';
      break;
    default:
      return;
  }

  keyHandle(k);
}

// Game Keybindings
keyHandle = function(key) {

  switch (key) {
    case 'w':
      World.move();
      break;
    case 'e':
      registerTurn();
      break;
    case 'r':
      registerInversion();
      break;
    case 'f':
      //registerScale();
      break;
    case 's':
      break;
    case 'a':
      registerRoll(1.1);
      break;
    case 'd':
      registerRoll(-1.1);
      break;
    case 'j':
      World.setTarget(b0);
      registerLook(b0.position);
      //World.move();
      break;
    case 'k':
      break;
    default:
      break;
  }
}

mouseMoveHandler = function(ev) {
  var x =  (ev.clientX / window.innerWidth)  * 2 - 1;
  var y = -(ev.clientY / window.innerHeight) * 2 + 1;

  updateIntersections(x,y);
}
clickHandler = function(ev) {
  var x = ev.x;
  var y = ev.y;

  if (World.focus) {
    var id = World.focus;
    var mobj = lookup(blob_objects, id);
    if (mobj) {
      World.setTarget(mobj);
      registerLook(mobj.position);
      if (ev.button == 2) {
        World.move();
      }
      console.log('click: ', mobj);
    } else {
      console.log('ERROR');
    }
  }
}

initHandlers = function() {
  console.log('key init');
  window.addEventListener('keypress', keyPressHandler);
  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('click', clickHandler);
  window.addEventListener('contextmenu', function(ev) {
    clickHandler(ev);
    ev.preventDefault();
  });
}
