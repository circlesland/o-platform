import UAParser from "ua-parser-js";

export function isMobile() {
    const uaParser = new UAParser();
    const detectedDevice = uaParser.getDevice();
    return detectedDevice && detectedDevice.type == "mobile";
}