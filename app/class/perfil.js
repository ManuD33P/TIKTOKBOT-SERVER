const { TikTokLiveConnection, WebcastEvent, ControlEvent,SignConfig } = require('tiktok-live-connector');
const TSSAudio = require('./render-audio');
const EventQueue = require('./event-queue');
const fetchYouTubeVideos = require('./youtube');
const Like = require('./like');
class Perfil{
    constructor({username,interval = 10000}){
        this.username = username;
        this.messages = [];
        this.eventQueue = new EventQueue(interval);
        this.likes = new Map();
    
        this.live = null;
    }


    setMessage(message){
        if(!message) this.messages.push(message)
        this.lastMessage = message;
    }   

     setLive(){
        try {
            // const apykey = 'MDQ4ODI2MzFhZmI0MGY1MmZmYTA2YTUyODZjZTVkOTQ4ZTk4YTM1NjE4MTJkZDBhYzJmZmIz'
            // SignConfig.apiKey = apykey;
            const newLive =  new TikTokLiveConnection(this.username);
            if(!newLive) return null
            this.live = newLive
            if(!this.live) throw new Error('error: ', this.live);
        } catch (error) {
            console.log(error)
        }
    }


    async conected(socket){
        if(!this.live) return false;

        await this.live.connect();
        if(this.live) socket.emit('tiktokConected')

    
        this.live.on(ControlEvent.DISCONNECTED, (state) => socket.emit('tiktokDisconnect'))
        this.live.on(WebcastEvent.CHAT, async(data)=>{
            //https://www.youtube.com/watch?v=BPidLpADlaM
            if(data.comment.startsWith('.yt')){
                const arg = data.comment.substr(4);
                const id = await fetchYouTubeVideos(arg);
                socket.emit('newMusic',(id))
            } else {
                const newAudio = new TSSAudio(`${data.user.nickname} Dice: ${data.comment}`);
                await newAudio.getBinary()
                this.setMessage(newAudio);
                this.eventQueue.enqueue(()=> {
                    socket.emit('newComment',newAudio)
                });
            }
        })

        this.live.on(WebcastEvent.LIKE, async (data) => {
            const {nickname} = data.user;
            if(this.likes.has(nickname)){
                const lastLike = this.likes.get(nickname);
                if(lastLike.getLastLike() < 40) return 
            } else {
                const newAudio = new TSSAudio(`Gracias por tu like: ${nickname}`)
                await newAudio.getBinary();
                const newLike = Like(nickname,newAudio)
                this.likes.set(nickname,newLike);
            }
            this.eventQueue.enqueue(()=> {
                currentLike = this.likes.get(nickname);
                socket.emit('newComment',currentLike.binary)
            });
        });
    
        
        this.live.on(WebcastEvent.FOLLOW, async(data) => {
            try {
                const {nickname} = data.user;
                const newAudio = new TSSAudio(`Gracias por seguirme ${nickname}`);
                await newAudio.getBinary();
                this.eventQueue.enqueue(()=>{
                    socket.emit('newComment', newAudio);
                })
            } catch (error) {
                console.log(error);
            }

        })

        this.live.on(WebcastEvent.SHARE, async(data) => {
            try {
                const {nickname} = data.user;
                const newAudio = new TSSAudio(`Gracias por compartir ${nickname}`);
                await newAudio.getBinary();
                this.eventQueue.enqueue(()=>{
                    socket.emit('newComment', newAudio);
                })
            } catch (error) {
                console.log(error)
            }
        })
    }

}


module.exports = Perfil;