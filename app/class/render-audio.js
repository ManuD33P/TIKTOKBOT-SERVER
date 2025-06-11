const axios = require('axios');
const googleTSS = require('google-tts-api');

class TSSAudio {
    constructor(comment) {
        this.text = comment;
        this.source = null;
    }

    async fetchProxies() {
        try {
            const response = await axios.get("https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=https&proxy_format=ipport&format=json");
            const proxies = response.data.proxies.map(p => p.proxy);
            if (proxies.length === 0) throw new Error("No se encontraron proxies");
            return proxies;
        } catch (error) {
            console.log("Error al obtener proxies:", error);
            return [];
        }
    }

    async getBinary() {
        try {
            if (!this.text) throw new Error('Text is undefined');

            const proxies = await this.fetchProxies();
            if (proxies.length === 0) throw new Error("No hay proxies disponibles");

            let audioBase64 = null;

            for (const proxy of proxies) {
                const [host, port] = proxy.split(":");

                try {
                    const audiobs64 = await googleTSS.getAudioBase64(this.text, {
                        lang: "es",
                        slow: false,
                        requestOptions: { proxy: `http://${host}:${port}` }
                    });

                    if (!audiobs64) throw new Error("Error al obtener audio.");

                    this.source = `data:audio/mp3;base64,${audiobs64}`;
                    audioBase64 = audiobs64;
                    console.log("¡Audio generado exitosamente!");
                    break;
                } catch (error) {
                    console.log(`Error con el proxy ${proxy}, probando otro...`);
                }
            }

            if (!audioBase64) {
                throw new Error("No se pudo generar el audio con ningún proxy.");
            }

            return this.source;
        } catch (error) {
            console.log("Error en la generación de audio:", error);
        }
    }
}

module.exports = TSSAudio;