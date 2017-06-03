/**
 * Created by Victor on 6/3/2017.
 */
import three from "three";
import OBJLoader from 'three-obj-loader';
var OrbitControls = require('three-orbit-controls')(three);
OBJLoader(three)
import './importcad.html';
const width = 900;
const height = 550;
const pxr = width/height;
//obj = require('./obj/building.obj');
var angle = 0;
Template.importcad.viewmodel({
    domElement: null,
    signal: 'mouse',
    onCreated() {
        console.log(document);
        
        

    },
    onRendered(){
        
        var texture = new three.Texture();

        var loader = new three.ImageLoader( manager );
				loader.load( 'txt.jpg', function ( image ) {
					texture.image = image;
					texture.needsUpdate = true;
				} );

        var camera = new three.PerspectiveCamera(45, width / height, 1, 2000 );
        camera.position.z = 15;
        
        var scene = new three.Scene();

        var ambient = new three.AmbientLight( 0xdddddd );
				scene.add( ambient );
        var pointLight = new three.PointLight( 0xffffff, 1 );
        scene.add(pointLight);
        

        var manager = new three.LoadingManager();
        var loaders = new three.OBJLoader(manager);
        loaders.load("building.obj", function ( object ) {
                object.position.x = 5;
                    object.position.y = 0;
					scene.add( object );
				});
        var renderer = new three.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( width, height );
controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // remove when using animation loop
				// enable animation loop when using damping or autorotation
				//controls.enableDamping = true;
				//controls.dampingFactor = 0.25;
				controls.enableZoom = false;
        document.getElementById("model_cad").appendChild(renderer.domElement);
renderer.physicallyBasedShading = true;
animate();
      setInterval(function(){
        angle = (angle + 0.05) % 360; 
      }, 50)
      function render() {
        let radius = 15;
        camera.position.x = radius * Math.cos( angle );  
        camera.position.z = radius * Math.sin( angle );
				camera.lookAt( scene.position );
               // requestAnimationFrame(render);
				renderer.render( scene, camera );
			}
      function animate() {
				requestAnimationFrame( animate );
				render();
			}
      
    }
});
