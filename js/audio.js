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

    // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.set(0, 30, 0);
    // group.add(plane);

    // var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane2.rotation.x = -0.5 * Math.PI;
    // plane2.position.set(0, -30, 0);
    // group.add(plane2);

    // // DALE ADDED THIS
    // // build the base geometry for each building
    // var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    // // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // var lambertMaterial = new THREE.MeshLambertMaterial({
    //     color: 0xff00ee,
    //     wireframe: true
    // });
    // var cube = new THREE.Mesh( geometry, lambertMaterial);
    // cube.position.set(0, 0, 0);
    // group.add(cube);


    // DALE ADDED THIS FOR THE CITY
    var geometry = new THREE.CubeGeometry( 1, 1, 1 );

    var cityGeometry= new THREE.Geometry();
    var buildings = [];

    for( var i = 0; i < 20000; i ++ ){
        // buildMesh
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
        buildingMesh.scale.z    = buildingMesh.scale.x

        // // establish the base color for the buildingMesh
        // var value   = 1 - Math.random() * Math.random();
        // var baseColor   = new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
        // // set topColor/bottom vertexColors as adjustement of baseColor
        // var topColor    = baseColor.clone().multiply( light );
        // var bottomColor = baseColor.clone().multiply( shadow );
        // // set .vertexColors for each face
        // var geometry    = buildingMesh.geometry;
        // for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {
        //     if ( j === 2 ) {
        //         // set face.vertexColors on root face
        //         geometry.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
        //     } else {
        //         // set face.vertexColors on sides faces
        //         geometry.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
        //     }
        // }
        // merge it with cityGeometry - very important for performance
        // THREE.GeometryUtils.merge( cityGeometry, buildingMesh );
        buildings.push(buildingMesh);
        group.add(buildingMesh);
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

      for (var i = 0; i < buildings.length; i ++ ) {
        makeRoughBall(buildings[i], modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
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

    function makeRoughBall(mesh, bassFr, treFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.width;
            var amp = 7;
            var time = window.performance.now();
            vertex.normalize();
            var rf = 0.00001;
            var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
            vertex.multiplyScalar(distance);
        });
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
