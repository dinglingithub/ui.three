/*-------------------------------------

  the jquery-xx.js is required
  
  @author ding__lin@hotmail.com

-------------------------------------*/

(function(){
	$.fn.container = function(options){
		var defaults = {
			width:100,
			height:100,
		};
		var opts = $.extend(defaults,options);
		this.config = opts;
		this.scene = new THREE.Scene();
		this.scene.rotation.y = Math.PI * 0.80 ;
		this.scene.fog
		
		this.stats = new Stats();
		this.append( this.stats.dom );
		
		
		
		this.camera = new THREE.PerspectiveCamera( 40, this.config.width / this.config.height, 1, 10000 );
		this.camera.position.set( 0 , 500 ,1000);
		this.camera.rotation.x = -0.6;
		
		this.light = new THREE.DirectionalLight(0xFFFFFF,0.6);
		this.light.position.set(0, 500, 0);
        this.scene.add(this.light);
        
        this.light1 = new THREE.DirectionalLight(0xF0FFFF,0.8);
		this.light1.position.set(1000, 1000, -1000);
        this.scene.add(this.light1);
        
        this.light2 = new THREE.DirectionalLight(0xF0FFFF,0.8);
		this.light2.position.set(-1000, 1000, -1000);
        this.scene.add(this.light2);
		
		this.renderer = new THREE.WebGLRenderer({  
	        antialias:true,       //是否开启反锯齿  
	        precision:"highp",    //着色精度选择  
	        alpha:true,           //是否可以设置背景色透明  
	        premultipliedAlpha:false,  
	        stencil:false,  
	        preserveDrawingBuffer:true, //是否保存绘图缓冲  
	        maxLights:1           //maxLights:最大灯光数  
	    });
		this.renderer.setSize( this.config.width , this.config.height );
		this.renderer.setClearColor(0xFFFFFF, 1.0);
		
		var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		controls.maxPolarAngle = Math.PI * 0.5;
		controls.minDistance = 1000;
		controls.maxDistance = 7500;
		
		var effect = new THREE.AnaglyphEffect( this.renderer );
		effect.setSize( this.config.width, this.config.height );
		
		this.append(this.renderer.domElement);
		
		this.render = function(){
			requestAnimationFrame(this.render);
			this.renderer.render( this.scene, this.camera );
		}
		
		this.add = function(obj){
			this.scene.add(obj);
			this.flush();
		}
		this.flush = function(){
			this.renderer.clear();
			this.renderer.render( this.scene, this.camera );
			this.stats.update();
		}
		
		return this;
	}
	
	$.threeObject = function(options){
		var defaults = {
			
		};
		var opts = $.extend(defaults,options);
		this.config = opts;
		
		this.geometry = new THREE.BoxGeometry( 15, 40, 15);
		this.material = new THREE.MeshLambertMaterial( { color: 0xff9999 } );
		
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.config.container.add(this.mesh);
		return this.mesh;
	}
	
	$.floor = function(options){
		var defaults = {
			yy:10
		};
		var opts = $.extend(defaults,options);
		this.config = opts;
		this.geometry = new THREE.BoxGeometry(this.config.xx , this.config.yy , this.config.zz );
//		var texture = new THREE.TextureLoader().load('asset/floor.png');
//		texture.wrapS = THREE.RepeatWrapping;
//		texture.wrapT = THREE.RepeatWrapping;
//		texture.repeat.set( 16, 16 );
//		this.material = new THREE.MeshBasicMaterial( { map: texture } ); 
		
		this.material = new THREE.MeshLambertMaterial( { color: 0x999999 } ); 
		var grid = new THREE.GridHelper(1000,40);
		grid.position.set(0,-0.9,0);
		this.config.container.add(grid);
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.mesh.position.y = -Math.floor(this.config.yy / 2)-1;
		this.config.container.add(this.mesh);
		return this.mesh;
	}
	
	$.wall = function(options){
		var defaults = {
			zz:10,
			yy:100
		};
		var opts = $.extend(defaults,options);
		this.config = opts;
		this.geometry = new THREE.BoxGeometry(this.config.xx , this.config.yy , this.config.zz );
		this.material = new THREE.MeshLambertMaterial( { color: 0xFEFEFE } ); 
		
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		if ( this.config.x )
			this.mesh.position.x = this.config.x;
		if ( this.config.y )
			this.mesh.position.y = this.config.y;
		if ( this.config.z )
			this.mesh.position.z = this.config.z;
		
		if ( this.config.rx )
			this.mesh.rotation.x = this.config.rx;
		if ( this.config.ry )
			this.mesh.rotation.y = this.config.ry;
		if ( this.config.rz )
			this.mesh.rotation.z = this.config.rz;
		
		if (this.config.door){
			var w = new ThreeBSP(this.mesh);
			for ( var i = 0 ; i < this.config.door.length ; i ++ ){
				var m = new THREE.Mesh(new THREE.BoxGeometry(this.config.door[i].xx, this.config.door[i].yy ,this.config.zz) );
				m.position.x = this.mesh.position.x;
				m.position.y = this.config.door[i].yy /2 + 5 ;
				m.position.z = this.mesh.position.z;
				m.rotation.x = this.mesh.rotation.x;
				m.rotation.y = this.mesh.rotation.y;
				m.rotation.z = this.mesh.rotation.z;
				
				//m.rotation.set(this.mesh.rotation);
				//this.config.container.add(m);
				var mt = new THREE.MeshBasicMaterial( { color: 0x713B12 } );
				mt.transparent = true;
				mt.opacity = 0.5;
				var m1 = new THREE.Mesh(new THREE.BoxGeometry(this.config.door[i].xx, this.config.door[i].yy ,10 ) , mt);
				m1.position.x = this.mesh.position.x;
				m1.position.y = this.config.door[i].yy /2 + 5 ;
				m1.position.z = this.mesh.position.z;
				//m.rotation.set(this.mesh.rotation);
				m1.rotation.x = this.mesh.rotation.x;
				m1.rotation.y = this.mesh.rotation.y;
				m1.rotation.z = this.mesh.rotation.z;
				//m1.transparent = 0.2;
				this.config.container.add(m1);
				w = w.subtract(new ThreeBSP(m));
			}
			this.mesh = w.toMesh(); 
			//this.mesh.material.shading = THREE.FlatShading;  
			//this.mesh.geometry.computeFaceNormals(); 
			this.mesh.material = this.material;
		}
		if (this.config.window){
			var w = new ThreeBSP(this.mesh);
			for ( var i = 0 ; i < this.config.window.length ; i ++ ){
				var m = new THREE.Mesh(new THREE.BoxGeometry(this.config.window[i].xx, this.config.window[i].yy ,this.config.zz) );
				m.position.x = this.mesh.position.x;
				m.position.y = this.config.window[i].yy /2 + 30 ;
				m.position.z = this.mesh.position.z;
				//m.rotation.set(this.mesh.rotation);
				m.rotation.x = this.mesh.rotation.x;
				m.rotation.y = this.mesh.rotation.y;
				m.rotation.z = this.mesh.rotation.z;
				//this.config.container.add(m);
				
				var mt = new THREE.MeshBasicMaterial( { color: 0x00FEFE } );
				mt.transparent = true;
				mt.opacity = 0.2;
				var m1 = new THREE.Mesh(new THREE.BoxGeometry(this.config.window[i].xx, this.config.window[i].yy ,10 ) , mt);
				m1.position.x = this.mesh.position.x;
				m1.position.y = this.config.window[i].yy /2 + 30 ;
				m1.position.z = this.mesh.position.z;
				//m.rotation.set(this.mesh.rotation);
				m1.rotation.x = this.mesh.rotation.x;
				m1.rotation.y = this.mesh.rotation.y;
				m1.rotation.z = this.mesh.rotation.z;
				//m1.transparent = 0.2;
				this.config.container.add(m1);
				
				w = w.subtract(new ThreeBSP(m));
			}
			this.mesh = w.toMesh(); 
			//this.mesh.material.shading = THREE.FlatShading;  
			//this.mesh.geometry.computeFaceNormals(); 
			this.mesh.material = this.material;
		}
		this.config.container.add(this.mesh);
		return this.mesh;
	}
	
})(jQuery);