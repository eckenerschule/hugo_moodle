var api_ip = 'chatbot.aerotune.com';
addEventListener("DOMContentLoaded", (event) => {
  const bot = new EckernerBot();
});
// Klick-Ereignis zum Öffnen/Schließen des Dropdowns

class EckernerBot {

 /**
   * 
   * @summary Constructor der EckenerBot Class
   */
 constructor() {
  this.historyEndpoint = 'https://' + api_ip + '/get_history_headlines';
  this.detailedHistoryEndpoint ='https://' + api_ip + '/get_history_data';
  this.historyResponse;
  this.historyAmount = 5;
  this.hisDetailedId;
  this.firstChat;
  this.activeDiv;
  this.initializeChat();
  this.imageTag;
}

/**
   * 
   * @summary Initialisiert den Chat-Bot
  */
initializeChat() {
  // API-Endpunkt und Ihr API-Schlüssel
  this.initError();
   this.initializeEvents();
   console.log('Histories Initialize');
   this.getHistories();
 }

/**
   * 
   * @summary Zeigt "Fehlernachricht" bei fehlerhafter Verbindung und blendet leere Container aus. Aufruf beim initialisieren.
  */
initError(){
  let detailedTopDiv = document.getElementById("details-list");
  detailedTopDiv.style.display ="none";
  let detailedBotDiv = document.getElementById("details-content");
  detailedBotDiv.style.display ="none";
  let submitDiv = document.getElementById("fertigstellen-container");
  submitDiv.style.display ="none";
  let detailedContainer = document.getElementById('chat-details-container');
  let infoDiv = document.createElement("div");
  infoDiv.id ="info-div";
  infoDiv.textContent ="Verbindung konnte nicht hergestellt werden. Bitte Seite neuladen."
  infoDiv.style.display ="flex";
  infoDiv.style.justifyContent ="center";
  infoDiv.style.alignItems ="center"
  detailedContainer.appendChild(infoDiv);
}

/**
   * 
   * @summary Blendet leere Container aus. Aufruf bei fehlerhaftem Fetch.
  */
initDisplay(){
  let detailedTopDiv = document.getElementById("details-list");
  detailedTopDiv.style.display ="none";
  let detailedBotDiv = document.getElementById("details-content");
  detailedBotDiv.style.display ="none";
  let submitDiv = document.getElementById("fertigstellen-container");
  submitDiv.style.display ="none";
}

/**
   * 
   * @summary Blendet Container wieder ein, sofern mindestens 1 Object existiert.
  */
initSucces(){
  let detailedTopDiv = document.getElementById("details-list");
  detailedTopDiv.style.display = "flex";
  let detailedContainer = document.getElementById('chat-details-container');
  detailedContainer.style.display = "block";
  let detailedBotDiv = document.getElementById("details-content");
  detailedBotDiv.style.display ="block";
  let submitDiv = document.getElementById("fertigstellen-container");
  submitDiv.style.display ="block";
  let infoDiv = document.getElementById("info-div");
  this.historyResponse.forEach(node =>{
    if(node.description.length > 0 ){
      infoDiv.style.display ="none";
    }
  });
}

/**
   * 
   * @summary Erzeugt die divs für die History List
  */
initHeadlines(){
  const wrapperHis = document.getElementById("history-list");
  const helper = new Helper();
    this.historyResponse.forEach(node => {
      const hisId = node._id;
      const hisDesc = node.description;
      const hisDate = node.date;
      this.firstChat = document.getElementsByClassName("node-container");
      if(hisDesc){       
        const singleHisContainer = document.createElement('div');
        const singleHisContainer_one = document.createElement('div');
        const singleHisContainer_two = document.createElement('div');
        singleHisContainer.className ="node-container";
        singleHisContainer.id = hisId;
        singleHisContainer_one.textContent = hisDesc;
        singleHisContainer_one.className = "desc";
        singleHisContainer_two.textContent = hisDate;
        singleHisContainer_two.className ="date";
        wrapperHis.appendChild(singleHisContainer);
        singleHisContainer.appendChild(singleHisContainer_one);
        singleHisContainer.appendChild(singleHisContainer_two);
        
        
        singleHisContainer.addEventListener("click", function(event){
          helper.getDetailedHistories(singleHisContainer.id);
        });
        
      }
    });
    
    let activeDivCollection = document.getElementsByClassName("active");
    let activeDivArray = Array.from(activeDivCollection);
    activeDivArray.forEach(node => {
      node.classList.remove("active");
    });
    
    this.firstChat[0].classList.add("active");
    helper.getDetailedHistories(this.firstChat[0].id);
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.innerHTML = "Mehr laden";
    loadMoreBtn.type = "submit";
    loadMoreBtn.name = "load-more-btn";
    loadMoreBtn.className="load-more-btn";
    const leftListContainer = document.getElementById("chat-list-container");
    leftListContainer.appendChild(loadMoreBtn);
    loadMoreBtn.addEventListener('click', (event) => {
      loadMoreBtn.remove();
      this.getHistories();
    });
}

/**
   * 
   * @summary Bekommt X Chathistories mit ID, Name und Datum
   */
async getHistories() {
  try {
    const response = await fetch(this.historyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 5,
      }),
    });
    this.historyResponse = await response.json();
    const decoder = new TextDecoder("utf-8");
    console.log("History-Load-More-Button:")
    console.log(this.historyResponse);
    this.initSucces();
    this.initHeadlines();
  } catch (error) {
    console.error('Fehler:', error);
    this.initDisplay();
  }
}

