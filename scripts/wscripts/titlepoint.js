console.log("TraceQ - Titlepoint-Dashboard script injected")

function handleMessages(message, sender, sendResponse) {
	try{
		if(message['type'] == "credentials"){
			const login_btn = document.querySelector("#btnLogin");
			if(login_btn){

				chrome.storage.local.set({ titlePoint_app_id: message['application_id'] }).then(() => {
					console.log("Value is set");
				});

				login_btn.click();
			}
		}
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}	
}
chrome.runtime.onMessage.addListener(handleMessages);