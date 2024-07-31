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
  this.initializeChat();
}

/**
   * 
   * @summary Initialisiert den Chat-Bot
  */
initializeChat() {
  // API-Endpunkt und Ihr API-Schlüssel
  console.log('Chatbot Initialize');
   this.initializeEvents();
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
