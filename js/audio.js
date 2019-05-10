//initialise simplex noise instance
var noise = new SimplexNoise();

// the main visualiser function
var vizInit = function (){

  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var fileLabel = document.querySelector("label.file");

  document.onload = function(e){
    console.log(e);
    audio.play();
    play();
  }
  file.onchange = function(){
    fileLabel.classList.add('normal');
    audio.classList.add('active');
    var files = this.files;

    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    play();
  }

function play() {
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    //here comes the webgl
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6904ce,
        side: THREE.DoubleSide,
        wireframe: true
    });

    // some fog
    scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.0020 );

    // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.set(0, 30, 0);
    // group.add(plane);

    // var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane2.rotation.x = -0.5 * Math.PI;
    // plane2.position.set(0, -30, 0);
    // group.add(plane2);

    // DALE ADDED THIS
    // build the base geometry for each building
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: true
    });
    var cube = new THREE.Mesh(geometry, lambertMaterial);
    cube.position.set(0, 0, 0);
    group.add(cube);
    // don't know why 1 works, but seems to get shape back into original size
    var initialYTemp = 1;


    // // DALE ADDED THIS FOR THE CITY
    // var geometry = new THREE.CubeGeometry( 1, 1, 1 );
    // geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

    // translate the geometry to place the pivot point at the bottom instead of the center
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
    // get rid of the bottom face - it is never seen
    geometry.faces.splice( 3, 1 );
    geometry.faceVertexUvs[0].splice( 3, 1 );
    // change UVs for the top face
    // - it is the roof so it wont use the same texture as the side of the building
    // - set the UVs to the single coordinate 0,0. so the roof will be the same color
    //   as a floor row.
    // geometry.faceVertexUvs[0][2][0].set( 0, 0 );
    // geometry.faceVertexUvs[0][2][1].set( 0, 0 );
    // geometry.faceVertexUvs[0][2][2].set( 0, 0 );
    // geometry.faceVertexUvs[0][2][3].set( 0, 0 );

    var cityGeometry= new THREE.Geometry();
    var buildings = [];

    // light and shadow colours
    var light = new THREE.Color( 0xffffff );
    var shadow = new THREE.Color( 0x303050 );

    for( var i = 0; i < 20000; i++ ){
        var buildingMesh= new THREE.Mesh( geometry );
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

        // establish the base color for the buildingMesh
        var value   = 1 - Math.random() * Math.random();
        var baseColor   = new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
        // set topColor/bottom vertexColors as adjustement of baseColor
        var topColor    = baseColor.clone().multiply( light );
        var bottomColor = baseColor.clone().multiply( shadow );
        // set .vertexColors for each face
        var geometry    = buildingMesh.geometry;
        for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {
            if ( j === 2 ) {
                // set face.vertexColors on root face
                geometry.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
            } else {
                // set face.vertexColors on sides faces
                geometry.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
            }
        }
        // merge it with cityGeometry - very important for performance
        cityGeometry.mergeMesh(buildingMesh);
        buildings.push(buildingMesh);
        group.add(buildingMesh);
    }

    // generate the texture
var texture       = new THREE.Texture( generateTexture() );
texture.anisotropy = renderer.getMaxAnisotropy();
texture.needsUpdate    = true;

// build the mesh
var material  = new THREE.MeshLambertMaterial({
  map     : texture,
  vertexColors    : THREE.VertexColors
});
var cityMesh = new THREE.Mesh(cityGeometry, material );

function generateTexture() {
  // build a small canvas 32x64 and paint it in white
  var canvas  = document.createElement( 'canvas' );
  canvas.width = 32;
  canvas.height    = 64;
  var context = canvas.getContext( '2d' );
  // plain it in white
  context.fillStyle    = '#ffffff';
  context.fillRect( 0, 0, 32, 64 );
  // draw the window rows - with a small noise to simulate light variations in each room
  for( var y = 2; y < 64; y += 2 ){
      for( var x = 0; x < 32; x += 2 ){
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


    // var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    // var lambertMaterial = new THREE.MeshLambertMaterial({
    //     color: 0xff00ee,
    //     wireframe: true
    // });

    // var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    // ball.position.set(0, 0, 0);
    // group.add(ball);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    // spotLight.lookAt(cube); // ball
    spotLight.castShadow = true;
    scene.add(spotLight);

    var orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = true;

    scene.add(group);

    document.getElementById('out').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

    function render() {
      analyser.getByteFrequencyData(dataArray);

      var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
      var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

      var overallAvg = avg(dataArray);
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperMax = max(upperHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperMaxFr = upperMax / upperHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;

      // makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
      // makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));

      // ONE CUBE
      // varyBuildingHeight(cube, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4), initialYTemp);

      // CITY
      for (var i = 0; i < buildings.length; i ++ ) {
        varyBuildingHeight(buildings[i], modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4), 1);
    }

      // CONTROLS AUTO ROTATION
      // group.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // // trying to change so that only updates height
    // function makeRoughBall(mesh, bassFr, treFr) {
    //     // mesh.geometry.vertices.forEach(function (vertex, i) {
    //         vertex = mesh.geometry.vertices[1];
    //         var offset = mesh.geometry.parameters.width;
    //         var amp = 7;
    //         var time = window.performance.now();
    //         vertex.normalize();
    //         var rf = 0.00001;
    //         var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
    //         mesh.geometry.parameters.height.multiplyScalar(distance);
    //     // });
    //     mesh.geometry.verticesNeedUpdate = true;
    //     mesh.geometry.normalsNeedUpdate = true;
    //     mesh.geometry.computeVertexNormals();
    //     mesh.geometry.computeFaceNormals();
    // }

    function varyBuildingHeight(mesh, bassFr, treFr, initialY) {
        // mesh.geometry.vertices.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.width;
            var amp = 7;
            var time = window.performance.now();
            // vertex = mesh.geometry.vertices[1];
            var topVertices = [
              mesh.geometry.vertices[0],
              mesh.geometry.vertices[1],
              mesh.geometry.vertices[4],
              mesh.geometry.vertices[5]
            ];
            for (let i = 0; i < 4; i++) {
              topVertices[i].y = initialY;
            }
            height = mesh.geometry.parameters.height;
            var rf = 0.00001;
            // var distance = (offset + bassFr ) + noise.noise3D(topVertices[0].x + time *rf*7, topVertices[0].y +  time*rf*8, topVertices[0].z + time*rf*9) * amp * treFr;

            var distance = bassFr + treFr;

            for (let i = 0; i < 4; i++) {
              topVertices[i].y *= (distance * 0.1);
              if (topVertices[i].y < initialY) {
                topVertices[i].y = initialY;
              }
            }

            // mesh.geometry.parameters.height = height * 0;
            // mesh.geometry.parameters.height.multiplyScalar(distance);
        // });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    function makeRoughGround(mesh, distortionFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var amp = 2;
            var time = Date.now();
            var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
            vertex.z = distance;
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    audio.play();
  };
}

window.onload = vizInit();

document.body.addEventListener('touchend', function(ev) { context.resume(); });



//some helper functions here
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}
