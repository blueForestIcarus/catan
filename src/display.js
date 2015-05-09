function Display(){
	this.scale = 1; //the distance between the center point of a tile and the center point of an adjacent tile
	
	//set up the renderer
	this.renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight ); 
	document.body.appendChild( renderer.domElement );
	
	this.scene = new THREE.Scene();
	this.controls = new Controls();
}

Display.prototype.tile_geometry(){
	var geometry = new THREE.Geometry();
	var n = this.scale/2;
	var y = n * Math.sin(Math.PI/3);
	var x = n * Math.cos(Math.PI/3);
	geometry.vertices.push(new THREE.Vector3(n,0,0));
	geometry.vertices.push(new THREE.Vector3(x,0,n));
	geometry.vertices.push(new THREE.Vector3(-x,0,n));
	geometry.vertices.push(new THREE.Vector3(-n,0,0));
	geometry.vertices.push(new THREE.Vector3(-x,0,-z));
	geometry.vertices.push(new THREE.Vector3(x,0,-z));
	geometry.vertices.push(new THREE.Vector3(0,0,0));
	geometry.faces.push(new THREE.Face3(1,2,0));
	geometry.faces.push(new THREE.Face3(2,3,0));
	geometry.faces.push(new THREE.Face3(3,4,0));
	geometry.faces.push(new THREE.Face3(4,5,0));
	geometry.faces.push(new THREE.Face3(5,6,0));
	geometry.faces.push(new THREE.Face3(6,7,0));
	
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

	return geometry;
}

function Controls(){
	this.controls = this.THREE.orbitalControls();
}

Controls.prototype.update(){
	this.controls.update();
}