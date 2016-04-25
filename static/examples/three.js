var app = angular.module('angulargram',[]);

app.directive('angulargram', function($http) {
  return {
    
    restrict: "C",
    link(scope,element){
      
      var e = element[0];
      var qty = 64;
      var images = [];
      
      function getImages(posts){
        for(var i = 0 ; i < posts.length ; i++){
          images.push(posts[i].images.low_resolution.url);
        }
        
        doLoadTextures();
      }
      
      
      var renderer = new THREE.WebGLRenderer(),
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, e.offsetWidth / e.offsetHeight, 0.1, 1000 );
      

      function createScene(){

        camera.position.z = 6;
        var ambientLight = new THREE.AmbientLight( 0x000000 );
        scene.add( ambientLight );

        var lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        scene.add( lights[ 0 ] );
        scene.add( lights[ 1 ] );
        scene.add( lights[ 2 ] );
      
        
        
        element.append( renderer.domElement );
        
      }
      
      
      createScene();
      
      function doLoadTextures(){
        
        
        
        
        var x = new THREE.TextureLoader;      
        x.crossOrigin = "Anonymous";      
        x.load(
          images[0],
          function(r){
            textureLoaded(r)
          },
          function() {
            console.log('progress')
          },
          function(){
            console.log('error')
          }
        );

        
        function textureLoaded(texture){
          console.log(texture);
          var material = new THREE.MeshPhongMaterial({ 
          map: texture 
          //color : "#fba000"
          });
          var geometry = new THREE.PlaneGeometry( 5, 5, 20 );

          var mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = 0.4;
          console.log(mesh);
          scene.add(mesh);
          console.log(scene);
        }
        
        textureLoaded();
        
        
      }
      
      
      
      
      
      
      
      function loop(){

        renderer.setSize( e.offsetWidth, e.offsetHeight );
        renderer.render( scene, camera );
        window.requestAnimationFrame(loop);
      }
      window.requestAnimationFrame(loop);

      $http({
        method: 'GET',
        url: '/instagram.json?qty=' + qty
      }).then(function successCallback(response) {
                getImages(response.data);
              }, function errorCallback(response) {
                scope.error = response;
              });

    }
    
  }
});