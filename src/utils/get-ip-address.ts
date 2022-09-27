import os from "os";

/**
 * 获取当前机器的ip地址
 */
export const getIPv4 = () => {
  const ifaces = os.networkInterfaces();
  if (!ifaces) return 'localhost';

  for (let dev in ifaces) {
    let iface = ifaces[dev];

    for (let i = 0; i < iface.length; i++) {
      let { family, address, internal } = iface[i];

      if (family === "IPv4" && address !== "127.0.0.1" && !internal) {
        return address;
      }
    }
  }
}
