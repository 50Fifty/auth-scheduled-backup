import * as storage from "@google-cloud/storage";

export const saveOptions: storage.SaveOptions = {
  contentType: "application/json",
  metadata: {
    cacheControl: "no-cache",
  },
};