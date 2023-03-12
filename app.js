const express = require("express")
const app = express()
const excel = require("exceljs")
const handlebars = require("express-handlebars")
const path = require("path")
const bodyparser = require('body-parser')
const {v4: uuidv4} = require("uuid")
const mongoose = require("mongoose")
require("./models/produtos")
const produtos = mongoose.model("produtos")
const without = require("remove-accents")
const fs = require("fs")
const db = require("./config/db")


// require("./excel/mae.xlsx")

//body parser
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, "public")))

//mongoose'
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://joaopleseux:mm24~~92h@cluster0.cbmyz7n.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("Conecção bem sucedida")
}).catch((err)=>{
    console.log("ERRO ENCONTRADO: "+err)
})
app.get("/", (req, res)=>{
    produtos.find().lean().then((produto)=>{
        res.render("index", {produto: produto})
    }).catch((err)=>{
        console.log(err)
    })

})

app.get("/cadastro", (req, res)=>{
    res.render("users/cadastro")
})
app.post("/cadastro", (req, res)=>{
    const newprod = {
        nome: req.body.prodnome,
        quantidade: req.body.quant,
        tipo: req.body.tipo
    }
    new produtos(newprod).save().then(()=>{
        res.redirect("/")
        console.log("Certo")
    }).catch((err)=>{
        res.redirect("/")

        console.log(err)
    })
})
app.post("/deletar", (req, res)=>{
    produtos.deleteOne({_id: req.body.id}).then(()=>{
        res.redirect("/")
    }).catch((err)=>{
        console.log(err)
        res.redirect("/")
    })
})
app.get("/edit/:id", (req, res)=>{
    produtos.findOne({_id: req.params.id}).lean().then((prods)=>{
        res.render("users/edit", {produto: prods})
    }).catch((err)=>{
        console.log(err)
    })
})
app.post("/pesquisa", (req, res)=>{

    const sem = without(req.body.pesquisa)

    produtos.find({nome: {$regex:sem, $options: 'i'}}).lean().then((prods)=>{
        console.log(prods)
        res.render("users/pesquisa", {produto: prods})
    }).catch((err)=>{
        console.log(err)
    })
})
app.post("/valor", (req, res)=>{
    produtos.findOneAndUpdate({_id: req.body.id}).then((produto)=>{
        console.log(produto)
        produto.quantidade = req.body.quantidade
        produto.save().then(()=>{
            console.log("success")
            res.redirect("/")
        }).catch((err)=>{
            console.log(`Erro ao editar ${err}`)
            res.redirect("/")
        })
    }).catch((err)=>{
        res.redirect("/")
        console.log("Erro ao listar produto"+ err)
    })
})

app.post("/genaration", (req, res)=>{
    const file = "./excel/estoque.xlsx";
    const filePath = path.join(__dirname, file);
    res.download(filePath);
})

app.get("/estoque", (req, res)=>{
    produtos.find().lean().then((produtoss)=>{
        const workbook = new excel.Workbook()

        const worksheet = workbook.addWorksheet("Estoque")

        worksheet.columns = [
            {header: "Nome", key: "nome"},
            {header: "Quantidade", key: "quantidade"},
            {header: "Tipo", key: "tipo"}
        ]
        produtoss.forEach(produto =>{
            worksheet.addRow({
                nome: produto.nome,
                quantidade: produto.quantidade,
                tipo: produto.tipo
            })
        })

        const filename = "./excel/estoque.xlsx"
        workbook.xlsx.writeFile(filename).then(()=>{
            console.log("Sucesso")
            res.render("store/store", {produto: produtoss})
        }).catch((err)=>{
            console.log(`Erro: ${err}`)
            res.redirect("/")
        })
    }).catch((err)=>{
        console.log(`Erro: ${err}`)
    })
})

//     const nome = req.body.prodnome
//     const id = uuidv4()
//     const quant = req.body.quant
//     const workbook = new excel.Workbook();
// workbook.xlsx.readFile("./excel/mae.xlsx").then(()=>{
//     const worksheet = workbook.getWorksheet("Plan1")
//     const newrow = worksheet.addRow([4, 5, 6])
//     newrow.getCell(1).value = nome
//     newrow.getCell(2).value = quant
//     newrow.getCell(3).value = id
//     return workbook.xlsx.writeFile("./excel/mae.xlsx")
// }).then(()=>{
//     console.log("certo")
//     res.redirect("/")
// }).catch((err)=>{
//     res.redirect("/")
//     console.log(err)
// })

const port = process.env.PORT ||5000
app.listen(port, ()=>{
    console.log("Server listening on the port: "+ port)
})