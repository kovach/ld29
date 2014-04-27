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


  //arrow.setDirection(vector);
}
