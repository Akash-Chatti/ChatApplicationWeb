const mongoose=require('mongoose')

mongoose.connect(process.env.mongooseConstr,{useUnifiedTopology:true,useCreateIndex:true,
    useNewUrlParser:true, useFindAndModify:false})