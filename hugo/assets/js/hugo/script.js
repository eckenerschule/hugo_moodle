var api_ip = 'chatbot.aerotune.com';
//var api_ip = '192.168.1.156:1337';
addEventListener("DOMContentLoaded", (event) => {
  const bot = new EckenerBot();
});

class EckenerBot {

  /**
   * 
   * @summary Constructor der EckenerBot Class
   */
  constructor() {
    this.startApiEndpoint = 'https://' + api_ip + '/start_session';
    this.sessionApiEndpoint = 'https://' + api_ip + '/get_response';
    this.php_url = '/local/hugo/api.php';
    this.questionAmount = 0;
    this.sessionRequest;
    this.initKey;
    this.recievedToken;
    this.localBearer;
    this.localHistory;
    this.savedStorage;
    this.sessionID;
    this.sessionQuestion;
    this.prefixId = 'answer_';
    this.initializeChat();
  }
  /**
   * 
   * @summary Initialisiert den Chat-Bot
  */
 initializeChat() {
   // API-Endpunkt und Ihr API-Schlüssel
   console.log('Chatbot Initialize');
   document.getElementById("chat_input").value = "Stelle Verbindung zu Hugo her...";
    this.initializeEvents();
    this.fetchData();
       
    var images = ['/local/hugo/assets/media/Zeppelin_Cockpit_Steampunky.png', '/local/hugo/assets/media/BG_Zeppelin.png', '/local/hugo/assets/media/BG_Old_Classroom.png'];
    var randomIndex = Math.floor(Math.random() * images.length);
    var randomImage = images[randomIndex];
    var div = document.getElementById('background-container');
    div.style.background = 'url(' + randomImage + ') no-repeat';
  }
  
