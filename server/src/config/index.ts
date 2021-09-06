import nconf from 'nconf'

nconf.argv()
  .env()
  .file({
    file: `config.json`
  })

const config = nconf
export default config
