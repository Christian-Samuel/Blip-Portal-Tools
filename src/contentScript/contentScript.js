const AMBIENTE_PROD_ID = 'prodAux';
const AMBIENTE_HMG_ID = 'hmgAux';
const AMBIENTE_DEV_ID = 'devAux';

const DISPLAY_BLOCK = 'block';
const DISPLAY_NONE = 'none'

const REGEX_URL = new RegExp("https:\/\/.*.blip.ai\/application$");
const REGEX_HMG = new RegExp(/(hmg)|(hml)|(homologa[cç][aã]o)|(homo[lg])|(homolg)|(homolog)/i);
const REGEX_DEV = new RegExp(/(dev)|(desenvolver)|(develop)|(devs)|(deve)|(beta)/i);

var devInputTag;
var hmgInputTag;

function showHideBots()
{
    var bots = document.querySelectorAll("contact>div>ng-include>a");

    if(bots != undefined && bots != null)
    {
      bots.forEach(bot => {
        let botAtual = bot.parentElement.parentElement.parentElement;
        let botRoteador = bot.children[0].children[0].children[2];
        let botAtualNome = bot.children[0].children[0].children[1].innerText;
  
        coloringRouter(botRoteador)
  
        if(getVerifyBot(REGEX_HMG,hmgInputTag.value,botAtualNome))
        {
          showHide(AMBIENTE_HMG_ID,botAtual)
        }
        else
        {
          if(getVerifyBot(REGEX_DEV,devInputTag.value,botAtualNome))
          {          
            showHide(AMBIENTE_DEV_ID,botAtual)
          }
          else
          {          
            showHide(AMBIENTE_PROD_ID,botAtual)
          }
        }
      });
    }
    else
    {
      console.log("Visão de contrato ainda não configurada");
    }    
}

function showHide(ambiente,botAtual)
{
  let checkBox = document.getElementById(ambiente);
  botAtual.style.display = checkBox.checked ? DISPLAY_BLOCK : DISPLAY_NONE;
}

function getVerifyBot(regex,tag,botName)
{
  if(tag == "")
  {
    return regex.test(botName); 
  }
  else
  {
    return botName.indexOf(tag) != -1; 
  }
}

function coloringRouter(bot)
{
  if(bot.innerText == 'Roteador' || bot.innerText == 'Router')
  {
    bot.parentElement.style.backgroundColor = "rgb(233 247 248)";
  }
}

  
function htmlInject()
{
  if(REGEX_URL.test(document.location.href))
  {
    if(document.getElementById('container') == null )
    {
      var element = document.querySelectorAll("div.move-bots-button-container>div");
      var perfilStatus;

      if(element.length == 0)
      {
        element = document.querySelectorAll("div.move-bots-button-container");

        if(element.length == 0)
        {
          element = document.querySelectorAll("div#applications");

          if(element.length == 0)
          {
            console.log("Visão de contrato ainda não configurada");
            return;
          }
          else
          {
            perfilStatus = element[0].children[0];
          }
        }
      }

      var newElement = document.createElement("div");
      newElement.setAttribute("id", "container");
      newElement.setAttribute("style", "display: flex; margin: 10px");
      newElement.innerHTML =
       `<bds-paper elevation="static" style="display: flex;justify-content: flex-end;" >          
          <bds-icon style="margin: auto 10px;" name="filter" theme="outline" aria-label="seta para a direita" ></bds-icon>

          <bds-checkbox style="margin: auto 10px;" id="prod" class="ambiente" label="Produção" name="prod" disabled="false" checked="true"></bds-checkbox>
          <input checked="true" type="checkbox" id="prodAux" name="prod" value="Producao" style="display :none" >

          <bds-checkbox style="margin: auto 10px;" id="hmg" class="ambiente" label="Homologação" name="hmg" disabled="false" checked="true"></bds-checkbox>
          <input checked="true" type="checkbox" id="hmgAux" name="hmg" value="Homologacao" style="display :none">

          <bds-checkbox style="margin: auto 10px;" id="dev" class="ambiente" label="Desenvolvimento" name="dev" disabled="false" checked="true"></bds-checkbox>
          <input checked="true" type="checkbox" id="devAux" name="dev" value="Desenvolvimento" style="display :none">

          <bds-tooltip style="margin: auto 10px;" position="left-center" tooltip-text="Configurar Tags">
            <bds-button-icon id="configButton" size="xxx-small" variant="secondary" icon="edit"></bds-button-icon>
          </bds-tooltip>

          <input type="text" placeholder="Tag Homologação" id="hmgInputTag" style="display: none; margin: 2px 10px;">
          <input type="text" placeholder="Tag Desenvolvimento" id="devInputTag" style="display: none; margin: 2px 10px;">
        </bds-paper>`;
      
      if(perfilStatus != null)
      {
        element[0].insertBefore(newElement,perfilStatus);
        perfilStatus = null;
      }
      else
      {
        element[0].appendChild(newElement);
      }

      let contract = getContract();

      chrome.storage.sync.get([contract], function(tags) {      
        document.getElementById("configButton").addEventListener('click', onShowHideInputs);

        document.getElementById("prod").addEventListener('bdsChange', () => {let prodAux = document.getElementById('prodAux'); prodAux.checked = !prodAux.checked; showHideBots(); });
        document.getElementById("hmg").addEventListener('bdsChange',  () => {let hmgAux = document.getElementById('hmgAux'); hmgAux.checked = !hmgAux.checked; showHideBots(); });
        document.getElementById("dev").addEventListener('bdsChange', () => {let devAux = document.getElementById('devAux'); devAux.checked = !devAux.checked; showHideBots(); });

        devInputTag = document.getElementById("devInputTag");
        hmgInputTag = document.getElementById("hmgInputTag");

        devInputTag.addEventListener('blur', onSetTags);
        hmgInputTag.addEventListener('blur', onSetTags);

        if(tags.dev != undefined)
        {
          devInputTag.value = tags[contract].dev;
          hmgInputTag.value = tags[contract].hmg;
        }
      });
    }
  }
}

function onShowHideInputs()
{
  devInputTag.style.display = devInputTag.style.display == "none" ? DISPLAY_BLOCK : DISPLAY_NONE;
  hmgInputTag.style.display = hmgInputTag.style.display == "none" ? DISPLAY_BLOCK : DISPLAY_NONE;
}

function getContract()
{
  return document.location.href.replace(".blip.ai/application","").replace("https://","");
}

function onSetTags()
{
  let contrato = getContract();

    let tags = {
          dev: devInputTag.value,
          hmg: hmgInputTag.value
        }
  
    chrome.storage.sync.set({[contrato] : tags}, function() { console.log(contrato) });
}

function inicializarTimer()
{
  console.log("Iniciado");
  setInterval(htmlInject, 2000);
}

setTimeout(inicializarTimer, 3000);