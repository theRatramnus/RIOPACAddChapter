import axios from 'axios';
import cheerio from 'cheerio';
import {XMLParser} from 'fast-xml-parser';
import { constants } from 'node:buffer';
import { it } from 'node:test';


const mergeDicts = (x: Record<string, any>, y: Record<string, any>): Record<string, any> => {
    return { ...x, ...y };
};

const replaceSpacesWithPlus = (inputString: string): string => {
    return inputString.replace(/ /g, "+");
};

const fetchItemInfo = async (link: string) => {
    ztoolkit.log("fetch item")
    const request: XMLHttpRequest = await Zotero.HTTP.request('GET', link);
    if (request.status !== 200) {
        return 'Failed to fetch data from the link';
    }
    ztoolkit.log("response: " + (request.response))
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(request.response as string, "text/xml");
    return xmlDoc;
};

const getBookId = async (link: string): Promise<string> => {
    ztoolkit.log("get book id")
    const request = await Zotero.HTTP.request('GET', link);
    const html = request.response as string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elementsWithClass = doc.querySelectorAll('.linktitel');
    const hrefValue = elementsWithClass[0].getAttribute('href');
    const pkValue = hrefValue!.match(/pk=(\d+)/)![1];
    return pkValue;
};

const fetchBookLink = async (bookTitle: string): Promise<string> => {
    const anzeigeUrl = "http://opac.regesta-imperii.de/lang_de/anzeige.php?sammelwerk=" + replaceSpacesWithPlus(bookTitle);
    const opacId = await getBookId(anzeigeUrl);
    return "http://opac.regesta-imperii.de/api/oai?verb=GetRecord&metadataPrefix=oai_marc&identifier=" + opacId;
};

function findContent(doc: XMLDocument, tag: string, code: string): string {
    const namespaces = {
        marc: "http://www.loc.gov/MARC21/slim"
    };
    
    const datafields = Array.from(doc.getElementsByTagNameNS(namespaces.marc, "datafield"));
    for (const datafield of datafields) {
        if (datafield.getAttribute('tag') === tag) {
            const subfields = Array.from(datafield.getElementsByTagNameNS(namespaces.marc, "subfield"));
            for (const subfield of subfields) {
                if (subfield.getAttribute('code') === code) {
                    return subfield.textContent || '';
                }
            }
        }
    }
    return '';
}

function extractChapterInfo(xmlDocument: Document): Record<string, any> {
    return {
        "bookTitle": findContent(xmlDocument, '773', 't').trim(),
    };
}



// Extract book info and the rest of the code remains largely similar to `extractChapterInfo`.

function extractBookInfo(xmlDocument: Document): Record<string, any> {


    const editorsString = findContent(xmlDocument, '700', 'a')
    const editors = editorsString.split("; ")

    const creators = editors.map((editor) => {
        const split = editor.split(", ")
        return {firstName: split[1], lastName: split[0], creatorType: "editor"}
     })



    return {
        "place": findContent(xmlDocument,'264', 'a').trim() ?? "",
        "series": findContent(xmlDocument, '490', 'a').split(" / ")[0].trim() ?? "",
        "volume": findContent(xmlDocument, '490', 'a').split(" / ")[1]?.trim() ?? "",
        "url": findContent(xmlDocument, '502', 'a').trim() ?? "",
        "editors": creators ?? ""
    };
}



export async function getChapterData(opacid: string) : Promise<Record<string, any>> {
    const chapterURL = "http://opac.regesta-imperii.de/api/oai?verb=GetRecord&metadataPrefix=oai_marc&identifier=" + opacid;

    const chapterRoot = await fetchItemInfo(chapterURL) as XMLDocument;
    ztoolkit.log(chapterRoot)

    //ztoolkit.log(findContent(chapterRoot, '773', 't').trim())

    const chapterInfo = extractChapterInfo(chapterRoot as XMLDocument);
    ztoolkit.log(chapterInfo);

    const bookLink = await fetchBookLink(chapterInfo["bookTitle"])
    ztoolkit.log(bookLink)
    const bookRoot = await fetchItemInfo(bookLink)
    ztoolkit.log(bookRoot)
    const bookInfo = extractBookInfo(bookRoot as XMLDocument)
    ztoolkit.log(bookInfo)

    const item = mergeDicts(chapterInfo, bookInfo);
    ztoolkit.log("sent item:")
    ztoolkit.log(item)

    return item
}