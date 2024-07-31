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
  this.generateHeadlineEndpoint = 'https://' + api_ip + '/generate_headline';
  this.source_ids = window.source_ids;
  this.initializeChat();
}

/**
   * 
   * @summary Initialisiert den Chat-Bot
  */
async initializeChat() {
  // API-Endpunkt und Ihr API-Schlüssel
   const helper = new Helper();
   this.initializeEvents();
   console.log('Histories Initialize');
   
   let ids = await helper.getHistoriesBulk();
   const queryString = window.location.search;
   if (queryString == "?summary"){
    this.calcUsedSources(ids);
    console.log(ids);
   }else{
    this.calcUsedSources(this.source_ids);
   }
   
 }

/**
   * 
   * @summary Generiert die Headline
   */
async generateHeadline(input){
  console.log(input);
    try {
      const response = await fetch(this.generateHeadlineEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: input,
        }),
      });
      this.headlineResponse = await response.text();
      const decoder = new TextDecoder("utf-8");
      console.log("HEADLINE:")
      console.log(this.headlineResponse);
      let titleDiv = document.getElementById('title-input-sources');
      titleDiv.value = this.headlineResponse;
    } catch (error) {
      console.error('Fehler:', error);
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
  /*Create Subjects*/ 
  let create_source = document.getElementById("create-source");
  if (typeof(create_source) != 'undefined' && create_source != null)
  {
    create_source.addEventListener('click', async (event) => {
      let create_source_container = document.getElementById("chat-create-container");
      let hide_chat_container = document.getElementById("chat-details-container");
      let img_swap_source = document.getElementById("create-source-img");
      create_source_container.classList.add("source-toggle");
      hide_chat_container.classList.add("source-toggle");
      create_source.classList.add("source-toggle");
      img_swap_source.src = "/local/hugo/assets/media/circle-plus-solid-grey.svg";
      const helper = new Helper();
      const subjects = await helper.getSubjects();
      this.createSelectField(subjects);
    });
  }
 
  let create_headline = document.getElementById("create-title");
  if (typeof(create_headline) != 'undefined' && create_headline != null)
  {
    create_headline.addEventListener('click', (event) => {
      let textToGenerate = document.getElementById('content-input-sources');
      if (textToGenerate.value !== '') {
      this.generateHeadline(textToGenerate.value);
    }
    });
  }

  const helper = new Helper();
  let titleDiv = document.getElementById("title-input-sources");
  titleDiv.addEventListener("input", helper.checkForm);

  let contentDiv = document.getElementById("content-input-sources");
  contentDiv.addEventListener("input", helper.checkForm);

  let sourceDiv = document.getElementById("source-input-sources");
  sourceDiv.addEventListener("input", helper.checkForm);

  let tagDiv = document.getElementById("tag-select");
  tagDiv.addEventListener("input", helper.checkForm);

  let save_source = document.getElementById("save-create");
  if (typeof(save_source) != 'undefined' && save_source != null)
  {
    save_source.addEventListener('click', (event) => {
      const helper = new Helper();
      helper.checkForm();
      helper.sendSource(titleDiv.value, contentDiv.value, sourceDiv.value,tagDiv.value);
    });
  }


  let soft_delete_ele = document.getElementById("soft-delete");
  let soft_delete_container = document.getElementById("delete-info-container");
  if (typeof(soft_delete_ele) != 'undefined' && soft_delete_ele != null)
  {
    soft_delete_ele.addEventListener('click', (event) => {
      const helper = new Helper();
      let activeDivCollection = document.getElementsByClassName("active");
      let activeDivArray = Array.from(activeDivCollection);
      soft_delete_container.style.display = "flex";
      soft_delete_ele.style.display = "none";
      helper.softDeleteInfo(activeDivArray[0].id);
    });
  }
  
}

