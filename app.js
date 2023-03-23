let express = require('express');
let app = express();

app.list(8080, () => {
    console.log('Server started on port 8080');
});