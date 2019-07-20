"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// todo: make this only in development mode
require('source-map-support').install();
const Compiler_1 = require("./Squigglier/Compiler");
const process_1 = __importDefault(require("process"));
// import {SpriteLoader} from './Sprite/SpriteLoader'
const configPath = `${process_1.default.argv.length > 2 ? process_1.default.argv[process_1.default.argv.length - 1] : ''}squigglier.config.json`;
const compiler = new Compiler_1.Compiler(configPath);
// console.log('here')
// document.addEventListener(
//   'DOMContentLoaded', 
//   ()=>new SpriteLoader() 
// )
//# sourceMappingURL=index.js.map