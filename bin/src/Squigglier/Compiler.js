"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsdom_1 = require("jsdom");
const Sprite_1 = require("./Sprite/Sprite");
const SpriteAnimation_1 = require("./Sprite/SpriteAnimation");
const SpriteAnimations_1 = require("./Sprite/SpriteAnimations");
class Compiler {
    constructor(configPath) {
        this.files = [];
        this.configPath = configPath;
        try {
            const json = fs_1.default.readFileSync(configPath, 'utf8');
            this.config = JSON.parse(json);
            this.begin();
        }
        catch (e) {
            console.error(e);
            process.exit();
        }
    }
    begin() {
        if (!this.config.source) {
            console.error(`source missing in ${this.configPath}`);
            process.exit();
        }
        if (!this.config.output) {
            this.config.output = this.config.source;
        }
        if (!this.config.extensions) {
            this.config.extensions = ['.sprite'];
        }
        if (!Array.isArray(this.config.extensions)) {
            if (typeof this.config.extensions !== 'string' || this.config.extensions == '') {
                console.error(`invalid extensions in ${this.configPath}`);
                process.exit();
            }
            this.config.extensions = [this.config.extensions];
        }
        this.loadSource();
        this.processPending();
    }
    loadSource() {
        const basePath = path_1.default.join(path_1.default.dirname(this.configPath), this.config.source);
        try {
            const files = fs_1.default.readdirSync(basePath);
            files.forEach(fileName => {
                const fullPath = path_1.default.join(basePath, fileName);
                const fileExtension = path_1.default.extname(fileName);
                if (!this.config.extensions.includes(fileExtension)) {
                    return;
                }
                const stat = fs_1.default.statSync(fullPath);
                if (stat.isDirectory()) {
                    return;
                }
                this.files.push({
                    fileName,
                    fullPath,
                    fileExtension,
                    status: 'pending'
                });
            });
        }
        catch (e) {
            console.error(e);
            process.exit();
        }
    }
    processPending() {
        const nextFile = this.files.find(file => file.status === 'pending');
        this.processFile(nextFile);
    }
    processFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            while (file.status !== 'error' && file.status !== 'complete') {
                switch (file.status) {
                    case 'processing': {
                        yield this.onStatusChange(file, 'processing');
                        break;
                    }
                    case 'dependency': {
                        yield this.sleep(200);
                        break;
                    }
                    case 'pending': {
                        file.status = 'processing';
                        this.compile(file);
                        break;
                    }
                }
            }
        });
    }
    mapElementAttributes(element, attributes) {
        for (const name of element.getAttributeNames()) {
            attributes[name] = element.getAttribute(name);
        }
        const children = this.mapElementChildren(element);
        if (children && 'children' in attributes) {
            attributes.children = children;
        }
    }
    mapElementChildren(element) {
        const className = {
            'sprite': Sprite_1.Sprite,
            'animations': SpriteAnimation_1.SpriteAnimation
        }[element.tagName];
        if (!className) {
            return;
        }
        const childClass = className;
        const children = [];
        for (const child of element.children) {
            children.push(new childClass(child));
        }
        return children;
    }
    newEntity(element) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'sprite') {
            const attributes = { tagName, children: [] };
            this.mapElementAttributes(element, attributes);
            return new Sprite_1.Sprite(attributes);
        }
        if (tagName === 'animations') {
            console.log('here!');
            const attributes = { tagName, children: [] };
            this.mapElementAttributes(element, attributes);
            return new SpriteAnimations_1.SpriteAnimations(attributes);
        }
        if (tagName === 'animation') {
            const attributes = { tagName };
            this.mapElementAttributes(element, attributes);
            return new SpriteAnimation_1.SpriteAnimation(attributes);
        }
    }
    compile(file) {
        try {
            const src = fs_1.default.readFileSync(file.fullPath, 'utf8');
            const dom = new jsdom_1.JSDOM(src, {
                contentType: "image/svg+xml",
            });
            const entities = [];
            dom.window.document.querySelectorAll('sprite').forEach(element => {
                const entity = this.newEntity(element);
                entities.push(entity);
                // const children = []
                // for (const child of element.children) {
                //   const entity = this.newEntity(child)
                //   if (entity) {
                //     children.push(entity)
                //   }
                // }
            });
            console.log(JSON.stringify(entities, null, 4));
            file.status = 'complete';
        }
        catch (e) {
            console.error(e);
            file.status = 'error';
        }
    }
    onStatusChange(file, from) {
        return __awaiter(this, void 0, void 0, function* () {
            while (file.status === from) {
                yield this.sleep(100);
            }
            return true;
        });
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map