createSelectField(subjects){
  var dropdown = document.getElementById("tag-select");

       
        for (var i = 0; i < subjects.length; i++) {
            var option = document.createElement("option");
            option.text = subjects[i];
            option.value = subjects[i]; 
            dropdown.add(option);
        }
}



createHeadlines(input){
  const helper = new Helper();
  let historyContainer = document.getElementById('history-list');
  let historyList = `
    <div class="node-container" id="${input}">
    ${helper.getHistories(input)}
    </div>`
  historyContainer.insertAdjacentHTML('beforeend',historyList);
  const idEle = document.getElementById(input);
    idEle.addEventListener("click", function(event){
     helper.getHistories(input);
     helper.checkMarking();
    });
}

calcUsedSources(input){
  
  for (var i = 0; i < input.length; i++) {
    
    this.createHeadlines(input[i]);
    console.log(input[i]);
    if(i == 0){
      const firstEle = document.getElementById(input[i]);
      firstEle.className ='node-container active';
    }
  }
}

}

class Helper {

  /**
    * 
    * @summary Constructor der Helper Class
    */
  constructor() {
    this.addNewInfo = 'https://' + api_ip + '/add_new_information'; 
    this.subjectEndpoint = 'https://' + api_ip + '/get_subjects';
    this.historyEndpoint = 'https://' + api_ip + '/get_information_data';
    this.historyEndpointDelete = 'https://' + api_ip + '/mark_information_for_delete';
    this.historyEndpointBulk = 'https://' + api_ip + '/get_information_headlines';
    this.historyResponseBulk;
    this.deleteResponse;
    this.historyResponse;
    this.headline;
    this.source_ids = window.source_ids;
    this.bulkIds = [];
    this.obj = {};
   
 }
 /**
   * 
   * @summary Bekommt Tags
   */
async getSubjects(){
  const serverUrl = this.subjectEndpoint;
  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      referrerPolicy: 'unsafe-url',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    );
    this.subjectRequest = await response.json();
    return this.subjectRequest; 
  } catch (error) {
    console.error('Fehler:', error);
  }
}
/**
   * 
   * @summary Bekommt X Chathistories mit ID
   */
async getHistoriesBulk() {
  try {
    const response = await fetch(this.historyEndpointBulk, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_idx: 0,
      }),
    });
    this.historyResponseBulk = await response.json();
    const decoder = new TextDecoder("utf-8");
    console.log("getHistoriesBulk():")
    console.log(this.historyResponseBulk);
    this.convertBulk(this.historyResponseBulk);
    return this.bulkIds;
  } catch (error) {
    console.error('Fehler:', error);
  }
}
 /**
   * 
   * @summary Bekommt eine Infoquelle zu der gegebenen ID
   */
async getHistories(input) {
  try {
    const response = await fetch(this.historyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info_id : input,
      }),
    });
    this.historyResponse = await response.json();
    const decoder = new TextDecoder("utf-8");
    console.log("getHistory():")
    console.log(this.historyResponse);
    this.swapActive(input);
    this.initHeadlines(this.historyResponse.headline, input);
    this.initDetails(this.historyResponse.headline, this.historyResponse.content, this.historyResponse.source, this.historyResponse.subject);
    this.checkMarking(this.historyResponse.tag);
  } catch (error) {
    console.error('Fehler:', error);
  }
}
 /**
   * 
   * @summary Sendet das ausgefüllte Formular
   */
 async sendSource(headline_input, content_input, source_input, tag_input) {
  try {
    const response = await fetch(this.addNewInfo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headline: headline_input,
        content: content_input,
        source: source_input,
        subject: tag_input,
      }),
    });
    this.informationResponse = await response.json();
    const decoder = new TextDecoder("utf-8");
    console.log("sendSource():")
    console.log(this.informationResponse);
    let saveButton = document.getElementById("save-create");
    saveButton.setAttribute("disabled", "true");
    this.clearForm();
  } catch (error) {
    console.error('Fehler:', error);
  }
}
/**
   * 
   * @summary Soft delete einer Information
   */
