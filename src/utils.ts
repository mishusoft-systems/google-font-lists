// External dependencies
import fs from "node:fs";

export const loadJsonFile = (filePath: fs.PathOrFileDescriptor,
                             options: |
                                 {
                                     encoding: BufferEncoding;
                                     flag?: string | undefined;
                                 }
                                 | BufferEncoding
) => {
    try {
        const $fileContent = fs.readFileSync(filePath, options);
        if ($fileContent.length) {
            return JSON.parse($fileContent);
        }
    } catch (e: any) {
        throw Error(e);
    }
}

export const verifyPathOrCreate = (sourcePath: fs.PathLike | fs.PathOrFileDescriptor | any, createOptions: fs.MakeDirectoryOptions & {
    recursive: true
}) => {
    if (!fs.existsSync(sourcePath)) {
        fs.mkdirSync(sourcePath, createOptions)
    }
}

export const verifyPath = (sourcePath: fs.PathLike | fs.PathOrFileDescriptor | any) => {
    return fs.existsSync(sourcePath);
}


export const writeFile = (
    file: fs.PathLike | fs.PathOrFileDescriptor | any,
    data: string | NodeJS.ArrayBufferView,
    options?: fs.WriteFileOptions | undefined) => {
    // verify exists file and delete it if found.
    if (verifyPath(file)) {
        fs.unlinkSync(file);
    }

    // write data to the file.
    fs.writeFileSync(file, data, options)
}

export const createSingleObject = (data: []) => {
    if (data.length) {
        const result: any = {};
        [].forEach.call(data, (item: { label: string, data: string }) => {
            result[item.label] = item.data;
        });

        return result;

    }
    return data;
}