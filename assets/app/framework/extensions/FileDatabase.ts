import Dexie from "dexie";

export const FileDB = new Dexie("FileDB");

FileDB.version(1).stores({
    file: "++id, &path",
});