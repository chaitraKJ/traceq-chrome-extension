console.log("TraceQ Background Service Worker");

let SITE_URL = "";

// Event listener
async function handleMessages(message, sender, sendResponse) { 

	try{

		// SET THE PASSWORD SAVING TO FALSE
		chrome.privacy.services.passwordSavingEnabled.get({}, function(details) {
			try{
				if (details.levelOfControl === 'controlled_by_this_extension') {
					chrome.privacy.services.passwordSavingEnabled.set({ value: false }, function() {
						if (chrome.runtime.lastError === undefined) {
							console.log("Password storing is set to FALSE");
						} else {
							console.log("Sadness!", chrome.runtime.lastError);
						}
					});
				}
			}
			catch(error){
				console.log("TraceQ Extension Background-Worker Error: "+error);
			}		
		});

		if(message.type == "app_data"){
			let tab = null;

			// FETCH THE APPLICATION INFO	
			let application_id = message.application_id;
			SITE_URL = message.site_url ? message.site_url : SITE_URL; console.log(SITE_URL);

			if(application_id && SITE_URL){ console.log(SITE_URL);
				const form = new FormData();
				form.append("application_id", application_id);
				const response = await fetch(SITE_URL, {
					method: "POST",
					body: form
				});
				const result = await response.json();

				if(result['type'] == "success"){

					// OPEN THE URL IN NEW TAB
					if(message['tab'] == "NEW"){					
						tab = await chrome.tabs.create({
							active: true,
							url: result['url']
						});
					}
					else if(message['tab'] == "NONE"){
						tab = sender['tab'];
					}

					// INJECT THE OTHER SECURITY MEASURES
					await chrome.scripting.executeScript({
						target: { tabId: tab.id },
						files : ["scripts/mask_input.js"],
					});

					// SEND CREDENTIALS TO THE ABOVE TAB
					const cred_message = {
						type: "credentials",
						application_id: application_id,
						username: result['username'],
						password: result['password']
					};
					await chrome.tabs.sendMessage(tab.id, cred_message);
				}
			}	
		}
	}
	catch(error){
		console.log("TraceQ Extension Background-Worker Error: "+error);
	}
}
chrome.runtime.onMessage.addListener(handleMessages);