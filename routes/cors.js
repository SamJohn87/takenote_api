const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'exp://192.168.1.66:8081'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));

    if (whitelist.indexOf(req.header('Origin')) !== -1) { //check if origin can be found in whitelist
        corsOptions = { origin: true } //was found - request accepted
    } else {
        corsOptions = { origin:false}
    }
    
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate); //middleware checking origin