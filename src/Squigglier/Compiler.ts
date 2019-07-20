import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import { Sprite } from './Entity/Sprite/Sprite';

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

  private begin() {
    if (!this.config.source) {
      console.error(`source missing in ${this.configPath}`)
      process.exit()
    }

    if (!this.config.output) {
      this.config.output = this.config.source
    }

    if (!this.config.extensions) {
      this.config.extensions = ['.sprite']
    }
    
    if (!Array.isArray(this.config.extensions)) {
      if (typeof this.config.extensions !== 'string' || this.config.extensions == '') {
        console.error(`invalid extensions in ${this.configPath}`)
        process.exit()
      }
      this.config.extensions = [this.config.extensions]
    }

    this.loadSource()
    this.processPending()
  }

  private loadSource() {
    const basePath = path.join(path.dirname(this.configPath), this.config.source)
    try {
      const files = fs.readdirSync(basePath)

      files.forEach(fileName => {
        const fullPath = path.join(basePath, fileName)
        const fileExtension = path.extname(fileName)

        if (!this.config.extensions.includes(fileExtension)) {
          return
        }

        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
          return
        }

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
    const nextFile = this.files.find(file => file.status === 'pending')
    this.processFile(nextFile)
  }

  private async processFile(file: CompilerFile) {
    while (file.status !== 'error' && file.status !== 'complete') {
      switch (file.status) {
        case 'processing': { 
          await this.onStatusChange(file, 'processing')
          break
        }
        case 'dependency': {
          await this.sleep(200)
          break
        }
        case 'pending': {
          file.status = 'processing'
          this.compile(file)
          break
        }
      }
    }
  }

  private compile(file: CompilerFile) {
    try {
      const src = fs.readFileSync(file.fullPath, 'utf8')

      const dom = new JSDOM(src, {
        contentType: "image/svg+xml",
      });


      const entities:Array<any> = []
      dom.window.document.querySelectorAll('sprite').forEach(element => {
        const sprite = new Sprite(element)
        entities.push(sprite)  
      })

      console.log(JSON.stringify(entities, null, 4))

      file.status = 'complete'
    } catch (e) {
      console.error(e)
      file.status = 'error'
    }
  }

  private async onStatusChange(file: CompilerFile, from: CompilerStatus) {
    while (file.status === from) {
      await this.sleep(100)
    }
    
    return true
  }

  private async sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}