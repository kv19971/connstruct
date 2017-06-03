/**
 * Created by Victor on 6/3/2017.
 */
import three from "three";
import OBJLoader from 'three-obj-loader';
OBJLoader(three)
import './importcad.html';

//obj = require('./obj/building.obj');

Template.importcad.viewmodel({
    domElement: null,
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

        var camera = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.z = 10;
        
        var scene = new three.Scene();

        var ambient = new three.AmbientLight( 0x101030 );
				scene.add( ambient );
        var directionalLight = new three.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 );
				scene.add( directionalLight );

        var manager = new three.LoadingManager();
        var loaders = new three.OBJLoader(manager);
        loaders.load("building.obj", function ( object ) {
					
                    object.position.y = 0;
					scene.add( object );
				});
        var renderer = new three.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

        document.getElementById("model_cad").appendChild(renderer.domElement);

        function render() {
				// camera.position.x += ( 500 - camera.position.x ) * .05;
				// camera.position.y += ( - 1000 - camera.position.y ) * .05;
				// camera.lookAt( scene.position );
                requestAnimationFrame(render);
				renderer.render( scene, camera );
			}
        render();
    }
})