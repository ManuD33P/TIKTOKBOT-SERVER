class Like{
    constructor(usernick, binary){
        this.name = usernick;
        this.date = Date.now();
        this.binary = binary
    }


    getLastLike(){
        const dif = Math.floor((this.date - Date.now())) / 1000; //resultado
        return dif
    }

    
}


module.exports = Like;