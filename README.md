# RIOPACAddChapter - DEPRECATED! Alternative exists, read below :)

> [!Important]
> RI Opac is no longer reachable through headless browsers. This means that Zotero cannot request the additional information needed on its own.
> The alternative is to use your browser to load the information needed and add the items to Zotero manually.
>
> This is what my Chrome extension (https://github.com/theRatramnus/riopac-add-chapter-chrome) does.
> As an added bonus this allows for a better user experience, you can now add multiple titles without ever leaving your search page :)
>
> <img width="942" height="517" alt="Bildschirmfoto 2026-10-31 um 18 32 16" src="https://github.com/user-attachments/assets/6231097e-a020-4c81-9a31-3f7fc9c06ba8" />


[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)
## Use case
Zotero plugin that eliminates the tedious task of adding the book information separately when adding a chapter from the RI OPAC.
The plugin just automatically adds the info for any new chapters being added from the RI OPAC using Zotero Connector.
####
It also 
- fixes common mistakes in the title and creators (on by default).
- deletes the attachment after the download (off by default).
- allows you to fetch the publisher using the Google Books API. This however is not perfect and a bit more involved to set up. Instructions on how to set it up can be found [here](https://github.com/theRatramnus/RIOPACAddChapter/blob/main/HOWTOUSEBOOKSAPI.md) (off by default).
####
You can find these options in the plugin's preference pane.

## Install
You can download this plugin for free on the [releases page](https://github.com/theRatramnus/RIOPACAddChapter/releases). Only the `.xpi`-file needs to be downloaded. Instructions on how to install the `.xpi`-file can be found [here](https://www.zotero.org/support/plugins). Sadly, the plugin is only supported by Zotero 7 right now, which is still in beta. You can download it [here](https://www.zotero.org/support/beta_builds). Make sure you have the setting Preferences > General > Automatically take snapshots when creating items from web pages enabled, otherwise the plugin will not function properly.

## Support
If this plugin proves to be helpful, why don't you 

<a href='https://ko-fi.com/P5P2Y9CL5' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

Thanks :)

## Contribute
If you should encounter any bugs, feel free open an issue. Any other forms of contribution are welcome, too - of course.

## Credits
This plugin wouldn't have been possible without the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template). Thank you so much, @windingwind!
####
Also thank you for the publisher fetching feature request, @jbwaagmeester!
