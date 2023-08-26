import {
  BasicExampleFactory,
  HelperExampleFactory,
  KeyExampleFactory,
  PromptExampleFactory,
  UIExampleFactory,
} from "./modules/examples";
import { config } from "../package.json";
import { getPref } from "./utils/prefs";
import { getString, initLocale } from "./utils/locale";
import { registerPrefsScripts } from "./modules/preferenceScript";
import { createZToolkit } from "./utils/ztoolkit";
import { it } from "node:test";
import * as ParseChapter from  "./parsechapter"
import { openAsBlob } from "node:fs";
import * as Typography from "./typgraphy"
import { first } from "cheerio/lib/api/traversing";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);
  initLocale();

  BasicExampleFactory.registerPrefs();

  BasicExampleFactory.registerNotifier();

  await onMainWindowLoad(window);
}

async function onMainWindowLoad(win: Window): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit();
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
  // Remove addon object
  addon.data.alive = false;
  delete Zotero[config.addonInstance];
}

/**
 * This function is just an example of dispatcher for Notify events.
 * Any operations should be placed in a function to keep this funcion clear.
 */
async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  // You can add your code to the corresponding notify type
  if(event == "add"){

    onAdd(ids[0] as number);
  }

  ztoolkit.log("notify", event, type, ids, extraData);
  if (
    event == "select" &&
    type == "tab" &&
    extraData[ids[0]].type == "reader"
  ) {
    BasicExampleFactory.exampleNotifierCallback();
  } else {
    return;
  }
}


export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify
};


function onAdd(id: number){
  ztoolkit.log("item added - id = " + id)

  const item = Zotero.Items.get(id)
  const title = item.getDisplayTitle()

  ztoolkit.log(title)

  if(title == "RI OPAC"){
    const chapterID = id - 1 // the chapter's id is one less than the attachment's id
    const chapter = Zotero.Items.get(chapterID)


    if(chapter.itemType == "bookSection"){
      ztoolkit.log("chapter: " + chapter.getDisplayTitle())
      processChapter(chapter, item.getField("url") as string)
      if(getPref("deleteAttachments") as boolean){
        ztoolkit.log("deleting attachments")
        item.deleted = true
        item.saveTx()
      }
    } else {
      ztoolkit.log("not a chapter")
    }

    const isFixingTypography = getPref("enhancedTypography") as boolean

    if(isFixingTypography){
      item.setField("title", Typography.fixTitle(title))
      item.saveTx()
    }
  }
}

async function processChapter(chapter: Zotero.Item, url: string){
  ztoolkit.log("parsing chapter")
  
  const OPACID = getPKValue(url);

  const data = await ParseChapter.getChapterData(OPACID)
  ztoolkit.log("recieved item:")
  ztoolkit.log(data)

  ztoolkit.log(Object.keys(data))

  const isFixingTypography = getPref("enhancedTypography") as boolean

  Object.keys(data).forEach((field, idx, arr) => {
    if(field == "editors"){
      ztoolkit.log("trying to add editors")
      const authors = chapter.getCreators().map((creator) => {
        if(isFixingTypography){
          return {
            firstName: Typography.removeParenthesesContent(creator.firstName!),
            lastName: creator.lastName,
            creatorType: "author"
         }
        }
        return creator
      })
      const editors = (data["editors"] as Zotero.Item.Creator[]).map((creator) => {
        if(isFixingTypography){
          return {
            firstName: Typography.removeParenthesesContent(creator.firstName!),
            lastName: creator.lastName,
            creatorType: "editor"
         }
        }
        return creator
      })
      const creators = authors.concat(editors)
      chapter.setCreators(creators)
    } else {
      ztoolkit.log("trying to add " + field)
      chapter.setField(field as Zotero.Item.ItemField, data[field] as string)
    }
  })




  ztoolkit.log("finished updating fields, now saving") 
  chapter.saveTx()
  ztoolkit.log("saved")
}

function getPKValue(url: string){
  return url.match(/pk=(\d+)/)![1]; //no idea how to do null checks :)
}

