import createQqwry, { ipToInt, intToIP, ipEndianChange } from "./driver";
import { createIpdb } from "./ipdb-driver";
import type { QqwryCallable, IpdbCallable, IpdbOptions } from "./types";

/**
 * lib-qqwry
 * 纯真IP库(qqwry.dat) Node.js 解析引擎
 */

const libqqwry = Object.assign(
  (dataPath: string, speed?: boolean): QqwryCallable =>
    createQqwry(dataPath, speed),
  {
    ipToInt,
    intToIP,
    ipEndianChange,
    ipdb(dataPath: string, options?: IpdbOptions): IpdbCallable {
      return createIpdb(dataPath, options);
    },
    init(dataPath: string, speed?: boolean): QqwryCallable {
      return createQqwry(dataPath, speed);
    },
  },
);

export default libqqwry;