  /**
   * 
   * @summary init Data with php
  */
  async fetchData() {
    try {
      const response = await fetch(this.php_url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      }
  
      this.initKey = await response.json();
      this.savedStorage = localStorage.getItem('b-token');
      const helper = new EckenerBotRequests();
      if((this.savedStorage && helper.checkStorage())){
        this.startSessionMemory();
      } 
      else{
        this.recieveToken();
      }
      
    } catch (error) {
      console.error('Fehler bei der Fetch-Anfrage:', error);
    }
  }
   /**
   * 
   * @summary Requestet das Token mit unserem API Key
  */
   async recieveToken() {
    try {
      const response = await fetch('https://' + api_ip + '/get_token/', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'API_KEY': this.initKey.api
        },
      });
  
  
      this.recievedToken = await response.json();
      this.localBearer = this.recievedToken.token;
      const helper = new EckenerBotRequests();
      helper.saveToStorage(this.recievedToken.token);   
      this.startSession(); 
    } catch (error) {
      console.error('Fehler bei der Fetch-Anfrage:', error);
    }
  }
  /**
   * 
   * @summary Startet die Alternativ Verbindung mit dem Chat-Bot
  */ 
 async startSessionMemory(){
    const input = localStorage.getItem('b-token');
    this.sessionID  = localStorage.getItem('history_id');
    const serverUrl = this.startApiEndpoint;
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        referrerPolicy: 'unsafe-url',
        headers: {
          'Content-Type': 'application/json',
          'BEARER_TOKEN': JSON.parse(input).token,
        },
        body: JSON.stringify({
          history_id: this.sessionID,
        }),
      }
      );
      this.sessionRequest = await response.json();
      this.localBearer = JSON.parse(input).token;
      let chat_input = document.getElementById("chat_input");
      let intro_text = document.getElementById("intro-text");
      intro_text.style.display ="block";
      intro_text.textContent = this.sessionRequest.start_message;
      chat_input.disabled = false;
      chat_input.focus();
      chat_input.value ="";
      this.sessionRequest.messages.forEach(node => {
        let container = document.getElementById('chat_history');
        let questionDiv = document.createElement('div');
        questionDiv.className ="displayUser-container right-container";
        questionDiv.textContent = node.message;
        container.appendChild(questionDiv);
        let answerDiv = document.createElement('div');
        answerDiv.className ="displayUser-container left-container";
        answerDiv.textContent = node.response;
        container.appendChild(answerDiv);
      });
    } catch (error) {
      console.error('Fehler:', error);
    }
  }
   /**
   * 
   * @summary Startet die Verbindung mit dem Chat-Bot
  */
  async startSession(){
    const serverUrl = this.startApiEndpoint;
    try {
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          'BEARER_TOKEN': this.recievedToken.token,
        },
    
      }
      );
      this.sessionRequest = await response.json();
      this.sessionID = this.sessionRequest.history_id;
      localStorage.setItem('history_id',this.sessionRequest.history_id);
      this.sessionQuestion = this.sessionRequest.message;   
      let intro_text = document.getElementById("intro-text");
      intro_text.style.display ="block";
      intro_text.textContent = this.sessionRequest.message;
      let chat_input = document.getElementById("chat_input");
      chat_input.disabled = false;
      chat_input.focus();
      chat_input.value ="";
    } catch (error) {
      console.error('Fehler:', error);
    }
  }

 
  /**
   * 
   * @summary Initialisiert die Chat-Bot-Events
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

    let confirm_chat_input = document.getElementById("confirm_chat_input");
    if (typeof(confirm_chat_input) != 'undefined' && confirm_chat_input != null)
    {
      confirm_chat_input.addEventListener('click', (event) => {
        this.submitForm();
      });
    }

    let chat_input = document.getElementById("chat_input");
    if (typeof(chat_input) != 'undefined' && chat_input != null)
    {
      chat_input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.submitForm();
        }
      });
    }

    const messageEle = document.getElementById('chat_input');
    const counterEle = document.getElementById('input_counter');
    counterEle.innerHTML = `0/${document.getElementById('chat_input').getAttribute('maxlength')}`;
    messageEle.addEventListener('input', function (e) {
      const target = e.target;
      const maxLength = target.getAttribute('maxlength');
      const currentLength = target.value.length;
      counterEle.innerHTML = `${currentLength}/${maxLength}`;
    });
}

  /**
   * 
   * @summary Sendet eine Anfrage an Custom Chat-API Endpoint
   * @param question [Required] String für die Anfrage an dem Chat-Bot
   */
  async askQuestion(input) {
    this.createAnswerContainer();
    try {
      const response = await fetch(this.sessionApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'BEARER_TOKEN': this.localBearer,
        },
        body: JSON.stringify({
          history_id: this.sessionID,
          message: input,
        })
      });
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          document.getElementById("hugo-avatar").src="/local/hugo/assets/media/Eckener_Avatar.png";

          let chat_input = document.getElementById("chat_input");

          chat_input.disabled = false;
          chat_input.value ="";
          chat_input.focus();
          this.createThumbs();
          break;
        }
        
        // Massage and parse the chunk of data
        const chunk = decoder.decode(value);
        this.postAnswer(chunk);
       
      }
      // Antwort verarbeiten
    } catch (error) {
      console.error('Fehler:', error);
    }
    this.questionAmount++;
  }
  
  /**
   * 
   * @summary Erstellt die Feedback Option im Chat
   */
  createThumbs() {
    let wrapperContainer = document.getElementById(this.prefixId + this.questionAmount);

    let feedbackHtml = `
    <div class="feedback-container">
      <div class="image-wrapper-container">
        <div class="dislike-button" data-id="${this.questionAmount}">
          <img class="thumb-down" src="/local/hugo/assets/media/thumbs-down-solid.svg"/>
        </div>
        <div class="tooltip-container">Antwort ist nicht hilfreich!</div>
      </div>
    </div>`
    
    wrapperContainer.innerHTML = wrapperContainer.innerHTML + feedbackHtml;

    let dislikeButton = document.querySelectorAll(`[data-id="${this.questionAmount}"].dislike-button`);
    const id = this.sessionID;
    var changeQuestion = {
      history_id: id,
      message_idx: dislikeButton[0].getAttribute("data-id"),
    };

    const apiCaller = new EckenerBotRequests();

    dislikeButton[0].addEventListener("click", function(event){
      console.log(JSON.stringify(changeQuestion));
      let imageSwapper = dislikeButton[0].children[0];
      imageSwapper.src ="/local/hugo/assets/media/thumbs-down-solid-grey.svg";
      dislikeButton[0].style.pointerEvents ="none";
      apiCaller.sendQuestion(changeQuestion);
    });
    let chatView = document.getElementById("chat_history");
    chatView.scrollTop = chatView.scrollHeight;
  }

  /**
   * 
   * @summary Schließt die Confirm Box 
   */
  cancelConfirmBox() {
    let confirmBox = document.getElementById("confirmBox");
    confirmBox.style.display = "none";
  }

  /**
   * 
   * @summary Bearbeitet die User-Anfrage
   */
  submitForm() {
    var input = document.getElementById("chat_input").value;
    if (input !== "") {
      //Schüler Input print
      const counterEle = document.getElementById('input_counter');
      counterEle.innerHTML = `0/${document.getElementById('chat_input').getAttribute('maxlength')}`;
      var chatView = document.getElementById("chat_history");
      var displayDiv = document.createElement("div");
      var displayDivChatBubble = document.createElement("div");
      displayDivChatBubble.className ="chatbubble right";
      displayDiv.className = "displayUser-container right-container";
      displayDiv.textContent = input;
      chatView.appendChild(displayDiv);
      displayDiv.appendChild(displayDivChatBubble);
      this.askQuestion(input);
      document.getElementById("chat_input").value='';
      chatView.scrollTop = chatView.scrollHeight;
    }
  }

   /**
   * 
   * @summary Abbilden der Antwort in dem current Answer-Div
   */
  postAnswer(answer)
  {
    var chatContainer = document.getElementById("chat_history"); 
    document.getElementById("chat_input").value='...';
    var answerDiv = document.getElementById(this.prefixId + this.questionAmount);
    
    if(answerDiv)
    {
      answerDiv.style.display = 'block';
      answerDiv.textContent += answer;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  /**
   * 
   * @summary Erstellen des Answer-Divs
   */
  createAnswerContainer() {
    let chatView = document.getElementById("chat_history");
    document.getElementById("chat_input").disabled = true;
    document.getElementById("chat_input").value='...';
    document.getElementById("hugo-avatar").src="/local/hugo/assets/media/search_avatar.gif";
    let displayDiv = document.createElement("div");
    displayDiv.id = this.prefixId + this.questionAmount;
    displayDiv.className = "displayUser-container left-container";
    displayDiv.style.display = 'none';
    chatView.appendChild(displayDiv); 
  }

  

 
}

class EckenerBotRequests {
  /**
   * 
   * @summary Constructor der EckenerBot Class
   */
    constructor() {
      this.sessionRequestChange = 'https://' + api_ip + '/tag_message_for_review';
    }

  /**
   * 
   * @summary Sendet Session ID + index der Frage an die Review
   * @param JsonData [Required] JsonData: {"history_id: "{SESSIONID}","message_idx":"{message_idx}"}
   * @param Route [Required] JsonData: {"history_id: "{SESSIONID}","message_idx":"{message_idx}"}
   */
  async sendQuestion(input) {
    try {
      const response = await fetch(this.sessionRequestChange, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history_id: input.history_id,
          message_idx: input.message_idx,
        }),
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
    } catch (error) {
      console.error('Fehler:', error);
    }
  }
  printText(input){
    let intro_text = document.getElementById("intro-text");
    let startindex = 0;
    if (startindex < input.length) {
      intro_text.textContent += input[startindex];
      startindex++;
      setTimeout(this.printText, 100);
  }
  }
  checkStorage() {
    const savedStorage = localStorage.getItem('b-token');
    if (savedStorage) {
        const data = JSON.parse(savedStorage);
        const jetzt = new Date();

        if (jetzt.getTime() < data.expireDate) {
            return true;
        } else {
            localStorage.removeItem('b-token');
            return false;
        }
    } else {
        return false;
    }
}
  saveToStorage(token) {
    let data = {
      token: token,
      expireDate: new Date().getTime() + 2 * 60 * 1000
    }
    localStorage.setItem('b-token', JSON.stringify(data));
  }
}
