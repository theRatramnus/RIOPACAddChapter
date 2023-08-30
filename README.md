# RIOPACAddChapter
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)
## Use case
Zotero plugin that eliminates the tedious task of adding the book information separately when adding a chapter from the RI OPAC.
The plugin just automatically adds the info for any new chapters being added from the RI OPAC using Zotero Connector.
It also
- fixes common mistakes in the title and creators (on by default)
- and deletes the attachment after the download (off by default). You can find these options in the plugin's preference pane.
- allows you to fetch the publisher using the Google Books API. This however is not perfect and a bit more involved to set up. Instructions on how to set up can be found [here](https://github.com/theRatramnus/RIOPACAddChapter/blob/main/HOWTOUSEBOOKSAPI.md). It's turned off by default.

## Install
You can download this plugin for free on the [releases page](https://github.com/theRatramnus/RIOPACAddChapter/releases). Only the `.xip`-file needs to be downloaded. Instructions on how to install the `.xip`-file can be found [here](https://www.zotero.org/support/plugins). Sadly, the plugin is only supported by Zotero 7 right now, which is still in beta. You can download it [here](https://www.zotero.org/support/beta_builds). Make sure you have the setting Preferences > General > Automatically take snapshots when creating items from web pages enabled, otherwise the plugin will not function properly.

## Contribute
If you should encounter any bugs, feel free open an issue. Any other forms of contribution are welcome, too - of course.

## Credits
This plugin wouldn't have been possible without the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template). Thank you so much, @windingwind!
