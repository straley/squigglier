import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import { Sprite } from './Sprite/Sprite'
import { js_beautify } from 'js-beautify'

export type CompilerConfig = {
  source?: string,
  output?: string,
  extensions?: Array<string>
}

export type CompilerStatus = 'pending' | 'processing' | 'dependency' | 'error' | 'complete'

export type CompilerFile = {
  fullPath: string
  fileExtension: string
  fileName: string
  status: CompilerStatus
}

export type CompilerFiles = Array<CompilerFile>

export class Compiler {
  private configPath?: string
  private config?: CompilerConfig
  private files: CompilerFiles = []

  // requires configuration path, loads the config
  constructor(configPath: string) {
    this.configPath = configPath
    try {
      const json = fs.readFileSync(configPath, 'utf8')
      this.config = JSON.parse(json)
      this.begin()
    } catch (e) {
      console.error(e)
      process.exit()
    }
  }

  // start the process queue
  private begin() {
    if (!this.config.source) {
      console.error(`source missing in ${this.configPath}`)
      process.exit()
    }

    // default output to the source directory
    if (!this.config.output) {
      this.config.output = this.config.source
    }

    // default file extensions to [*.sprite]
    if (!this.config.extensions) {
      this.config.extensions = ['.sprite']
    }
    
    // make sure file extensions is an array
    if (!Array.isArray(this.config.extensions)) {
      if (typeof this.config.extensions !== 'string' || this.config.extensions == '') {
        console.error(`invalid extensions in ${this.configPath}`)
        process.exit()
      }
      this.config.extensions = [this.config.extensions]
    }

    // load all of the source content
    this.loadSource()
    // start the process queue
    this.processPending()
  }

  private loadSource() {
    const basePath = path.join(path.dirname(this.configPath), this.config.source)
    try {
      const files = fs.readdirSync(basePath)

      // load each file
      files.forEach(fileName => {
        const fullPath = path.join(basePath, fileName)
        const fileExtension = path.extname(fileName)

        // ignore files with non-matching extensions
        if (!this.config.extensions.includes(fileExtension)) {
          return
        }

        // ignore directories
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
          return
        }

        // add the files to the queue
        this.files.push({
          fileName,
          fullPath,
          fileExtension,
          status: 'pending'
        })
      })
    } catch (e) {
      console.error(e)
      process.exit()
    }
  }

  private processPending() {
    // load the next file marked as pending and process it
    const nextFile = this.files.find(file => file.status === 'pending')
    this.processFile(nextFile)
  }

  private async processFile(file: CompilerFile) {
    // keep processing the files in the queue everything is marked
    // as complete (or error)
    while (file.status !== 'error' && file.status !== 'complete') {
      switch (file.status) {
        // if a file is marked as processing, pause and wait
        // for it to finish 
        case 'processing': { 
          await this.onStatusChange(file, 'processing')
          break
        }
        // if a file is marked as having dependencies, wait for those
        // to process
        // todo: explore if this is needed
        case 'dependency': {
          await this.sleep(200)
          break
        }
        // just compile the pending files
        case 'pending': {
          file.status = 'processing'
          this.compile(file)
          break
        }
      }
    }
  }

  private pretty (dom: JSDOM) {
    const VOID_ELEMENTS = [
      'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 
      'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 
      'wbr'
    ]
    
    const html = dom.serialize()
    let indent = 0
    let cdataIndent: number = null
    let inCdata = false
    let jscode: Array<string> = []

    return html.split(/\n/).map((line:string) => {
      if (line.match(/^\s*(\/\/\s*)?<!\[CDATA\[/)) {
        inCdata = true
        jscode = []
        return `${' '.repeat(indent)}${line.trim()}`  
      }
      
      if (inCdata && line.match(/^\s*(\/\/\s*)?\]\]>/)) {
        inCdata = false
        cdataIndent = null

        const pretty = js_beautify(jscode.join(''))
        return `${pretty}\n${' '.repeat(indent)}${line.trim()}`

        // return `${' '.repeat(indent)}${line.trim()}`  
      }

      if (inCdata) {
        // todo: don't pretty if not js

        jscode.push(line)
        return ''
      }

      const tagParts = line.match(/<\s*([\/]{0,1})\s*([a-zA-Z_\-]+)([^\>]*)([\/]{0,1})\s*>/)
      if (!tagParts) {
        return line
      }

      const [, closer, tagName, contents ] = tagParts 

      const selfClosing = !!contents.match(/\/\s*$/)

      if (closer) {
        indent = Math.max(indent - 2, 0)
        return `${' '.repeat(indent)}${line}`  
      }

      if (
        VOID_ELEMENTS.includes(tagName) ||
        closer ||
        selfClosing
      ) {
        return `${' '.repeat(indent)}${line}`  
      }

      indent += 2
      return `${' '.repeat(indent - 2)}${line}`  
    }).filter(line => line.trim() !== '').join('\n')
  }    

  private compile (file: CompilerFile) {
    try {
      // load the file and try to attach it to a virtual dom
      const src = fs.readFileSync(file.fullPath, 'utf8')
      const dom = new JSDOM(src, {
        contentType: "image/svg+xml",
      });

      // process each sprite in the dom
      // todo: this should just be top-level sprites?
      const entities:Array<any> = []
      dom.window.document.querySelectorAll('sprite').forEach(element => {
        const sprite = new Sprite(element)
        entities.push(sprite)
      })

      const rendering = new JSDOM(this.render(entities), {
        contentType: "image/svg+xml",
      });
      console.log(this.pretty(rendering)) 
      
      file.status = 'complete'
    } catch (e) {
      console.error(e)
      file.status = 'error'
    }
  }

  public render(entities:Array<any>) {
    return entities.map(
      entity => {
        if (
          (typeof entity !== 'object') ||
          !('render' in entity) ||
          !(typeof entity.render === 'function')
         ) {
          console.log('unprocessable entity', entity)
          return
        }

        return entity.render()
      }
    ).join('\n')
  }

  private async onStatusChange(file: CompilerFile, from: CompilerStatus) {
    // wait for the file status to change from the 'from' value
    while (file.status === from) {
      await this.sleep(100)
    }
    
    return true
  }

  private async sleep(ms:number) {
    // pause a number of seconds (with await)
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}