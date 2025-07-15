import app from './src/app.js';
import config from './src/utils/config.js';

app.listen(config.port, () => {
    console.log("Servidor iniciado el puerto => ", config.port)
})