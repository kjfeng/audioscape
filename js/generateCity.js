// generates the city scene

// all the constants
var nBlockX	= 25
var nBlockZ	= 25
var blockSizeX	= 50
var blockSizeZ	= 50
var blockDensity= 10
var roadW	= 8
var roadD	= 8
var buildingMaxW= 15
var buildingMaxD= 15
var sidewalkW	= 2
var sidewalkH	= 0.1
var sidewalkD	= 2
var lampDensityW= 4
var lampDensityD= 4
var lampH	= 3

var box = new THREE.BoxGeometry( 1, 1, 1 );
box.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

// get rid of texture for the top of building
box.faceVertexUvs[0][4][0].set( 0, 0 );
box.faceVertexUvs[0][4][1].set( 0, 0 );
box.faceVertexUvs[0][4][2].set( 0, 0 );
box.faceVertexUvs[0][5][0].set( 0, 0 );
box.faceVertexUvs[0][5][1].set( 0, 0 );
box.faceVertexUvs[0][5][2].set( 0, 0 );

let getBox = function() {
  return box;
}

var cone = new THREE.ConeGeometry();
cone.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
let getCone = function() {
  return cone;
}

// vanilla city
let generateVanillaCity = function(buildingsArray) {

  var cityGeometry= new THREE.Geometry();

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
      var buildingMesh = new THREE.Mesh(getBox(), material);
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

// block city
let generateBlockCityDay = function(buildingsArray) {

  var cityGeometry= new THREE.Geometry();
  // more texture stuff
  // generate the texture
  var texture = new THREE.Texture( generateTexture() );
  // texture.anisotropy = renderer.getMaxAnisotropy();
  texture.needsUpdate = true;

  // make 10 000 buildings
  for( var blockZ = 0; blockZ < nBlockZ; blockZ++) {
    for( var blockX = 0; blockX < nBlockX; blockX++) {
      for( var i = 0; i < blockDensity; i++) {
        // build the material
        var material = new THREE.MeshLambertMaterial({
          map : texture,
          vertexColors : THREE.VertexColors
        });
        let randomGray = 0.7 + Math.random() * 0.3;
        if (randomGray < 0.3) randomGray = 1;
        material.color.setRGB(randomGray, randomGray, randomGray);
        var buildingMesh = new THREE.Mesh(box, material);
        // put a random position
        // set position
        buildingMesh.position.x	= (Math.random()-0.5)*(blockSizeX-buildingMaxW-roadW-sidewalkW)
        buildingMesh.position.z	= (Math.random()-0.5)*(blockSizeZ-buildingMaxD-roadD-sidewalkD)

        // add position for the blocks
        buildingMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
        buildingMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ

        // put a random scale
        buildingMesh.scale.x	= Math.min(Math.random() * 5 + 10, buildingMaxW);
        buildingMesh.scale.y	= (Math.random() * Math.random() * buildingMesh.scale.x) * 5 + 5;
        buildingMesh.scale.z	= Math.min(buildingMesh.scale.x, buildingMaxD)

        // merge it with cityGeometry - very important for performance
        cityGeometry.mergeMesh(buildingMesh);
        buildingsArray.push(buildingMesh);
      }
    }
  }
  // let cityMesh = new THREE.Mesh(cityGeometry);
  return buildingsArray;
}

let generateBlockCityEvening = function(buildingsArray) {

  var cityGeometry= new THREE.Geometry();
  // more texture stuff
  // generate the texture
  var texture = new THREE.Texture( generateTexture() );
  // texture.anisotropy = renderer.getMaxAnisotropy();
  texture.needsUpdate = true;

  // make 10 000 buildings
  for( var blockZ = 0; blockZ < nBlockZ; blockZ++) {
    for( var blockX = 0; blockX < nBlockX; blockX++) {
      for( var i = 0; i < blockDensity; i++) {
        // build the material
        var material = new THREE.MeshLambertMaterial({
          map : texture,
          vertexColors : THREE.VertexColors
        });
        let randomGray = 0.5 + Math.random() * 0.3;
        material.color.setRGB(randomGray, randomGray, randomGray);
        var buildingMesh = new THREE.Mesh(box, material);
        // put a random position
        // set position
        buildingMesh.position.x	= (Math.random()-0.5)*(blockSizeX-buildingMaxW-roadW-sidewalkW)
        buildingMesh.position.z	= (Math.random()-0.5)*(blockSizeZ-buildingMaxD-roadD-sidewalkD)

        // add position for the blocks
        buildingMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
        buildingMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ

        // put a random scale
        buildingMesh.scale.x	= Math.min(Math.random() * 5 + 10, buildingMaxW);
        buildingMesh.scale.y	= (Math.random() * Math.random() * buildingMesh.scale.x) * 5 + 5;
        buildingMesh.scale.z	= Math.min(buildingMesh.scale.x, buildingMaxD)

        // merge it with cityGeometry - very important for performance
        cityGeometry.mergeMesh(buildingMesh);
        buildingsArray.push(buildingMesh);
      }
    }
  }
  // let cityMesh = new THREE.Mesh(cityGeometry);
  return buildingsArray;
}

let generateBlockCityNight = function(buildingsArray) {

  var cityGeometry= new THREE.Geometry();
  // more texture stuff
  // generate the texture
  var texture = new THREE.Texture( generateNightTexture() );
  // texture.anisotropy = renderer.getMaxAnisotropy();
  texture.needsUpdate = true;

  // make 10 000 buildings
  for( var blockZ = 0; blockZ < nBlockZ; blockZ++) {
    for( var blockX = 0; blockX < nBlockX; blockX++) {
      for( var i = 0; i < blockDensity; i++) {
        // build the material
        var material = new THREE.MeshLambertMaterial({
          map : texture,
          vertexColors : THREE.VertexColors
        });
        let randomGray = 0.3 + Math.random() * 0.3;
        material.color.setRGB(randomGray, randomGray, randomGray);
        var buildingMesh = new THREE.Mesh(box, material);
        // put a random position
        // set position
        buildingMesh.position.x	= (Math.random()-0.5)*(blockSizeX-buildingMaxW-roadW-sidewalkW)
        buildingMesh.position.z	= (Math.random()-0.5)*(blockSizeZ-buildingMaxD-roadD-sidewalkD)

        // add position for the blocks
        buildingMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
        buildingMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ

        // put a random scale
        buildingMesh.scale.x	= Math.min(Math.random() * 5 + 10, buildingMaxW);
        buildingMesh.scale.y	= (Math.random() * Math.random() * buildingMesh.scale.x) * 5 + 5;
        buildingMesh.scale.z	= Math.min(buildingMesh.scale.x, buildingMaxD)

        // merge it with cityGeometry - very important for performance
        cityGeometry.mergeMesh(buildingMesh);
        buildingsArray.push(buildingMesh);
      }
    }
  }
  // let cityMesh = new THREE.Mesh(cityGeometry);
  return buildingsArray;
}

let generateSquareGround	= function() {
  var geometry	= new THREE.PlaneGeometry( 1, 1, 1 );
  var material	= new THREE.MeshLambertMaterial({
    color	: 0x222222
  })
  var ground	= new THREE.Mesh(geometry, material)
  ground.lookAt(new THREE.Vector3(0,1,0))
  ground.scale.x = (nBlockZ)*blockSizeZ
  ground.scale.y = (nBlockX)*blockSizeX

  return ground;
}


let generateLampPoles	= function() {
  var object3d	= new THREE.Object3D()

  var lampGeometry= new THREE.BoxGeometry(1,1,1)
  lampGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
  var lampMesh	= new THREE.Mesh(lampGeometry)

  var lightsGeometry	= new THREE.Geometry();
  var lampsGeometry	= new THREE.Geometry();
  for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
    for( var blockX = 0; blockX < nBlockX; blockX++){
      // lampMesh.position.x	= 0
      // lampMesh.position.z	= 0
      function addLamp(position){
        //////////////////////////////////////////////////////////////////////////////////
        //		light								//
        //////////////////////////////////////////////////////////////////////////////////

        var lightPosition	= position.clone()
        lightPosition.y		= sidewalkH+lampH+0.1
        // set position for block
        lightPosition.x		+= (blockX+0.5-nBlockX/2)*blockSizeX
        lightPosition.z		+= (blockZ+0.5-nBlockZ/2)*blockSizeZ

        lightsGeometry.vertices.push(lightPosition );
        //////////////////////////////////////////////////////////////////////////////////
        //		head light						//   REMOVED
        //////////////////////////////////////////////////////////////////////////////////

        // // set base position
        // lampMesh.position.copy(position)
        // lampMesh.position.y	= sidewalkH+lampH
        // // add poll offset
        // lampMesh.scale.set(0.2,0.2,0.2)
        // // colorify
        // for(var i = 0; i < lampMesh.geometry.faces.length; i++ ) {
        //   lampMesh.geometry.faces[i].color.set('white' );
        // }
        // // set position for block
        // lampMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
        // lampMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
        // // merge it with cityGeometry - very important for performance
        // lampsGeometry.mergeMesh( lampMesh )

        //////////////////////////////////////////////////////////////////////////////////
        //		pole								//
        //////////////////////////////////////////////////////////////////////////////////

        // set base position
        lampMesh.position.copy(position)
        lampMesh.position.y	+= sidewalkH
        // add poll offset
        lampMesh.scale.set(0.1,lampH,0.1)
        // colorify
        for(var i = 0; i < lampMesh.geometry.faces.length; i++ ) {
          lampMesh.geometry.faces[i].color.set('grey' );
        }
        // set position for block
        lampMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
        lampMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
        // merge it with cityGeometry - very important for performance
        lampsGeometry.mergeMesh( lampMesh )

        //////////////////////////////////////////////////////////////////////////////////
        //		base								//
        //////////////////////////////////////////////////////////////////////////////////
        // set base position
        lampMesh.position.copy(position)
        lampMesh.position.y	+= sidewalkH
        // add poll offset
        lampMesh.scale.set(0.12,0.4,0.12)
        // colorify
        for(var i = 0; i < lampMesh.geometry.faces.length; i++ ) {
          lampMesh.geometry.faces[i].color.set('maroon' );
        }
        // set position for block
        lampMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
        lampMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
        // merge it with cityGeometry - very important for performance
        lampsGeometry.mergeMesh( lampMesh );
      }
      // south
      var position	= new THREE.Vector3()
      for(var i = 0; i < lampDensityW+1; i++){
        position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW)
        position.z	= -0.5*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
      // north
      for(var i = 0; i < lampDensityW+1; i++){
        position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW)
        position.z	= +0.5*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
      // east
      for(var i = 1; i < lampDensityD; i++){
        position.x	= +0.5*(blockSizeX-roadW-sidewalkW)
        position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
      // west
      for(var i = 1; i < lampDensityD; i++){
        position.x	= -0.5*(blockSizeX-roadW-sidewalkW)
        position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
    }
  }

  // build the lamps Mesh
  var material	= new THREE.MeshLambertMaterial({
    vertexColors	: THREE.VertexColors
  });
  var lampsMesh	= new THREE.Mesh(lampsGeometry, material );
  object3d.add(lampsMesh)

  return object3d
}

let generateLampLights	= function(lampheads) {
  var lampHeadAll = new THREE.Geometry();

  var lampGeometry= new THREE.BoxGeometry(1,1,1)
  lampGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
  // // build material
  // var lampHeadMaterial	= new THREE.MeshLambertMaterial({
  //   color	: 0xffffff
  // });


  for( var blockZ = 0; blockZ < nBlockZ; blockZ++) {
    for( var blockX = 0; blockX < nBlockX; blockX++) {
      // lampMesh.position.x	= 0
      // lampMesh.position.z	= 0
      function addLamp(position) {
        //////////////////////////////////////////////////////////////////////////////////
        //		head light						//
        //////////////////////////////////////////////////////////////////////////////////

        var lampHeadMaterial	= new THREE.MeshLambertMaterial({
          color	: 0xffffff
        });

        var lampHeadMesh = new THREE.Mesh(lampGeometry, lampHeadMaterial);
        lampHeadMesh.position.copy(position)
        lampHeadMesh.position.y	= sidewalkH+lampH
        // add pole offset
        lampHeadMesh.scale.set(0.35,0.35,0.35);
        // set position for block
        lampHeadMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
        lampHeadMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ

        lampHeadAll.mergeMesh( lampHeadMesh );
        lampheads.push( lampHeadMesh );

      }

      // south
      var position	= new THREE.Vector3()
      for(var i = 0; i < lampDensityW+1; i++) {
        position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW)
        position.z	= -0.5*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
      // north
      for(var i = 0; i < lampDensityW+1; i++) {
        position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW)
        position.z	= +0.5*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
      // east
      for(var i = 1; i < lampDensityD; i++) {
        position.x	= +0.5*(blockSizeX-roadW-sidewalkW)
        position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
      // west
      for(var i = 1; i < lampDensityD; i++){
        position.x	= -0.5*(blockSizeX-roadW-sidewalkW)
        position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD)
        addLamp(position)
      }
    }
  }
  return lampheads;
}


let generateSidewalks	= function( sidewalksArr ) {
  // var sidewalkMesh = new THREE.Mesh(getBox());
  var sidewalksGeometry= new THREE.Geometry();

  for ( var blockZ = 0; blockZ < nBlockZ; blockZ++ ) {
    for ( var blockX = 0; blockX < nBlockX; blockX++ ) {
      // build material to be used on all sidewalks
      var material	= new THREE.MeshLambertMaterial({
        color	: 0x444444
      });

      var sidewalkMesh = new THREE.Mesh(box, material);
      // set position
      sidewalkMesh.position.x	= (blockX+0.5-nBlockX/2)*blockSizeX
      sidewalkMesh.position.z	= (blockZ+0.5-nBlockZ/2)*blockSizeZ

      sidewalkMesh.scale.x	= blockSizeX-roadW
      sidewalkMesh.scale.y	= sidewalkH
      sidewalkMesh.scale.z	= blockSizeZ-roadD

      // merge it with cityGeometry - very important for performance
      sidewalksGeometry.mergeMesh( sidewalkMesh );
      sidewalksArr.push(sidewalkMesh);
    }
  }

  // var sidewalksMesh	= new THREE.Mesh( sidewalksGeometry, material );
  return sidewalksArr;
}

// this.createSquareCity	= function(){
//   var object3d		= new THREE.Object3D()
//
//   var lampsMesh		= this.createSquareLamps()
//   object3d.add(lampsMesh)
//
//   var sidewalksMesh	= this.createSquareSideWalks()
//   object3d.add(sidewalksMesh)
//
//   var buildingsMesh	= this.createSquareBuildings()
//   object3d.add(buildingsMesh)
//
//   var groundMesh	= this.createSquareGround()
//   object3d.add(groundMesh)
//
//   return object3d
// }


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

function generateNightTexture() {
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
          let random = Math.random();
          if (random > 0.66) {
            context.fillStyle = 'rgb(247, 231, 12)';
            context.fillRect( x, y, 2, 1 );
          }
          else {
            var value   = Math.floor( Math.random() * 64 );
            context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
            context.fillRect( x, y, 2, 1 );
          }

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

// tree scene
let generateNature = function(buildingsArray) {
  var cityGeometry= new THREE.Geometry();

  // // more texture stuff
  // // generate the texture
  var texture = new THREE.Texture( generateTreeTexture() );
  // texture.anisotropy = renderer.getMaxAnisotropy();
  texture.needsUpdate = true;
  // var loader = new THREE.TextureLoader();
  // var texture = loader.load( "textures/tree-texture.jpg" ); // grasslight-big.jpg
  // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set( 25, 25 );
  // texture.anisotropy = 16;
  // texture.needsUpdate = true;
  var geometry = new THREE.SphereGeometry( 32, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {
     color: 0xffff00, //color: 0x111111, envMap: mirrorCamera.renderTarget, // 
  } );

  // make 10 000 buildings
  for (var i = 0; i < 500; i++ ) {
      // material.color.setRGB(Math.random(), Math.random(), Math.random());
      // build the material
      // material = new THREE.MeshPhongMaterial({
      //   color: 0xaa2929,
      //   specular: 0x030303,
      //   wireframeLinewidth: 2,
      //   map: texture,
      //   side: THREE.DoubleSide,
      //   alphaTest: 0.5,
      // });
      var material = new THREE.MeshBasicMaterial({
        map : texture,
        transparent : true,
        // color: 0x4ac4b6,
        // vertexColors : THREE.VertexColors
      });
      let randomGray = Math.random() + 0.5;
      if (randomGray > 1) randomGray = 1;
      // material.color.setRGB(randomGray, randomGray, randomGray);
      var buildingMesh = new THREE.Mesh(getCone(), material); // new THREE.ConeGeometry( 1, 1, 1 )
      // put a random position
      buildingMesh.position.x = Math.floor( Math.random() * 200 - 100 ) * 10;
      buildingMesh.position.z = Math.floor( Math.random() * 200 - 100 ) * 10;
      // put a random rotation
      buildingMesh.rotation.y = Math.random()*Math.PI*2;
      // put a random scale
      // MODIFY THIS FOR BUILDING SIZE?
      buildingMesh.scale.x    = Math.random() * Math.random() * Math.random() * Math.random() + 2;
      buildingMesh.scale.y    = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) + 4;
      buildingMesh.scale.z    = buildingMesh.scale.x;

      // merge it with cityGeometry - very important for performance
      cityGeometry.mergeMesh(buildingMesh);
      buildingsArray.push(buildingMesh);
  }

  for (var i = 0; i < 100; i++ ) {
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = Math.floor( Math.random() * 200 - 100 ) * 10;
    sphere.position.z = Math.floor( Math.random() * 200 - 100 ) * 10;
    sphere.position.y = Math.floor( Math.random() * 200 - 100 ) + 30;
    buildingsArray.push( sphere );
  }
  return buildingsArray;
}

function generateTreeTexture() {
var canvas = document.createElement( 'canvas' );
canvas.width = 32;
canvas.height = 64;
var context = canvas.getContext('2d');

// make_base(context);

  // plain it in some shade of gray
  // let grayRand = Math.round(Math.random() * 255);
  // let randomGray = rgb(redRand, blueRand, greenRand);
  context.fillStyle = 'rgba('+ 34 +', '+ 139 +', '+ 34 + ', '+ 0 + ')'; //34,139,34
  context.fillRect( 0, 0, 32, 64 );
  // draw the window rows - with a small noise to simulate light variations in each room
  for (var y = 2; y < 256; y += 1 ) {
      for (var x = 0; x < 128; x += 1 ) {
          var Rvalue   = 34 + Math.floor( Math.random() * 64 );
          var Gvalue   = 139 + Math.floor( Math.random() * 64 );
          var Bvalue   = 34 + Math.floor( Math.random() * 64 );
          var avalue = Math.random();
          if (avalue < 0.3) {
            avalue = 0;
          }
          else {
            avalue = 1;
          }
          context.fillStyle = 'rgba(' + [Rvalue, Gvalue, Bvalue, avalue].join( ',' )  + ')';
          context.fillRect( x, y, 2, 1 );
      }
  }

// build a bigger canvas and copy the small one in it
  // This is a trick to upscale the texture without filtering
  var canvas2 = document.createElement( 'canvas' );
  canvas2.width    = 512;
  canvas2.height   = 1024;
  context = canvas2.getContext( '2d' );
  // disable smoothing
  context.imageSmoothingEnabled        = false;
  context.webkitImageSmoothingEnabled  = false;
  context.mozImageSmoothingEnabled = false;
  // then draw the image
  context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
  // return the just built canvas2
  return canvas2;

}
