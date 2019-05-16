//initialise simplex noise instance
var sceneType = "city - day";

// random hsl for later
var lampDayH = 0.7875;
var lampDayS = 1.0;
var lampDayL = 0.5;

var randomH1 = Math.random() * 100;
var randomH1 = Math.random() * 100;
var randomS1 = Math.random() * 100;
var randomS2 = Math.random() * 100;

lastTime = performance.now();
// the main visualiser function
var vizInit = function () {

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

    // var filename = 'objects/cheetah.obj'; // all obj files are in the obj folder

    // const manager = new THREE.LoadingManager();

    // // load using the three js loading manager plus pass reference to current mesh
    // const loader = new OBJLoader(manager);
    // const mesh = new THREE.Mesh();

    // loader.load(filename, function(vertices, faces) {
    //     mesh.buildFromVerticesAndFaces(vertices, faces);
    // });
    // scene.add( mesh );

    // var mesh = null;

    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setPath( "objects/cheetah" );
    // mtlLoader.load( 'cheetah.obj', function( materials ) {

    //   materials.preload();

    //   var objLoader = new THREE.OBJLoader();
    //   objLoader.setMaterials( materials );
    //   objLoader.setPath( "objects/cheetah" );
    //   objLoader.load( 'cheetah.obj', function ( object ) {

    //     mesh = object;
    //     mesh.position.y = -50;
    //     scene.add( mesh );

    //   } );

    // } );


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

    if (sceneType === "city - day") {
      scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.0020 );
    }

    if (sceneType === "city - evening") {
      scene.fog	= new THREE.FogExp2( 0xc19e60, 0.0010 );
    }

    if (sceneType === "city - night") {
      scene.fog	= new THREE.FogExp2( 0x3a3a3a, 0.0020 );
    }




    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);




    // // floor
    // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.set(0, 0, 0);
    // group.add(plane);

    // var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane2.rotation.x = -0.5 * Math.PI;
    // plane2.position.set(0, -30, 0);
    // group.add(plane2);

    // // forest floor creation and material
    // var planeGeometry = new THREE.PlaneGeometry(8000, 8000, 200, 200);
    // var planeMaterial = new THREE.MeshLambertMaterial({
    //     color: 0xff0000,
    //     side: THREE.DoubleSide,
    //     // wireframe: true
    // });

    // forest floor



    // GENERATE THE GOODS
    var sidewalksEmpty = [];
    var newBuildingsArr = [];
    var lampLightArr = [];

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);



    // CONDITIONALS FOR SCENES
    if (sceneType === "city - day") {

      sidewalks = generateSidewalks(sidewalksEmpty);
      for (let i = 0; i < sidewalks.length; i++) {
        scene.add(sidewalks[i]);
      }

      let cityGround = generateSquareGround();
      scene.add(cityGround);

      let lamps3d = generateLampPoles();
      scene.add(lamps3d);

      var lampheads = [];
      lampLightArr = generateLampLights(lampheads);
      for (let i = 0; i < lampLightArr.length; i++) {
        scene.add(lampLightArr[i]);
      }
      let buildings = [];
      newBuildingsArr = generateBlockCityDay(buildings);
      for (let i = 0; i < newBuildingsArr.length; i++) {
        scene.add(newBuildingsArr[i]);
      }

      var ambientLight = new THREE.AmbientLight(0xaaaaaa);
      scene.add(ambientLight);

      var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.intensity = 0.9;
      spotLight.position.set(-10, 1000, 20);
      spotLight.castShadow = true;
      scene.add(spotLight);
    }

    if (sceneType === "city - evening") {

      sidewalks = generateSidewalks(sidewalksEmpty);
      for (let i = 0; i < sidewalks.length; i++) {
        scene.add(sidewalks[i]);
      }

      let cityGround = generateSquareGround();
      scene.add(cityGround);

      let lamps3d = generateLampPoles();
      scene.add(lamps3d);

      var lampheads = [];
      lampLightArr = generateLampLights(lampheads);
      for (let i = 0; i < lampLightArr.length; i++) {
        scene.add(lampLightArr[i]);
      }
      let buildings = [];
      newBuildingsArr = generateBlockCityEvening(buildings);
      for (let i = 0; i < newBuildingsArr.length; i++) {
        scene.add(newBuildingsArr[i]);
      }

      var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.intensity = 0.9;
      spotLight.position.set(-10, 500, 20);
      spotLight.castShadow = true;
      scene.add(spotLight);

      var sun = new THREE.SpotLight(0xe8c900);
      sun.intensity = 0.7;
      sun.position.set(200, 200, 50);
      sun.castShadow = true;
      scene.add(sun);
    }

    if (sceneType === "city - night") {

      sidewalks = generateSidewalks(sidewalksEmpty);
      for (let i = 0; i < sidewalks.length; i++) {
        scene.add(sidewalks[i]);
      }

      let cityGround = generateSquareGround();
      scene.add(cityGround);

      let lamps3d = generateLampPoles();
      scene.add(lamps3d);

      var lampheads = [];
      lampLightArr = generateLampLights(lampheads);
      for (let i = 0; i < lampLightArr.length; i++) {
        scene.add(lampLightArr[i]);
      }
      let buildings = [];
      newBuildingsArr = generateBlockCityNight(buildings);
      for (let i = 0; i < newBuildingsArr.length; i++) {
        scene.add(newBuildingsArr[i]);
      }

      var spotLight = new THREE.SpotLight(0xffffff); // white
      spotLight.intensity = 0.9;
      spotLight.position.set(-10, 500, 20);
      spotLight.castShadow = true;
      scene.add(spotLight);

      var ground1 = new THREE.SpotLight(0xffe121); // yellow
      ground1.intensity = 0.9;
      ground1.position.set(0, 10, 0);
      ground1.castShadow = true;
      scene.add(ground1);

      var ground2 = new THREE.SpotLight(0x1efbff); // cyan
      ground2.intensity = 0.9;
      ground2.position.set(-500, 10, 500);
      ground2.castShadow = true;
      scene.add(ground2);

      var ground3 = new THREE.SpotLight(0xff60dc); // pink
      ground3.intensity = 0.9;
      ground3.position.set(500, 10, -500);
      ground3.castShadow = true;
      scene.add(ground3);

      var ground4 = new THREE.SpotLight(0xff7c1e); // orange
      ground4.intensity = 0.9;
      ground4.position.set(-500, 10, -500);
      ground4.castShadow = true;
      scene.add(ground4);

      var ground5 = new THREE.SpotLight(0x69ff1e); // light green
      ground5.intensity = 0.9;
      ground5.position.set(500, 10, 500);
      ground5.castShadow = true;
      scene.add(ground5);
    }

    if (sceneType === "nature") {

      let emptyTreeArr = [];
      newBuildingsArr = generateNature(emptyTreeArr);
      for (let i = 0; i < newBuildingsArr.length; i++) {
        scene.add(newBuildingsArr[i]);
      }

      // floor creation
      var planeGeometry = new THREE.PlaneGeometry(8000, 8000, 200, 200);
      if (sceneType === 'nature') {
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x266a2e,
            side: THREE.DoubleSide,
            wireframe: false
        });
      }

      // add forest floor
      var floor = new THREE.Mesh(planeGeometry, planeMaterial);
      floor.rotation.x = -0.5 * Math.PI;
      floor.position.set(0, 0, 0);
      scene.add(floor);

    }

    var orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = true;

    // FIRST PERSON CONTROLS
    // controls = new THREE.FirstPersonControls( camera );
    // controls.movementSpeed = 20;
    // controls.lookSpeed = 0.05;
    // controls.lookVertical = true;

    // scene.add(group);

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

      var bassFr = modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8);
      var treFr = modulate(upperAvgFr, 0, 1, 0, 4);

      // CITY
      if (sceneType === "city - day") {
        // buildings
        for (let i = 0; i < newBuildingsArr.length; i++ ) {
          varyBuildingHeight(newBuildingsArr[i], bassFr, treFr, 1);
        }
        // lamps
        for (let i = 0; i < lampLightArr.length; i++ ) {
          varyLampColour(lampLightArr[i], bassFr, treFr, lowerMaxFr);
        }

        document.body.style.background = 'linear-gradient(150deg, hsl(209, 100%, 94%), hsl(' + 200 + ',' + 90 + '%,' + Math.round(100 - (3 * bassFr)) + '%))';

      }

      if (sceneType === "city - evening") {
        // buildings
        for (let i = 0; i < newBuildingsArr.length; i++ ) {
          varyBuildingHeight(newBuildingsArr[i], bassFr, treFr, 1);
        }
        // lamps
        for (let i = 0; i < lampLightArr.length; i++ ) {
          varyLampColour(lampLightArr[i], bassFr, treFr, lowerMaxFr);
        }

        document.body.style.background = 'linear-gradient(150deg, hsl(215, 100%, ' + Math.round(60 - (2 * bassFr)) + '%), hsl(30, 100%, ' + Math.round(75 - (2 * bassFr)) + '%))';

      }

      if (sceneType === "city - night") {
        // buildings
        for (let i = 0; i < newBuildingsArr.length; i++ ) {
          varyBuildingHeight(newBuildingsArr[i], bassFr, treFr, 1);
        }
        // lamps
        for (let i = 0; i < lampLightArr.length; i++ ) {
          varyLampColour(lampLightArr[i], bassFr, treFr, lowerMaxFr);
        }

        document.body.style.background = 'linear-gradient(150deg, hsl(225, 100%, ' + Math.round(35 - (2 * bassFr)) + '%), hsl(10, 100%, ' + Math.round(35 - (2 * bassFr)) + '%))';

      }

      if (sceneType === "nature") {
        for (let i = 0; i < newBuildingsArr.length; i++ ) {
          varyTreeHeight(newBuildingsArr[i], bassFr, treFr, 50);
        }
      }


      // CONTROLS AUTO ROTATION
      // group.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
      requestAnimationFrame(animate);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

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
            // height = mesh.geometry.parameters.height;
            var rf = 0.00001;
            // var distance = (offset + bassFr ) + noise.noise3D(topVertices[0].x + time *rf*7, topVertices[0].y +  time*rf*8, topVertices[0].z + time*rf*9) * amp * treFr;

            var distance = bassFr + treFr;

            for (let i = 0; i < 4; i++) {
              topVertices[i].y *= (distance * 0.1);
              if (topVertices[i].y < 0.7 * initialY) {
                topVertices[i].y = 0.7 * initialY;
              }
            }

        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    function varyLampColour(lampLightMesh, bassFr, treFr, lowerMaxFr) {
      if (sceneType === "city - day") {
        let newLum = 0.5;
        newLum = lampDayL + (bassFr / 50 * lowerMaxFr);
        // console.log(newLum);

        lampLightMesh.material.color.setHSL(lampDayH, lampDayS, newLum);
        lampLightMesh.material.needsUpdate = true;
      }

      if (sceneType === "city - evening") {
        let newH = 0.0875 + (bassFr / 300 * lowerMaxFr);
        // console.log(newLum);

        lampLightMesh.material.color.setHSL(newH, 1, 0.5);
        lampLightMesh.material.needsUpdate = true;
      }

      if (sceneType === "city - night") {
        if (bassFr > 8.5) {
          lampLightMesh.material.color.setRGB(Math.random(), Math.random(), Math.random());
          lampLightMesh.material.needsUpdate = true;
        }

      }



    }

    function varyTreeHeight(mesh, bassFr, treFr, initialY) {
        // mesh.geometry.vertices.forEach(function (vertex, i) {
            initialY = 50;
            var offset = mesh.geometry.parameters.width;
            var amp = 7;
            var time = window.performance.now();
            // vertex = mesh.geometry.vertices[1];
            var topVertices = [
              mesh.geometry.vertices[0]
            ];
            for (let i = 0; i < 1; i++) {
              topVertices[i].y = initialY;
            }
            height = mesh.geometry.parameters.height;
            var rf = 0.00001;
            // var distance = (offset + bassFr ) + noise.noise3D(topVertices[0].x + time *rf*7, topVertices[0].y +  time*rf*8, topVertices[0].z + time*rf*9) * amp * treFr;

            var distance = bassFr + treFr;

            for (let i = 0; i < 1; i++) {
              topVertices[i].y *= (distance * 0.1);
              if (topVertices[i].y < initialY) {
                topVertices[i].y = initialY;
              }
            }

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

function animate() {

    var time = performance.now() / 1000;

    lastTime = time;
}


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
