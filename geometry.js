// Update camera's up vector upon certain rotations
updateUp = function() {
  camera.up.set(0, 1, 0);
  camera.up.applyQuaternion(camera.quaternion);
}

// Raycast from camera to mouse x,y
updateIntersections = function(x, y) {
  var vector = v(x, y, 1);
  projector.unprojectVector(vector, camera);

  var origin = camera.position.clone();

  var ray = new THREE.Raycaster(origin,
      vector.sub(origin).normalize());

  var objs = ray.intersectObjects(blob_objects);
  // Hit a blob
  if (objs.length > 0) {
    World.setFocus(objs[0].object);
  } else {
    World.unfocus();
  }
}

invertSphere = function(c1, r1, c0, r0, t) {
  var center = c1.clone();
  center.sub(c0);
  var r = center.clone().normalize();
  if (r.length() < 1) {
    r = v(1, 0, 0);
  }
  r.multiplyScalar(r1);

  var d1 = center.clone();
  d1.add(r);
  //console.log('d1: ', d1);
  r.negate();
  var d2 = center.clone();
  d2.add(r);
  //console.log('d2: ', d2);

  var len1 = d1.length();
  //console.log('len1: ', len1);
  var len2 = d2.length();
  //console.log('len2: ', len2);
  d1.multiplyScalar(r0 * Math.pow(len1/r0, 1-2*t) / len1);
  //console.log('d1: ', d1);
  d2.multiplyScalar(r0 * Math.pow(len2/r0, 1-2*t) / len2);
  //console.log('d2: ', d2);

  var center = d1.clone().add(d2).multiplyScalar(1/2);
  var radius = d1.clone().sub(d2).multiplyScalar(1/2).length();

  return { center : center, radius : radius };
}

c1 = v(1,0,0);
r1 = 0.75;
c0 = v(0,0,0);
r0 = 5;
