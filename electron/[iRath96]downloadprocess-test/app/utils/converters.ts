
export const convertedToMegabyteString = (filesize: number | null): string => {
    let filesizeInMB: string = " file size unknown";
    if (filesize) {
    if (filesize > (1024*1024)) {
        filesizeInMB = String(Math.round(filesize/(1024*1024))) + "MB";
    } else {
        filesizeInMB = String(Number(filesize/(1024*1024)).toFixed(1)) + "MB";
    }
    }
    return filesizeInMB;
};