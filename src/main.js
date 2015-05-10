var drm, gpm, game;

function Game(){
    gpm = new GPM();
    drm = new DRM();

    this.setup();
    gpm.board.createMap();
    drm.display.renderMap();
    drm.display.render();

    alert("asdf");
}

Game.prototype.setup = function(){
    gpm.addResource("iron", 1);
    gpm.addResource("wood", 1);
    drm.addTileMaterial(1,"one.jpg");
    drm.addTileMaterial(2,"two.jpg");

    gpm.addStructure("road",-1,[1,1,2],0,GPM.EDGE);
    gpm.addStructure("house",-1,[1,1,2],0,GPM.VERTEX);
}