async softDeleteInfo(input) {
  try {
    const response = await fetch(this.historyEndpointDelete, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info_id: input,
      }),
    });
    this.deleteResponse = await response.json();
    const decoder = new TextDecoder("utf-8");
    console.log("softdelete():")
    console.log(this.deleteResponse);
    this.changeMarking(this.deleteResponse.tag);
  } catch (error) {
    console.error('Fehler:', error);
  }
}

convertBulk(input){
  
  input.forEach((node, index) => {
    this.bulkIds[index] = node._id;
  });
}



initHeadlines(headline, id){
  let container = document.getElementById(id);
  container.textContent = headline;
}
initDetails(headline, content, sources,tags){
  let titlediv = document.getElementById('title-input');
  titlediv.textContent = headline;
  let contextdiv = document.getElementById('context-input');
  contextdiv.textContent = content;
  let sourcediv = document.getElementById('source-input');
  sourcediv.textContent = sources;
  let tagsdiv = document.getElementById('tags-input');
  tagsdiv.innerHTML ="";
  console.log("TEST");
  console.log(tags);
    let tagsInnerDiv = document.createElement('div');
    tagsInnerDiv.className ="subject-div";
    tagsInnerDiv.textContent = tags;
    tagsdiv.appendChild(tagsInnerDiv);
}
 swapActive(input){
  let activeDivCollection = document.getElementsByClassName("active");
  let activeDivArray = Array.from(activeDivCollection);
  activeDivArray[0].classList.remove("active");
  let addDiv = document.getElementById(input);
  addDiv.classList.add("active");
  let checkCreateButton = document.getElementById("create-source");
  if(checkCreateButton.classList.contains("source-toggle")){
    let removeClassSource = document.getElementsByClassName("source-toggle");
    let removeClassSourceArray = Array.from(removeClassSource);
    removeClassSourceArray[0].classList.remove("source-toggle");
    removeClassSourceArray[1].classList.remove("source-toggle");
    removeClassSourceArray[2].classList.remove("source-toggle");
    let img_swap_source = document.getElementById("create-source-img");
    img_swap_source.src = "/local/hugo/assets/media/circle-plus-solid-white.svg";
  }
 
}

checkMarking(){
  let infoDiv = document.getElementById('delete-info-container');
  let markButton = document.getElementById('soft-delete');
  if(this.historyResponse.tag == "soft_delete"){
    infoDiv.style.display ="flex";
    markButton.style.display ="none";
  }
  else{
    infoDiv.style.display ="none";
    markButton.style.display ="block";
  }
}
changeMarking(input){
  let infoDiv = document.getElementById('delete-info-container');
  let markButton = document.getElementById('soft-delete');
  if(input == "soft_delete"){
    infoDiv.style.display ="flex";
    markButton.style.display ="none";
  }
  else{
    infoDiv.style.display ="none";
    markButton.style.display ="block";
  }
}

checkForm(){
  let saveButton = document.getElementById("save-create");
  let titleDiv = document.getElementById("title-input-sources");
  let contentDiv = document.getElementById("content-input-sources");
  let sourceDiv = document.getElementById("source-input-sources");
  let tagDiv = document.getElementById("tag-select");
    if (titleDiv.value !== "" && contentDiv.value !== "" && sourceDiv.value !== "" && tagDiv.value !== "" && 
    titleDiv.value !== undefined && contentDiv.value !== undefined && sourceDiv.value !== undefined && tagDiv.value !== undefined ) {
      saveButton.removeAttribute("disabled");
    } else {
      saveButton.setAttribute("disabled", "true");
    }
}

clearForm(){
  let titleDiv = document.getElementById("title-input-sources");
  let contentDiv = document.getElementById("content-input-sources");
  let sourceDiv = document.getElementById("source-input-sources");
  titleDiv.value ="";
  contentDiv.value ="";
  sourceDiv.value ="";
}

}