/**
   * 
   * @summary Initialisiert Events
   */
initializeEvents() {
  let close_ele = document.getElementById("close_confirm_box");
  if (typeof(close_ele) != 'undefined' && close_ele != null)
  {
    close_ele.addEventListener('click', (event) => {
      this.cancelConfirmBox();
    });
  }

  let open_ele = document.getElementById("open_confirm_box");
  if (typeof(open_ele) != 'undefined' && open_ele != null)
  {
    open_ele.addEventListener('click', (event) => {
      var confirmBox = document.getElementById("confirmBox");
      confirmBox.style.display = "block";
    });
  }

  let confirm_close_ele = document.getElementById("confirm_close_chat_btn");
  if (typeof(confirm_close_ele) != 'undefined' && confirm_close_ele != null)
  {
    confirm_close_ele.addEventListener('click', (event) => {
      open(location, '_self').close();
    });
  }

  let cancel_confirm_ele = document.getElementById("cancel_confirm_box_btn");
  if (typeof(cancel_confirm_ele) != 'undefined' && cancel_confirm_ele != null)
  {
    cancel_confirm_ele.addEventListener('click', (event) => {
      this.cancelConfirmBox();
    });
  }

  let loadMore = document.getElementById("load-more-btn");
  if (typeof(loadMore) != 'undefined' && loadMore != null)
  {
    loadMore.addEventListener('click', (event) => {
      this.getHistories();
    });
  }


} 
/**
   * 
   * @summary Schließt die Confirm Box 
   */
cancelConfirmBox() {
  let confirmBox = document.getElementById("confirmBox");
  confirmBox.style.display = "none";
}
}

class Helper {
  /**
   * 
   * @summary Constructor der Helper Class
   */
    constructor() {
      this.detailedHistoryEndpoint ='https://' + api_ip + '/get_history_data';
      this.historyDetailedResponse;
      this.date;
    }

