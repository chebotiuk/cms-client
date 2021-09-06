const nunjucks = require("nunjucks")
const fs = require("fs")

const config = nunjucks.render('config.njk', process.env)

fs.writeFileSync('config.json', config)
