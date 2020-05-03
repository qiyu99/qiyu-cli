const mongoose = require('mongoose');

run().then(() => console.log('db is connected')).catch(error => console.error(error.stack));

async function run() {
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    await mongoose.connect('mongodb://localhost/depot');
}