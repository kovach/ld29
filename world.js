World = {};
World.focus = undefined;
World.target = undefined;
//World.focusColor = ;
//World.targetColor = ;
World.blobRadius = 1;

World.attrs = { target : 2, focus : 1, none : 0 };
World.attrColors =
  { target : 0xffcc66
  , focus : 0x66ccff
  , none : 0xffffff
  };

World.blobColor = World.attrColors['none'];
                  
World.attrMap = {};

World.setAttrDumb = function(id, attr) {
  console.log('set-attr: ', attr);
  World.attrMap[id] = attr;
  World.lookupObj(id).material.color.set(World.attrColors[attr]);
}
World.setAttr = function(id, attr) {
  if (World.attrMap[id]) {
    if (World.attrs[World.attrMap[id]] <= World.attrs[attr]) {
      World.setAttrDumb(id, attr);
    }
  } else {
    World.setAttrDumb(id, attr);
  }
}
World.unsetAttr = function(id, attr) {
  if (id) {
    if (World.attrMap[id]) {
      //console.log('drop-attr: ', World.attrMap[id]);
      if (World.attrMap[id] === attr) {
        World.setAttrDumb(id, 'none');
      }
    } else {
      World.setAttrDumb(id, 'none');
    }
  }
}

World.makeBlob = function() {
  var b = {};
  b.radius = 0.4 + Math.random() * 0.4
  b.position = World.randPoint(1);

  return b;
}

World.randPoint = function(scale) {
  var b = 22;
  var xmax = b;
  var ymax = b;
  var zmax = b;

  return v( scale * (Math.random() * xmax - xmax / 2)
          , scale * (Math.random() * ymax - ymax / 2)
          , scale * (Math.random() * zmax - zmax / 2)
          );
}

World.setFocus = function(object) {
  var id = object._id;
  if (id !== World.focus) {
    World.unfocus();
    World.focus = object._id;
    return World.setAttr(object._id, 'focus');
  }
}
World.unfocus = function() {
  if (World.focus) {
    World.unsetAttr(World.focus, 'focus');
    World.focus = undefined;
  }
}

World.setTarget = function(object) {
  World.unsetAttr(World.target, 'target');
  World.target = object._id;
  return World.setAttr(object._id, 'target');
}

World.lookupObj = function(id) {
  return lookup(blob_objects, id);
}
World.lookup = function(id) {
  return lookup(blobs, id);
}

World.move = function() {
  var target = World.target;
  if (target) {
    var obj = World.lookupObj(target);
    var dest = obj.position.clone();
    dest.sub(camera.position);
    var len = dest.length();
    dest.multiplyScalar((len - World.lookup(target).radius*2) / len);
    registerTranslation(dest);
  } else {
    console.log('no target!');
  }
}
