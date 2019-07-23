import fs from 'fs'
import path from 'path'
import { Util } from './Util'
import { CompilerFiles, CompilerFile, CompilerFileStatus, CompilerFileStatusValues, StatusUpdateHandler } from './CompilerFile'

export type CompilerConfig = {
  source?: string,
  output?: string,
  extensions: Array<string>
}

export type StatusQueue = {
  [index in CompilerFileStatus]?: Array<CompilerFile>
}

export class Compiler {
  private configPath?: string
  private basePath?: string
  private config?: CompilerConfig
  private files: CompilerFiles = {}

  // requires configuration path, loads the config
  constructor(configPath: string) {
    try {
      const json = fs.readFileSync(configPath, 'utf8')
      this.config = JSON.parse(json)
    } catch (e) {
      console.error(e)
      process.exit()
    }

    this.configPath = configPath
    this.basePath = path.join(path.dirname(this.configPath), this.config.source)
  }

  // start the process queue
  public async begin() {
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

    // add files to queue
    this.initializeQueue()

    // start the process queue
    await this.processQueue()
  }

  private addFileToQueue (
    src: string, 
    onStatusUpdate: StatusUpdateHandler
  ) {
    if (this.files[src]) {
      this.files[src].onStatusUpdate(onStatusUpdate) 
      return
    }   

    // ignore directories
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      return
    }

    const compilerFile = new CompilerFile(src)
    compilerFile.onStatusUpdate(onStatusUpdate)

    this.files[src] = compilerFile
  }

  private initializeQueue() {
    try {
      const files = fs.readdirSync(this.basePath)

      // load each file
      files.forEach(name => {

        // ignore files with non-matching extensions
        const ext = path.extname(name)
        if (!this.config.extensions.includes(ext)) {
          return
        }
    
        const src = path.join(this.basePath, name)
        this.addFileToQueue(src, async (dependant, newStatus) => {
          // todo 
        })
      })
    } catch (e) {
      console.error(e)
      process.exit()
    }
  }

  public getStatusQueue () : StatusQueue {

    return Object.keys(this.files).reduce(
      (
        statusQueue: StatusQueue, 
        src: string
      ) => {
        const file = this.files[src]
        if (
          !file || 
          !(file instanceof CompilerFile) || 
          !(CompilerFileStatusValues.includes(file.status)) 
        ) {
          return statusQueue
        }

        if (!statusQueue[file.status]) {
          statusQueue[file.status] = []
        }

        statusQueue[file.status].push(file)
        return statusQueue
      }, 
      {}
    )
  }

  public queueComplete () {
    const { pending, blocked } = this.getStatusQueue()
    return (
      (!pending || pending.length === 0) &&
      (!blocked || blocked.length === 0)
    ) 
  }

  public async processQueue () {
    // load the next file marked as pending and process it

    while (true) {
      const { pending, blocked } = this.getStatusQueue()

      if (pending) {
        for (const file of pending) {
          try {
            await file.load()

            for (const src of file.dependancies) {
              this.addFileToQueue(
                src, 
                async (dependant, newStatus) => {
                  if (newStatus === 'complete') {
                    file.updateDependant(dependant)
                    await file.updateDeepStatus()

                    if (file.status === 'complete') {
                      file.updateDomFromRaw()
                      await file.overlayAttributes(dependant)
                      await file.renderEntities()
                      await file.overlayChildren(dependant)

                      const html = await file.render()

                      if (this.config.output) {
                        const outputFilePath = path.join(this.config.output, file.path.name) + '.sprite.svg'
                        fs.writeFileSync(outputFilePath, html)
                        console.log(`saved ${outputFilePath}`)
                      }
                    }
                  }
                }
              )
            }

          } catch (e) {
            console.error(e)
          }
        }
      }

      if ( this.queueComplete() ) {
        break
      }

      // add a little pause
      await Util.sleep(1000)
    } 
  }
}