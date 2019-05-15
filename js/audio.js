//initialise simplex noise instance
var noise = new SimplexNoise();
// random hsl for later
var randomH1 = Math.random() * 100;
var randomH1 = Math.random() * 100;
var randomS1 = Math.random() * 100;
var randomS2 = Math.random() * 100;

lastTime = performance.now();
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

    scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.0020 );

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // // floor creation
    // var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    // var planeMaterial = new THREE.MeshLambertMaterial({
    //     color: 0x6904ce,
    //     side: THREE.DoubleSide,
    //     wireframe: true
    // });

    // some fog
    // scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.0020 );


    // renderer.setClearColor(scene.fog.color);

    // // floor
    // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.set(0, 0, 0);
    // group.add(plane);

    // var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane2.rotation.x = -0.5 * Math.PI;
    // plane2.position.set(0, -30, 0);
    // group.add(plane2);

    // GENERATE THE GOODS
    var sidewalksEmpty = [];
    var newBuildingsArr = [];

    // function setCity(choice) {
    //   if (choice == "city - day") {

        sidewalks = generateSidewalks(sidewalksEmpty);
        for (let i = 0; i < sidewalks.length; i++) {
          scene.add(sidewalks[i]);
        }

        let buildings = [];
        newBuildingsArr = generateBlockCity(buildings);
        for (let i = 0; i < newBuildingsArr.length; i++) {
          scene.add(newBuildingsArr[i]);
        }

        let cityGround = generateSquareGround();
        scene.add(cityGround);

        let lamps3d = generateLampPoles();
        scene.add(lamps3d);

        var lampheads = [];
        let lampLightArr = generateLampLights(lampheads);
        for (let i = 0; i < lampLightArr.length; i++) {
          scene.add(lampLightArr[i]);
        }


    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 1000, 20);
    // spotLight.lookAt(cube); // ball
    spotLight.castShadow = true;
    scene.add(spotLight);

    // var sun = new THREE.SpotLight(0xe8dc00);
    // sun.intensity = 0.5;
    // sun.position.set(-100, 0, 20);
    // // spotLight.lookAt(cube); // ball
    // sun.castShadow = true;
    // scene.add(sun);

    var orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = true;

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

      // makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
      // makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));


      //   }
      // }



      for (let i = 0; i < sidewalks.length; i++ ) {
        varySidewalkSize(sidewalks[i], bassFr, treFr, 1);
      }

      // CITY
      for (let i = 0; i < newBuildingsArr.length; i++ ) {
        varyBuildingHeight(newBuildingsArr[i], bassFr, treFr, 1);
      }

      for (let i = 0; i < lampLightArr.length; i++ ) {
        varyLampColour(lampLightArr[i], bassFr, treFr);
      }


      let generateRandomHSL1 = function() {
        let h = Math.random() * 100;
        let s = Math.random() * 100;
        let l = 75 - bassFr;
        let colour = hsla(h, s, l);
        return colour;
      }

      let generateRandomHSL2 = function() {
        let h = Math.random() * 100;
        let s = Math.random() * 100;
        let l = 75 - bassFr;
        let colour = hsla(h, s, l);
        return colour;
      }

      // document.body.style.background = 'linear-gradient(150deg, hsl(' + Math.random() * 100 + ',' + Math.random() * 100 + ',' + Math.random() * 100 + '), #000000)';


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

    function varyLampColour(lampLightMesh, bassFr, treFr) {

      lampLightMesh.material.color.setRGB(Math.random(), Math.random(), Math.random());
      lampLightMesh.material.needsUpdate = true;
    }

    function varySidewalkSize(mesh, bassFr, treFr, initialSize) {

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
        topVertices[i].y = initialSize;
      }
      // height = mesh.geometry.parameters.height;
      var rf = 0.00001;
      // var distance = (offset + bassFr ) + noise.noise3D(topVertices[0].x + time *rf*7, topVertices[0].y +  time*rf*8, topVertices[0].z + time*rf*9) * amp * treFr;

      var distance = bassFr + treFr;

      for (let i = 0; i < 4; i++) {
        topVertices[i].y += (distance * 0.01);
        if (topVertices[i].y < initialSize) {
          topVertices[i].y = initialSize;
        }
      }

      // mesh.geometry.parameters.height = height * 0;
      // mesh.geometry.parameters.height.multiplyScalar(distance);
  // });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();

      // var rf = 0.00001;
      //
      // var distance = bassFr + treFr;
      //
      // for (let i = 0; i < mesh.geometry.vertices.length; i++) {
      //   mesh.geometry.vertices[i].x *= (distance * 0.01);
      //   mesh.geometry.vertices[i].y *= (distance * 0.01);
      //   mesh.geometry.vertices[i].z *= (distance * 0.01);
      //   if (mesh.geometry.vertices[i].x < initialSize) mesh.geometry.vertices[i].x = initialSize;
      //   if (mesh.geometry.vertices[i].y < initialSize) mesh.geometry.vertices[i].y = initialSize;
      //   if (mesh.geometry.vertices[i].z < initialSize) mesh.geometry.vertices[i].z = initialSize;
      // }
      // // updates
      // mesh.geometry.verticesNeedUpdate = true;
      // mesh.geometry.normalsNeedUpdate = true;
      // mesh.geometry.computeVertexNormals();
      // mesh.geometry.computeFaceNormals();
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
    // requestAnimationFrame( animate );

    var time = performance.now() / 1000;

    // controls.update( time - lastTime );
    // renderer.render( scene, camera );

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
