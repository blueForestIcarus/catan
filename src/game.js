function Board(){
    this.structures = []; //actual objects
    this.tiles = []; //actual values;
    this.tile_map = {};
    this.thief = [0,0,0];
}

Board.prototype.createMap = function(){
    for(var v=-3 ; v <= 3 ; v++){
        var min = v<0 ? -3-v : 0;
        var max = 3;
        for(var p=min ; p <= max ; p++){
            var location = fixCoord([v,p,-v-p]);//axis: vertical, positive slope, negative slope
            var number = Math.ceil(Math.random()*10);
            var index = this.tiles.length;
            var type = gpm.randTileType();
            
            var newtile = new Tile(number, type, location, index);
            this.tiles.push(newtile);
            this.tile_map[location]= this.tiles.length - 1;
            console.log(location);

        }
    }

    this.placeThief([0,0,0]);
} 

//this should mot use map
Board.prototype.placeThief = function(target){
    if(this.tile_map[target] != null){
        this.getTile(this.thief).thief=false;
        this.thief = target;
        this.getTile(target).thief=true;
    }
}

Board.prototype.getTile = function(target){
    return this.tiles[this.tile_map[fixCoord(target)]];
}

Board.prototype.checkForRoad = function(vertex){
    if(this.structureAt(edges[0]) || this.structureAt(edges[1]) || this.structureAt(edges[2])){
        return true;
    }
}

Board.prototype.otherVertex = function(edge, vertex){
    var axis = 0;
    for(var i = 0; i<3 ;i++){
        if(this.tiles[edge.tiles[0]].location[i]==this.tiles[edge.tiles[1]].location[i]){
            axis=i;        
        }
    }

    var v_location = this.tiles[vertex.getThirdTile(edge)].location;
    var direction = this.tiles[edge[0]].location[axis] - v_location[axis];

    var location = v_location;
    for(var i = 0; i<3 ;i++){
        if(axis == i){        
            location[axis] += 2 * direction;
        }else{
            location[axis] -= direction;
        }
    }

    return new Vertex(edge[0],edge[1],this.tile_map[location]);
}

Board.prototype.structureAt = function(target){
    var ts = tiles[target[0]].structures;
    for(index in ts){
        var structure = this.structures[ts[index]];
        if(target instanceof Vertex){
            if(structure.getPlacement() == GPM.VERTEX && structure.location.equals(target)){
                return true;
            }    
        }else if(target instanceof Edge){
            if(structure.getPlacement() == GPM.EDGE && structure.location.equals(target)){
                return false;
            } 
        }
    }
    return false;
}


Board.prototype.getStructureAt = function(target){
    var ts = tiles[target[0]].structures;
    for(index in ts){
        var structure = this.structures[ts[index]];
        if(target instanceof Vertex){
            if(structure.getPlacement() == GPM.VERTEX && structure.location.equals(target)){
                return structure.index;
            }    
        }else if(target instanceof Edge){
            if(structure.getPlacement() == GPM.EDGE && structure.location.equals(target)){
                return structure.index;
            } 
        }
    }
    return -1;
}

Board.prototype.addStructure = function(type, location, player){
	if(!this.structureAt(location)){
		this.structures.push(new Structure(type, location, this.structures.length, player));
		return this.structures.length -1;
	}else{
		var index = this.getStructureAt(location);
		this.structures[index] = new Structure(type, location, this.structures.length, player);
		return index;
	}
}

function Tile(number, type, location, index){
    this.diceNumber = number;//number
    this.type = type;    //number

    this.location = location; //index [v,p,n]
    this.index = index; //single int

    this.vs = [-1,-1,-1,-1,-1,-1]; // start up go clockwise
    this.es = [-1,-1,-1,-1,-1,-1]; //start right go clockwise
    
    this.thief = false;
    this.structures = [];
}

Tile.prototype.collect = function(roll){
    if(roll==this.diceNumber && !this.thief){
        return [this.type];
    }
    return [];
}

function Structure(type, location, index, player){
    this.type = type;
    this.placement = gpm.GSI[this.type].placement;

    this.location = location; //Vertex or Edge
    this.index = index;

    this.player = player;

    //should this be here
    this.production = gpm.GSI[type].production;
}

Structure.prototype.getPlacement = function (){
    return placement;
}

Structure.prototype.upgrade = function(type){
    this.type = type;
    this.production = gpm.GSI[type].production;
}

Structure.prototype.collect = function (initial){
    var output = [];
    for(var i = 0; i < this.production; i++){
        output = output.concat(initial);            
    }      
    return output;
}

function Vertex(t1,t2,t3){
    this.tiles= [t1,t2,t3]; //numbers
}

Vertex.prototype.equals =function(other){
    this.tiles.sort();
    other.tiles.sort();
    for(index in this.tiles){
        if(this.tiles[index] != other.tiles[index]){
            return false;  
        }    
    }
    return true;
}

Vertex.prototype.checkEdge = function(other){
    return this.tiles.contains(other[0]) && this.tiles.contains(other[1]);
}

Vertex.prototype.getThirdTile = function(edge){
    return this.tiles.remove(edge[0]).remove(edge[1]);
}

