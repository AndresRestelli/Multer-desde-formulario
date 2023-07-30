import express from 'express';
import multer from 'multer';


// esto indica que multer debe guardar el archivo
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        
        // const destinationFolder = './tmp/uploads';

        // Al estar dentro de public, el cliente tendrá acceso (por estar activo el middleware de static files)
        const destinationFolder = './public/img/';

        // console.log(file);
        const error = null;
        callback(error, destinationFolder);
    },
    filename: function (req, file, callback) {
        // console.log(file);
        const error = null;

        // Para cambiarle el nombre por otro aleatorio para minimizar que ya pueda existir uno con el mismo nombre
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(error, `${uniqueSuffix}-${file.originalname.toLowerCase().replaceAll(' ', '-')}`);
    }
});

const fileFilter = (req, file, callback) => {
    const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    const mimeTypeIsOk = validMimeTypes.includes(file.mimetype);
    callback(null, mimeTypeIsOk);
};

const upload = multer({ storage, fileFilter});

const app = express();
app.use(express.static('public', { extensions: ['html', 'htm'] }));


// "archivo" es el name del input file en el HTML, debe coincidir.
// "upload.single('archivo')"" es un middleware que se ejecuta antes que el callback "function (req, res, next)"
app.post('/upload', upload.single('archivo'), function (req, res, next) {
    if (req.file) {
        console.log(req.file);
        res.send(`
            <h1>¡Gracias!</h1>
            <p>Archivo subido con éxito.</p>
            <img src="img/${req.file.filename}" alt="Imagen">
        `);
        // res.send({status: 'ok'});
    } else {
        res.status(415).send('<h1>Se produjo un error.</h1>');
        // res.status(415).send({ error: 'Se produjo un error.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor Express escuchando en el puerto ${PORT}.`));
