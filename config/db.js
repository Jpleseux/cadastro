if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://joaopleseux:mm24~~92h@cluster0.cbmyz7n.mongodb.net/?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/cadastro"}
}