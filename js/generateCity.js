// generates the city scene
let generateCity = function(renderer, buildingsArray) {
  var box = new THREE.BoxGeometry( 1, 1, 1 );
  box.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

  // get rid of texture for the top of building
  box.faceVertexUvs[0][4][0].set( 0, 0 );
  box.faceVertexUvs[0][4][1].set( 0, 0 );
  box.faceVertexUvs[0][4][2].set( 0, 0 );
  box.faceVertexUvs[0][5][0].set( 0, 0 );
  box.faceVertexUvs[0][5][1].set( 0, 0 );
  box.faceVertexUvs[0][5][2].set( 0, 0 );

  var cityGeometry= new THREE.Geometry();
  // var buildings = [];

  // light and shadow colours
  var light = new THREE.Color( 0xffffff );
  var shadow = new THREE.Color( 0x303050 );

  function generateTexture() {
    // build a small canvas 32x64 and paint it in white
    var canvas  = document.createElement( 'canvas' );
    canvas.width = 32;
    canvas.height = 64;
    var context = canvas.getContext( '2d' );
    // plain it in some shade of gray
    let grayRand = Math.round(Math.random() * 255);
    // let randomGray = rgb(redRand, blueRand, greenRand);
    context.fillStyle = 'rgb('+ grayRand +', '+ grayRand +', '+ grayRand +')';
    context.fillRect( 0, 0, 32, 64 );
    // draw the window rows - with a small noise to simulate light variations in each room
    for (var y = 2; y < 64; y += 2 ) {
        for (var x = 0; x < 32; x += 2 ) {
            var value   = Math.floor( Math.random() * 64 );
            context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
            context.fillRect( x, y, 2, 1 );
        }
    }

    // build a bigger canvas and copy the small one in it
    // This is a trick to upscale the texture without filtering
    var canvas2 = document.createElement( 'canvas' );
    canvas2.width    = 512;
    canvas2.height   = 1024;
    var context = canvas2.getContext( '2d' );
    // disable smoothing
    context.imageSmoothingEnabled        = false;
    context.webkitImageSmoothingEnabled  = false;
    context.mozImageSmoothingEnabled = false;
    // then draw the image
    context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
    // return the just built canvas2
    return canvas2;
  }

  // more texture stuff
  // generate the texture
  var texture = new THREE.Texture( generateTexture() );
  // texture.anisotropy = renderer.getMaxAnisotropy();
  texture.needsUpdate = true;


  // make 10 000 buildings
  for (var i = 0; i < 10000; i++ ) {
      // material.color.setRGB(Math.random(), Math.random(), Math.random());
      // build the material
      var material = new THREE.MeshLambertMaterial({
        map : texture,
        vertexColors : THREE.VertexColors
      });
      let randomGray = Math.random() + 0.5;
      if (randomGray > 1) randomGray = 1;
      material.color.setRGB(randomGray, randomGray, randomGray);
      var buildingMesh = new THREE.Mesh(box, material);
      // put a random position
      buildingMesh.position.x = Math.floor( Math.random() * 200 - 100 ) * 10;
      buildingMesh.position.z = Math.floor( Math.random() * 200 - 100 ) * 10;
      // put a random rotation
      buildingMesh.rotation.y = Math.random()*Math.PI*2;
      // put a random scale
      // MODIFY THIS FOR BUILDING SIZE?
      buildingMesh.scale.x    = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
      buildingMesh.scale.y    = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
      buildingMesh.scale.z    = buildingMesh.scale.x;


      // merge it with cityGeometry - very important for performance
      cityGeometry.mergeMesh(buildingMesh);
      buildingsArray.push(buildingMesh);
      // group.add(buildingMesh);
  }
  // let cityMesh = new THREE.Mesh(cityGeometry);
  return buildingsArray;
}
