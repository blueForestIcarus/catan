var gpm;

function Board(){
}

function GPM(){
    this.GRI=[];
    this.GSI=[];
    this.GRM=[];
    this.GSM=[];
    this.rarities = [];
}

GPM.prototype.addResource = function(name, rarity){
    var gr = new GR(name, this.GRI.length, rarity);
    this.GRI[gr.index] = gr;
    this.GRM[name] = gr;
}

GPM.prototype.addStructure = function(name, base, crafting){
    var gs = new GR(name, this.GSI.length);
    gs.setCrafting(base, crafting);
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

function GR(name,index, rarity){
    this.id=name;
    this.index=index;
    this.rarity= rarity;
}

function GS(name,index){
    this.id=name;
    this.index=index;

    this.base_structure;
    this.crafting;
}

GS.prototype.setCrafting = function(stucture, crafting){
    this.base_structure = structure;
    this.crafting = crafting;
}
 
function Player(){
    this.resources=[];
    this.stuctures=[];

    for(var index in gpm.resources){
        this.resources.push(0);    
    }
}

Player.prototype.give = function(item, amount){
    this.resources[item]+=amount;
}

Player.prototype.withdraw = function(item, amount){
    this.resources[item]-=amount;
}

Player.prototype.build = function(type , target){
    var materials = gpm.structures[type].crafting;

    for(var index in materials){
        this.resources[materials[index]] -= 1;
    }
//TODO implement location and base structure
}
