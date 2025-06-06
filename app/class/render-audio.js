const googleTSS = require('google-tts-api'); 


class TSSAudio{
    constructor(comment){
        this.text = comment;
        this.source = null;
    }
    

    async getBinary(){
        try {
         if(!this.text) throw new Error('Text is undefined');
            const audiobs64 = await googleTSS.getAudioBase64(this.text,{lang:'es', slow: false });
            if(!audiobs64) throw new Error('audiobs64 is undefined');
            this.source = `data:audio/mp3;base64,${audiobs64}`;
            return this.source;
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = TSSAudio;