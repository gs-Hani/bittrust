const express = require('express');
const app = express();

const modules  = require('./modules/modulesIndex');
modules(app);

const { PORT } =  require('./model/config');
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
