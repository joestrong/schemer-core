var gameengine = {};

gameengine.mesh = {};
gameengine.mesh.getMeshFromString = function(meshPath, callback) {
    if(meshPath.indexOf('.json')) {
        var loader = new THREE.JSONLoader();
        loader.load('/app/' + meshPath, callback);
    }
};

gameengine.primitives = {};
gameengine.primitives.box = new THREE.BoxGeometry(1, 1, 1);

gameengine.materials = {};
gameengine.materials.default = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

gameengine.textures = {
    files: [],
    texture: {},
    loadCount: 0,
    preload: function (callback) {
        this.loadTextures(this.files, function(){
            callback();
        });
    },
    loadTextures: function(files, callback) {
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                this.loadTexture(files[i], callback);
            }
        } else {
            callback();
        }
    },
    loadTexture: function(file, callback) {
        THREE.ImageUtils.loadTexture('/app/textures/' + file, undefined, function(texture){
            this.texture[file] = texture;
            this.textureLoaded(callback);
        }.bind(this));
    },
    textureLoaded: function(callback){
        this.loadCount++;
        if(this.loadCount == this.files.length){
            callback();
        }
    }
};

gameengine.scene = function(){};
gameengine.scene.prototype = {
    objects: [],
    init: function(){},
    addObject: function(object) {
        object.init();
        this.objects.push(object);
        if (typeof object.mesh === "string") {
            gameengine.mesh.getMeshFromString(object.mesh, function(geometry){
                gameengine.renderer.addMesh({geometry: geometry, material: object.material});
            });
        }else{
            gameengine.renderer.addMesh({geometry: object.mesh, material: object.material});
        }
    }
};

gameengine.object = function(){};
gameengine.object.prototype = {
    mesh: null,
    material: gameengine.materials.default,
    init: function(){}
};

gameengine.autoloader = {
    coreFiles: [
        'gen/textures'
    ],
    autoload: function(callback) {
        this.loadScript('gen/autoload', function() {
            this.loadFiles(function(){
                callback();
            });
        }.bind(this));
    },
    loadFiles: function(callback) {
        var loadCount = 0;
        var files = this.coreFiles.concat(gameengine.autoloader.files);
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                this.loadScript(files[i], fileLoaded);
            }
        } else {
            callback();
        }
        function fileLoaded() {
            loadCount++;
            if(loadCount == files.length) {
                callback();
            }
        }
    },
    loadScript: function(file, callback) {
        var head = document.querySelector('head');
        var script = document.createElement("script");
        script.src = file + ".js";
        if (callback) {
            script.onreadystatechange = callback;
            script.onload = callback;
        }
        head.appendChild(script);
    }
};

gameengine.renderer = {
    scene: null,
    camera: null,
    renderer: null,
    init: function() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, gameengine.config.canvas.width / gameengine.config.canvas.height, 0.1, 1000);
        this.camera.position.y = 2;
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(gameengine.config.canvas.width, gameengine.config.canvas.height);
        document.body.appendChild(this.renderer.domElement);

        var render = function () {
            requestAnimationFrame(render);
            this.renderer.render(this.scene, this.camera);
        }.bind(this);
        render();
    },
    addMesh: function(pMesh) {
        var geometry = pMesh.geometry;
        var material = pMesh.material;
        var mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
    }
};

gameengine.run = function() {
    gameengine.renderer.init();
    var startScene = window[gameengine.config.start];
    startScene.init();
};

(function() {
    gameengine.autoloader.autoload(function(){
        gameengine.textures.preload(function() {
            gameengine.run();
        });
    });
})();
