const BUILDER_PATH = "templates/builder/"
const CONFIG_PATH = "configurations/basic";

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    id:"1",
    title: "Builder",
    documentUrlPatterns:['http://*.blip.ai/application', 'https://*.blip.ai/application'],
    targetUrlPatterns:['https://*/application/detail/*/home','http://*/application/detail/*/home'],
    contexts:["link"],
   });

chrome.contextMenus.create({
    id:"2",
    title: "Configurações",
    documentUrlPatterns:['http://*.blip.ai/application', 'https://*.blip.ai/application'],
    targetUrlPatterns:['https://*/application/detail/*/home','http://*/application/detail/*/home'],
    contexts:["link"],
   });  

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab) {
        if (info.menuItemId === "1"){
            openNewPage(info.linkUrl,BUILDER_PATH);
        }
        if (info.menuItemId === "2"){
            openNewPage(info.linkUrl,CONFIG_PATH);
        }
    }
});

function openNewPage(urlParty, path)
{
    fullUrl = urlParty.replace("home",path);

    chrome.tabs.create({  
        url: fullUrl
      });
}