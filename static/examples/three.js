var app = angular.module('angulargram', []);
app.directive('angulargram', function($http) {
  return {

    restrict: "C",
    link(scope, element) {

      //main function handles everything except detecting webGL and adding fallback
      var main = function() {

        //declare 
        //get the DOM element from the angular element
        var e = element[0];
        var qty = 64;
        var images = [];
        var renderer = new THREE.WebGLRenderer();
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10);
        camera.position.z = 3;
        var truncatedSphere = new THREE.Object3D();
        scene.add(truncatedSphere);

        var light = new THREE.PointLight('rgb(140,140,255)', .2, 0);
        light.position.set(0, 0, 0);
        scene.add(light);

        window.addEventListener('resize', updateSize, false)

        function updateSize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }

        updateSize();
        element.append(renderer.domElement);

        $http({
          method: 'GET',
          url: '/instagram.json?qty=' + qty
        }).then(getImages, doFallback);

        function getImages(instagramObject) {
          var posts = instagramObject.data;
          //parse the data object from $http and start to load the textures
          for (var i = 0; i < posts.length; i++) {
            //move new posts to the middle of the array
            images[i % 2 ? "push" : "unshift"](posts[i].images.thumbnail.url)
          }
          doLoadTextures();
        }

        function doLoadTextures() {

          var index = 0;
          var textureLoader = new THREE.TextureLoader;
          textureLoader.crossOrigin = "";

          function loadOneTexture(i) {

            textureLoader.load(
              images[i],
              function(texture) {
                if (++index < images.length) {
                  loadOneTexture(index);
                }
                handleLoadedTexture(texture, i)

              },
              function() {
                //progress
              },
              function() {
                doFallback();
              }
            );
          }

          loadOneTexture(index);

          function handleLoadedTexture(texture, index) {

            //the texture needs to be mirrored horizontally since we see the back side of the sphere.
            //three.js's methods don't seem to work, so make a canvas and do it ourselves.

            var flipCanvas = document.createElement('canvas');
            flipCanvas.height = 150;
            flipCanvas.width = 150;
            var flipCanvasContext = flipCanvas.getContext('2d');
            flipCanvasContext.translate(150, 0);
            flipCanvasContext.scale(-1, 1);
            flipCanvasContext.drawImage(texture.image, 0, 0);
            var flippedImg = document.createElement('img');
            flippedImg.src = flipCanvas.toDataURL("image/jpg");
            texture.image = flippedImg;

            var material = new THREE.MeshPhongMaterial({
              map: texture,
              side: THREE.BackSide
            });
            var vert = Math.floor(index / 16) + 2;
            var pane = new THREE.SphereGeometry(7, 1, 1, (index % 16) * (Math.PI / 8), Math.PI / 8, vert * (Math.PI / 8), Math.PI / 8);
            var mesh = new THREE.Mesh(pane, material);
            truncatedSphere.add(mesh);

          }

        }

        function loop() {
          truncatedSphere.rotation.y += 0.001;
          renderer.render(scene, camera);
          window.requestAnimationFrame(loop);
        }
        loop();

      }

      function webglAvailable() {
        try {
          var canvas = document.createElement("canvas");
          return !!
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") ||
              canvas.getContext("experimental-webgl"));
        } catch (e) {
          return false;
        }
      }

      if (webglAvailable()) {
        main();
      } else {
        doFallback();
      }
    }

  }
});