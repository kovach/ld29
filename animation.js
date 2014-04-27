camera_animation = undefined;
animations = {};

// Util
normalizeTime = function(animation) {
  var t = new Date().getTime();
  return (t - animation.start) / animation.duration;
}

updateAnimation = function(a) {
  var t = normalizeTime(a);
  if (t > 1) {
    a.update(a.state, 1);
    return false;
  } else {
    a.update(a.state, t);
    return true;
  }
}
updateAnimations = function() {
  _.each(animations, function(arr, key) {
    animations[key] = _.filter(arr, updateAnimation);
  });
}

// Register
registerAnimation = function(spec) {
  var start = new Date().getTime();
  spec.start = start;
  var type = spec.type;
  //console.log(spec);

  if (!animations[type]) {
    animations[type] = [];
  }
  if (animations[type].length === 0) {
    animations[type].push(spec);
  } else {
    console.log('please wait');
  }
}


// Animation types
registerTest = function() {
  update = function(state, t) {
    console.log(t);
  }

  registerAnimation(
      { duration : 1000
      , type : 'test'
      , state : undefined
      , update : update
      });
}

registerSlerp = function(obj, target, duration, tparam) {

  var q1 = new THREE.Quaternion();
  q1.copy(obj.quaternion);

  update = function(state, t) {
    THREE.Quaternion.slerp(q1, target, state, tparam(t));
    obj.quaternion.copy(state);
    updateUp();
  }
  registerAnimation(
      { type : 'camera'
      , duration : duration
      , state : new THREE.Quaternion()
      , update : update
      });
}

registerLook = function(v) {
  var q2 = new THREE.Quaternion();
  var m1 = new THREE.Matrix4();
  m1.lookAt(camera.position, v, camera.up);
  q2.setFromRotationMatrix(m1);

  registerSlerp(camera, q2, 200, id);
}

registerRoll = function(delta) {
  var q2 = new THREE.Quaternion();
  var r = camera.rotation.clone();
  r.z += delta;
  q2.setFromEuler(r);

  registerSlerp(camera, q2, 800, Math.sqrt);
}

registerTurn = function() {
  dest = camera.quaternion.clone();
  rot = new THREE.Quaternion();
  rot.setFromAxisAngle(v(0,1,0), Math.PI);
  dest.multiply(rot);

  registerSlerp(camera, dest, 300, id);
}

registerTranslation = function(delta) {
  var start = camera.position.clone();

  update = function(state, t) {
    var d = delta.clone();
    d.multiplyScalar(t);
    camera.position.addVectors(start, d);
  }

  registerAnimation(
      { type : 'movement'
      , duration : 700
      , state : undefined
      , update : update
      });
}

registerInversion = function() {

  if (!(World.target)) {
    console.log('no target!');
    return;
  }

  var target = World.getTarget();
  var c0 = target.position.clone();
  var r0 = target.radius;
  console.log('c: ', c0);
  console.log('r: ', r0);

  var root = false;
  if (root) {
    c0 = World.is.c0;
    r0 = World.is.r0;
  }

  var init = _.map(blob_objects, function(obj, ind) {
    // Assume uniform scaling
    return { c : obj.position.clone(), r : obj.radius, r0 : obj.initRadius };
  });

  var update = function(state, t) {
    _.each(blob_objects, function(obj, ind) {
      var params = init[ind];
      var sphere = invertSphere(params.c, params.r, c0, r0, t);

      obj.position.copy(sphere.center);
      obj.radius = sphere.radius;
      var scale = Math.max(sphere.radius / params.r0, 0.01);
      scaleObject(obj, scale);
    });
  }

  registerAnimation(
    { type : 'world'
    , duration : 1000
    , state : undefined
    , update : update
    });
}

registerScale = function() {
  if (World.target) {
    obj = World.lookupObj(World.target);
    update = function(state, t) {
      t = t * 2;
      obj.scale.x = t;
      obj.scale.y = t;
      obj.scale.z = t;
    }
    registerAnimation(
      { type : 'display'
      , duration : 1000
      , state : undefined
      , update : update
      });
  } else {
    console.log('no target!');
  }
}
