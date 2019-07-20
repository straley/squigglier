// todo: make this only in development mode
require('source-map-support').install();

import { Compiler } from './Squigglier/Compiler'
import process from 'process'


// import {SpriteLoader} from './Sprite/SpriteLoader'

const configPath = `${process.argv.length > 2 ? process.argv[process.argv.length - 1] : ''}squigglier.config.json`

const compiler = new Compiler(configPath)

// console.log('here')

// document.addEventListener(
//   'DOMContentLoaded', 
//   ()=>new SpriteLoader() 
// )
