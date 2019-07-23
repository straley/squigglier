
export const stringLitArray = <L extends string>(arr: L[]) => arr

export class Util {
  static async sleep(ms:number) {
    // pause a number of seconds (with await)
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}