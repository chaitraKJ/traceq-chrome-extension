console.log("TraceQ extension running");

function attach_event(){
	try{
		const list_data = document.getElementById('list_data');
		if(list_data){
			const app_link = list_data.querySelectorAll(".app-link");
			app_link.forEach((app, i) => {
				app.removeEventListener('click', handle_click);
				app.addEventListener('click', handle_click);
			});
		}
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}
}

async function handle_click(event){
	try{
		const app = event.srcElement;
		if(app && app.dataset.appid){
			const message = {
				type: "app_data",
				tab: "NEW",
				session: "PERSISTENT",
				application_id: app.dataset.appid
			}
			await chrome.runtime.sendMessage(message);
		}
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}
}

let interval = null;
interval = setInterval(() => {
	try{
		const list_data = document.getElementById('list_data');
		if(list_data.children.length > 0){ 
			attach_event();
		}
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}	
}, 1000);