var self = module.exports = {

    connect : function(mySqlConnection) {
        mySqlConnection.connect(function (err) {
        if (err) {
            console.log('[MySQL Package] Error connecting to database: ' + err);
            console.log('[MySQL Package] Reconnecting in 5 Seconds');
            setTimeout(function (args) {
                self.connect(mySqlConnection);
            }, 5000);
        } else {
            console.log('Databse Server Connected');
            mySqlConnection.query('use bc4dollar', function(err){
                if(err)
                    console.log('[MySQL Package] Error Selecting Database:' + err.stack);
                else
                    console.log('[MySQL Package] Selected Database');
            });
        }
        });

        mySqlConnection.on('error', function (err) {
            console.log('[MySQL Package] Database Error');
            if(err.code == 'PROTOCOL_CONNECTION_LOST') {
                mySqlConnection.end();
                self.connect(mySqlConnection);
            } else {
                throw err;
            }
        });
    }

};