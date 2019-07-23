// todo: make this only in development mode
require('source-map-support').install();

import { Compiler } from './Squigglier/Compiler'
import process from 'process'

;(async() => {
  const configPath = `${process.argv.length > 2 ? process.argv[process.argv.length - 1] : ''}squigglier.config.json`
  const compiler = new Compiler(configPath)
    await compiler.begin()
  })()

