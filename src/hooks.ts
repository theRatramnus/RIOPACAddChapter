import {
  BasicExampleFactory,
  HelperExampleFactory,
  KeyExampleFactory,
  PromptExampleFactory,
  UIExampleFactory,
} from "./modules/examples";
import { config } from "../package.json";
import { getString, initLocale } from "./utils/locale";
import { registerPrefsScripts } from "./modules/preferenceScript";
import { createZToolkit } from "./utils/ztoolkit";
import { it } from "node:test";
import * as ParseChapter from  "./parsechapter"
import { openAsBlob } from "node:fs";

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

  await ParseChapter.getChapterData("2932321");

  const popupWin = new ztoolkit.ProgressWindow(config.addonName, {
    closeOnClick: true,
    closeTime: -1,
  })
    .createLine({
      text: getString("startup-begin"),
      type: "default",
      progress: 0,
    })
    .show();

  KeyExampleFactory.registerShortcuts();

  await Zotero.Promise.delay(1000);
  popupWin.changeLine({
    progress: 30,
    text: `[30%] ${getString("startup-begin")}`,
  });

  UIExampleFactory.registerStyleSheet();

  UIExampleFactory.registerRightClickMenuItem();

  UIExampleFactory.registerRightClickMenuPopup();

  UIExampleFactory.registerWindowMenuWithSeparator();

  await UIExampleFactory.registerExtraColumn();

  await UIExampleFactory.registerExtraColumnWithCustomCell();

  await UIExampleFactory.registerCustomCellRenderer();

  await UIExampleFactory.registerCustomItemBoxRow();

  UIExampleFactory.registerLibraryTabPanel();

  await UIExampleFactory.registerReaderTabPanel();

  PromptExampleFactory.registerNormalCommandExample();

  PromptExampleFactory.registerAnonymousCommandExample();

  PromptExampleFactory.registerConditionalCommandExample();

  await Zotero.Promise.delay(1000);

  popupWin.changeLine({
    progress: 100,
    text: `[100%] ${getString("startup-finish")}`,
  });
  popupWin.startCloseTimer(5000);

  addon.hooks.onDialogEvents("dialogExample");
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

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case "load":
      registerPrefsScripts(data.window);
      break;
    default:
      return;
  }
}

function onShortcuts(type: string) {
  switch (type) {
    case "larger":
      KeyExampleFactory.exampleShortcutLargerCallback();
      break;
    case "smaller":
      KeyExampleFactory.exampleShortcutSmallerCallback();
      break;
    case "confliction":
      KeyExampleFactory.exampleShortcutConflictingCallback();
      break;
    default:
      break;
  }
}

function onDialogEvents(type: string) {
  switch (type) {
    case "dialogExample":
      HelperExampleFactory.dialogExample();
      break;
    case "clipboardExample":
      HelperExampleFactory.clipboardExample();
      break;
    case "filePickerExample":
      HelperExampleFactory.filePickerExample();
      break;
    case "progressWindowExample":
      HelperExampleFactory.progressWindowExample();
      break;
    case "vtableExample":
      HelperExampleFactory.vtableExample();
      break;
    default:
      break;
  }
}

// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintian.

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify,
  onPrefsEvent,
  onShortcuts,
  onDialogEvents,
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
    } else {
      ztoolkit.log("not a chapter")
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

  Object.keys(data).forEach((field, idx, arr) => {
    if(field == "editors"){
      ztoolkit.log("trying to add editors")
      const authors = chapter.getCreators()
      const creators = (data["editors"] as Zotero.Item.Creator[]).concat(authors)
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

