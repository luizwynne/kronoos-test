var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())
 
try {
    
    app.use('/api/data', require('./routes/data.route'))
    
    var server = app.listen(8080, function () {
        var host = server.address().address
        var port = server.address().port
        console.log("App listening at http://%s:%s", host, port)
    })

} catch (error) {
    console.log(error);
}