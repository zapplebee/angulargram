var truncatedSphere;

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
          images.push(posts[i].images.thumbnail.url);
        }
        doLoadTextures();
      }
      
      var renderer = new THREE.WebGLRenderer(),
        scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera( 70, e.offsetWidth / e.offsetHeight, 0.1, 10 );
        truncatedSphere = new THREE.Object3D();
        
        console.log(truncatedSphere.scale.x);
        scene.add(truncatedSphere);
        
      function initScene(){
        camera.position.z = 0;
        var light = new THREE.PointLight( 0xffffff, .4, 0 );
        light.position.set( 0, 0, 0 );
        scene.add( light );
        renderer.domElement.style = "-moz-transform: scale(-1, 1);-webkit-transform: scale(-1, 1);-o-transform: scale(-1, 1);transform: scale(-1, 1);filter: FlipH;";
        element.append( renderer.domElement );
      }
      
      initScene();
      
      function doLoadTextures(){
        
        var index = 0;
        var textureLoader = new THREE.TextureLoader;      
        textureLoader.crossOrigin = "Anonymous";
        
        function loadOneTexture(i){
          
          textureLoader.load(
            images[i],
            function(texture){
              console.log(texture);
              textureLoaded(texture,i)
              console.log('texture loaded: ' + i);
              if(++index < images.length){
                loadOneTexture(index);
              }
            },
            function() {
              console.log('progress')
            },
            function(){
              console.log('error')
            }
          );
        }
        
        loadOneTexture(index);
        
        function textureLoaded(texture,index){
          console.log(texture.image);
          var material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
          //var material = new THREE.MeshPhongMaterial({ color: '#FBA000', side: THREE.DoubleSide });
          var vert = Math.floor(index / 16) + 2;
          var pane = new THREE.SphereGeometry( 5, 1, 1, (index % 16) * (Math.PI/ 8), Math.PI/ 8, vert * (Math.PI / 8), Math.PI / 8);
          var mesh = new THREE.Mesh(pane, material);

            //mesh.position.z = mesh.position.z * -1;
 
          
          truncatedSphere.add(mesh);
          
        }
        
      }
      
      function loop(){
        renderer.setSize( e.offsetWidth, e.offsetHeight );
        truncatedSphere.rotation.y -= 0.005;

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