var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
class Compile {
    constructor(configPath) {
        const config = Promise.resolve().then(() => __importStar(require(configPath)));
        console.log(config);
    }
}
//# sourceMappingURL=Compile.js.map