  /**
   * 
   * @summary Bekommt gesamten Chatverlauf für die angegegebene SessionID
   */
  async getDetailedHistories(input) {
    try {
      const response = await fetch(this.detailedHistoryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history_id: input,
        }),
      });
      this.historyDetailedResponse = await response.json();
      console.log("History-DETAILS:");
      console.log(this.historyDetailedResponse);
      console.log("History-Details:")
      console.log(this.historyDetailedResponse.messages);
      this.initDetails(this.historyDetailedResponse.date,this.historyDetailedResponse.description,this.historyDetailedResponse.subjects,this.historyDetailedResponse.messages,this.historyDetailedResponse.start_message,this.historyDetailedResponse._id);
      this.swapActive(input);
      this.countTags(this.historyDetailedResponse.messages);
      return this.historyDetailedResponse;
    } catch (error) {
      console.error('Fehler:', error);
    } 
  } 

  /**
   * 
   * @summary Erzeugt das richtige Tag für jede Message
  */
  createTagIcon(input){
    const imgSrcArray = ["circle-check.svg","circle-exclam.svg","circle-question.svg"];
    if(input == "reviewed"){
      return imgSrcArray[0];
    }else if(input == "marked_for_review"){
      return imgSrcArray[1];
    }else{
      return imgSrcArray[2];
    }
  }
  /**
   * 
   * @summary Zählt die Tags für die Detailübersicht
   */
  countTags(input){
    let checkValue = 0;
    let markedValue = 0;
    let neutralValue = 0;
    let checkDiv = document.getElementById("reviewed_value");
    let neutralDiv = document.getElementById("neutral_value");
    let markedDiv = document.getElementById("marked_value");
    for(let i = 0; i < input.length; i++){
      if(input[i].tag == "reviewed"){
        checkValue++;
      }else if(input[i].tag == "marked_for_review"){
        markedValue++;
      }else if(input[i].tag =="neutral"){
        neutralValue++;
      }
    }
    checkDiv.textContent = checkValue;
    markedDiv.textContent = markedValue;
    neutralDiv.textContent = neutralValue;
    return [checkValue, markedValue, neutralValue];
  }
   /**
   * 
   * @summary Erzeugt den gesamten Chatverlauf für die ausgewählte SessionID
   */
  initDetails(date, message, tag, messages, start_message, id){
    const helperhelper = new HelperHelper();
    let dates = document.getElementById("details-dates");
    let headline = document.getElementById("details-message");
    let subject = document.getElementById("details-subjects");
    dates.textContent = date;
    headline.textContent = message;
    subject.textContent = "Fachrichtungen: " + tag;
    let finishChat = document.getElementById("submit-history");
    finishChat.style.display ="flex";
    const startDiv = document.getElementById("start_content");
    startDiv.textContent = start_message;

    const contentDiv = document.getElementById("details-wrapper-end");
     while(contentDiv.firstChild){
       contentDiv.removeChild(contentDiv.lastChild);
     }
    let index = 0;
    messages.forEach(node => {
    
    const containerDiv = document.createElement('div');
    containerDiv.className ="message-container";
    contentDiv.appendChild(containerDiv);
    const questionContainer = document.createElement('div');
    questionContainer.className="question-container";
    const questionAuthor = document.createElement('div');
    questionAuthor.className="question-author";
    questionAuthor.textContent = "Schüler*in"
    const questionContent = document.createElement('div');
    questionContent.className="question-content";
    questionContent.textContent = node.message;
    const tagContainer = document.createElement('div');
    tagContainer.className ="tag-container";
    const tagImg = document.createElement('img');
    tagImg.className ="tag-img";
    tagImg.src ="/local/hugo/assets/media/" + this.createTagIcon(node.tag);
    const buttonContainer = document.createElement('div');
    buttonContainer.className ="button-container";
    const sourceButton = document.createElement('img');
    sourceButton.src ="/local/hugo/assets/media/info-solid.svg";
    const sourceButtonLink = document.createElement('a');
    sourceButtonLink.id ="source-btn_" + index;
    sourceButtonLink.href ="/local/hugo/lehrer_quellen.php";
    sourceButtonLink.setAttribute("target","_blank")
    const submitButton = document.createElement('img');
    submitButton.id ="submit-btn"
    submitButton.setAttribute("data-index", index);
    submitButton.src ="/local/hugo/assets/media/check.svg";
    containerDiv.appendChild(buttonContainer);
    buttonContainer.appendChild(sourceButtonLink);
    buttonContainer.appendChild(submitButton);
    sourceButtonLink.appendChild(sourceButton);
    containerDiv.appendChild(questionContainer);
    questionContainer.appendChild(questionAuthor);
    questionContainer.appendChild(questionContent);
    containerDiv.appendChild(tagContainer);
    tagContainer.appendChild(tagImg);

    const responseContainer = document.createElement('div');
    responseContainer.className="response-container";
    const responseAuthor = document.createElement('div');
    responseAuthor.className="response-author";
    responseAuthor.textContent="Hugo";
    const responseContent = document.createElement('div');
    responseContent.textContent=node.response;
    responseContent.className="response-content";
    containerDiv.appendChild(responseContainer);
    responseContainer.appendChild(responseAuthor);
    responseContainer.appendChild(responseContent);
    helperhelper.storeInfos(sourceButtonLink.id, node.source_ids);
    submitButton.addEventListener("click", function(event) {
      helperhelper.markedForReview(id,submitButton.getAttribute("data-index"));
      
      tagImg.src ="/local/hugo/assets/media/circle-check.svg";
      submitButton.style.display ="none";
    });
    index++;  
  });
    
    finishChat.addEventListener("click", function(event) {
      helperhelper.finishEditingChat(id);
      finishChat.style.display ="none";
    });
  }
 
   
      

  getArrayFromJson(input) {
    let array = input; 
    for (var i = 0; i < array.length; i++) {
    }
    return array;
  }
   /**
   * 
   * @summary Ändert das ausgewählte und neu angeklickte Element
   */
  swapActive(input){
    let activeDivCollection = document.getElementsByClassName("active");
    let activeDivArray = Array.from(activeDivCollection);
    activeDivArray[0].classList.remove("active");
    let addDiv = document.getElementById(input);
    addDiv.classList.add("active");
  }

}


class HelperHelper {
  /**
   * 
   * @summary Constructor der Helper Class
   */
    constructor() {
      this.markedForReviewEndpoint ='https://' + api_ip + '/tag_message_as_reviewed';
      this.finishEditingEndpoint ='https://' + api_ip + '/end_history_editing';
      
    }

    storeInfos(input, node){
    document.getElementById(input).addEventListener('click', function() {
      let variableValue = [];
      variableValue = node;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/local/hugo/includes/api.php', true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log("Success");
        } else {
          console.error('Fehler beim Senden der Daten. Statuscode: ' + xhr.status);
        }
      };
      xhr.onerror = function() {
      };
      xhr.send('source_ids='+ JSON.stringify(variableValue));
      console.log(variableValue);
    });
  }

  /**
   * 
   * @summary Endpoint um eine Nachricht als "reviewed" zu markieren
   */
 async markedForReview(id,index) {
  try {
    const response = await fetch(this.markedForReviewEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history_id: id,
        message_idx: index,
      }),
    });
    console.log(id,index);
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
  } catch (error) {
    console.error('Fehler:', error);
  }
}
/**
   * 
   * @summary Finish editing Chat
   */
async finishEditingChat(id) {
  try {
    const response = await fetch(this.finishEditingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history_id: id
      }),
    });
    console.log("finish edit!");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
  } catch (error) {
    console.error('Fehler:', error);
  }
}
}
  
  