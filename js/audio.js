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
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0,80,300);
    camera.lookAt(scene.position);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // floor creation
    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6904ce,
        side: THREE.DoubleSide,
        wireframe: true
    });

    // some fog
    scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.0020 );

    // floor
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    group.add(plane);

    // var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane2.rotation.x = -0.5 * Math.PI;
    // plane2.position.set(0, -30, 0);
    // group.add(plane2);

    // GENERATE THE GOODS
    let buildings = [];
    let newBuildingsArr = generateBlockCity(buildings);
    for (let i = 0; i < newBuildingsArr.length; i++) {
      group.add(newBuildingsArr[i]);
    }
    let cityGround = generateSquareGround();
    group.add(cityGround);

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
      // varyBuildingHeight(cube, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4), 1);

      // CITY
      for (var i = 0; i < newBuildingsArr.length; i ++ ) {
        varyBuildingHeight(newBuildingsArr[i], modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4), 1);
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
