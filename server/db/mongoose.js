const mongoose = require('mongoose');

mongoose.connect(process.env.DEV_MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})