Vertex.prototype.getEdges = function(other){
    return [new Edge(this.tiles[2],this.tiles[0]), new Edge(this.tiles[0],this.tiles[1]), new Edge(this.tiles[1],this.tiles[2])];
}

function Edge(t1,t2){
    this.tiles= [t1,t2]; //numbers
}

Edge.prototype.equals =function(other){
    this.tiles.sort();
    other.tiles.sort();
    for(index in this.tiles){
        if(this.tiles[index] != other.tiles[index]){
            return false;
        }    
    }
    return true;
}

Location.prototype.getTile = function(index){
    this.tiles[index];
}

function GPM(){
    this.GRI=[];
    this.GSI=[];
    this.GRM=[];
    this.GSM=[];
    this.rarities = [];

    this.board = new Board();
    this.players = []; //players and npcs
}

GPM.EDGE = 0;
GPM.VERTEX = 1;

GPM.prototype.addResource = function(name, rarity){
    var gr = new GR(name, this.GRI.length, rarity);
    this.GRI.push(gr);
    this.GRM[name] = gr;
    return gr.index;
}

GPM.prototype.addStructure = function(name, base, crafting, production, placement){
    var gs = new GS(name, this.GSI.length, production);
    gs.setCrafting(base, crafting, placement);
    this.GSI[gs.index] = gs;
    this.GSM[name] = gs;
}

GPM.prototype.calculateRarities = function(){
    var total = 0;
    for(var index in this.GRI){
        total += GR[index].rarity;
    }

    var current = 0;
    for(var index in this.GRI){
        current += GR[index].rarity/total;
        rarities.push(current);
    }
}

GPM.prototype.randTileType = function(){
    var rand = Math.random();
    for(var index in this.rarities){
        if(rand < this.rarities[index]){
            return index;        
        }
    }
    return 0;
}

GPM.prototype.playerCanBuild = function(player, type, location){
    type = this.structures[type];
    player = this.players[player];
    
    var materials = type.crafting;
    var temp = player.resources.clone();
    
    for(var index in materials){
        player.resources[materials[index]] -= 1;
        if(player.resources[materials[index]]<0){
            return false;        
        }
    }
    
    if(type.base_structure != -1){
        var baseType = this.structures[type.base_structure].index;
        var hasBase = false;
        for(var index in player.structures){
            //this could be done using board.structureAt() which is more efficient
            var structure = this.board.structures[player.structures[index]];
            if(structure.type == baseType && structure.location.equals(location)){
                hasBase = true;            
            }        
        }
        
        return hasBase;
    }else{
        var hasRoad = false;
        var hasSpace = true;            
        var edges = location.getEdges();

        for(var index in edges){
            var edge = edges[index];
            if(this.board.structureAt(edge)){
                hasRoad = true;            
            }
            if( this.board.structureAt( this.board.otherVertex(edge, location) ) ){
                hasSpace = false;            
            }
        }

        if(this.board.structureAt(location)){
            return false;        
        }

        return hasSpace && hasRoad;
    }
}

GPM.prototype.roll = function(){
    var roll = Math.ceil(Math.random()*6) + Math.ceil(Math.random()*6);
    for(index in this.board.structures){
        var structure = this.board.structures[index];

        if(structure.placement == GPM.VERTEX){
            var resources = [];        

            for(t in structure.location.tiles){
                var tile = this.board.tiles[structure.location.tiles[t]];
                resources = resources.concat(tile.collect());
            }        

            resources = structure.collect(resources);
            this.players[structure.player].give();
        }
    }
}

GPM.prototype.try_build = function(player, type, location){	
	if(playerCanBuild(player, type, location)){
		structure = this.board.addStructure(type, location, player);
		this.players[player].build(this.GSI[type].crafting, structure);
	}
}

GPM.prototype.force_build = function(player, type, location){	
	structure = this.board.addStructure(type, location, player);
	this.players[player].build(this.GSI[type].crafting, structure);
}

function GR(name,index, rarity){
    this.id=name;
    this.index=index;
    this.rarity= rarity;
}

function GS(name,index, production){
    this.id=name;
    this.index=index;
    this.placement = GPM.EDGE;

    this.base_structure;
    this.crafting;

    this.production = production;
}

GS.prototype.setCrafting = function(stucture, crafting, type){
    this.base_structure = stucture;
    this.crafting = crafting;
    this.placement = type;
}
 
function Player(index){
    this.index = index;
    this.resources=[];  //amounts
    this.stuctures=[]; //number ids

    for(var i in gpm.resources){
        this.resources.push(0);    
    }
}

Player.prototype.give = function(item, amount){
    this.resources[item]+=amount;
}

Player.prototype.collect = function(resources){
    for(var index in resources){
        this.give(resources[index],1);
    }
}

Player.prototype.withdraw = function(item, amount){
    this.resources[item]-=amount;
}

Player.prototype.hasResources = function(materials){
    var temp = resources.clone();
    for(var index in materials){
        temp[index]-=1;
        if(temp[index]<0){
            return false;        
        }
    }
    return true;
}


Player.prototype.build = function(materials , index){
    for(var index in materials){
        this.withdraw(materials[index],1);
    }

    if(!this.structures.contains(index)){
        this.structures.push(index);    
    }
}

function fixCoord(list){
    for(i in list){
        list[i] = list[i]==0?0:list[i]; 
    }  
    return list; 
}



