import { getPref } from "./utils/prefs";
import { config } from "../package.json";
function extractFirstPublisher(jsonString: string): string | null {
    try {
      // Parse the JSON string into an object
      const parsedJson = JSON.parse(jsonString);
        ztoolkit.log(parsedJson.volumeInfo)
        ztoolkit.log(parsedJson.volumeInfo.publisher)
      // Check if "items" and "volumeInfo" and "publisher" exist
      if (parsedJson.volumeInfo &&
          parsedJson.volumeInfo.publisher) {
  
        // Return the publisher of the first result
        return parsedJson.volumeInfo.publisher;
      } else {
        ztoolkit.log("json format incorrect")
      }
    } catch (e) {
      ztoolkit.log('An error occurred:', e);
    }
  
    return null;
  }


function extractSelfLink(jsonString: string): string | null {
    try {
        // Parse the JSON string into an object
        const parsedJson = JSON.parse(jsonString);
    
        // Check if "selfLink" exists
        if (parsedJson.items && parsedJson.items.length > 0 &&
            parsedJson.items[0].selfLink) {
    
          // Return the publisher of the first result
          return parsedJson.items[0].selfLink;
        } else {
          ztoolkit.log("json format incorrect")
        }
      } catch (e) {
        ztoolkit.log('An error occurred:', e);
      }
    
      return null;
    }


    async function fetchSelfLink(bookTitle: string): Promise<string | null>{
        ztoolkit.log("fetiching publisher")
        const title = bookTitle
        ztoolkit.log(title)
        const link = "https://www.googleapis.com/books/v1/volumes?q=intitle:" + title + "&key=" + getPref("input")
        //ztoolkit.log(link)
        const request = await Zotero.HTTP.request('GET', link)
        ztoolkit.log(request)
        if (request.status !== 200) {
        return 'Failed to fetch data from the link';
        }
        ztoolkit.log("response:")
        ztoolkit.log(request.response)
        return extractSelfLink(request.response) 
}


export async function fetchPublisher(bookTitle: string): Promise<string | null>{
    
    if(getPref("fetchPublisher")){
    const link = await fetchSelfLink(bookTitle)
    const request = await Zotero.HTTP.request('GET', link!)
    ztoolkit.log(request)
    if (request.status !== 200) {
    return 'Failed to fetch data from the link';
    }
    ztoolkit.log("response:")
    ztoolkit.log(request.response)
    const publisher = extractFirstPublisher(request.response as string) ?? ""
    ztoolkit.log(publisher)
    return publisher
    }
    ztoolkit.log("publisher fetching not enabled")
    return ""
}