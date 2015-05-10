var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 2000;

function DRM(){
    this.TM = [];
    this.SM = [];

    this.display = new Display();
}

DRM.prototype.update = function(changes){
    //TODO
}

DRM.prototype.addTileMaterial = function(type, path){
    while(type>=this.TM.length){
        var material = this.material("default.jpg");
        this.TM.push(material); 
    }
    this.TM[type] = this.material(path);
}

DRM.prototype.addStructureMaterial = function(type, path){
    while(type>=this.TM.length){
        var material = this.material("default.jpg");
        this.TM.push(material); 
    }
    this.TM[type] = this.material(path);
}

DRM.prototype.material = function(path){
    var texture = THREE.ImageUtils.loadTexture(path);
	return material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: texture,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors,
    });
}

function Display(){
	this.scale = 1; //the distance between the center point of a tile and the center point of an adjacent tile
	
	//set up the renderer
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
	document.body.appendChild( this.renderer.domElement );
	
	this.scene = new THREE.Scene();
	this.controls = new Controls(this);

    this.geometry = tile_geometry();
}

Display.prototype.renderMap = function(){
    for( i in gpm.board.tiles){
        var tile = gpm.board.tiles[i];
        var x = tile.location[1] + tile.location[0]/2;
        var z = tile.location[0] * this.scale * Math.sin(Math.PI/3);

        console.log(x +  " " + z);

        var object = new THREE.Mesh(this.geometry, drm.TM[tile.type]);
        object.position.x = x;
        object.position.z = z;

        this.scene.add(object);
    }
}

Display.prototype.render = function(){//TODO get this working
	requestAnimationFrame( this.render );
    this.controls.controls.update();
    this.renderer.render( this.scene, this.controls.camera );
}

function tile_geometry(){
	var geometry = new THREE.Geometry();
	var n = this.scale/2;
	var z = n * Math.sin(Math.PI/3);
	var x = n * Math.cos(Math.PI/3);

	geometry.vertices.push(new THREE.Vector3(0,0,0));
	geometry.vertices.push(new THREE.Vector3(n,0,0));
	geometry.vertices.push(new THREE.Vector3(x,0,n));
	geometry.vertices.push(new THREE.Vector3(-x,0,n));
	geometry.vertices.push(new THREE.Vector3(-n,0,0));
	geometry.vertices.push(new THREE.Vector3(-x,0,-z));
	geometry.vertices.push(new THREE.Vector3(x,0,-z));

	geometry.faces.push(new THREE.Face3(1,2,0));
	geometry.faces.push(new THREE.Face3(2,3,0));
	geometry.faces.push(new THREE.Face3(3,4,0));
	geometry.faces.push(new THREE.Face3(4,5,0));
	geometry.faces.push(new THREE.Face3(5,6,0));
	geometry.faces.push(new THREE.Face3(6,1,0));
	
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();

	return geometry;
}

function Controls(display){
    // camera
    this.display=display;

    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.camera.position.set( 0, 75, 160 );

    this.controls = new THREE.OrbitControls(this.camera, this.display.renderer.domElement);
    this.controls.target.set( 0, 0, 0);
    this.controls.maxDistance = 400;
    this.controls.minDistance = 10;
    this.controls.update();
}

Controls.prototype.update = function(){
	this.controls.update();
}
