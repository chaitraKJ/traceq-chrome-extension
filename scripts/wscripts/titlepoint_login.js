console.log("TraceQ - Titlepoint-Login script injected");

console.log("p5 sketch extension");

var s = function (sketch){
	const password = document.getElementById("input61");

	sketch.setup = function(){
		try{
			document.body.style.userSelect = "none";
			const body = document.querySelector("body");

			let h = document.body.clientHeight;
			let c = sketch.createCanvas(sketch.windowWidth,  h);
			c.parent(body);
			c.position(0, 0);
			c.style('pointer-events', 'none');
			sketch.clear();
		}
		catch(error){
			console.log("TraceQ Extension Content-Script P5 Error: "+error);
		}	
	};

	sketch.draw = function(){
		try{
			sketch.clear();
			const coords = password.getBoundingClientRect();
			const x1 = coords.left + window.scrollX;
			const y1 = coords.top + window.scrollY + 19;
			const x2 = x1 + coords.width;

			sketch.stroke(0);
			sketch.strokeWeight(coords.height);
			sketch.line(x1, y1, x2, y1);
		}
		catch(error){
			console.log("TraceQ Extension Content-Script P5 Error: "+error);
		}		
	};
};

let application_id = null;
chrome.storage.local.get(["titlePoint_app_id"]).then((result) => {
	try{
		console.log("Value is " + result['titlePoint_app_id']);

		application_id = result['titlePoint_app_id'];
		if(application_id){
			const message = {
				type: "app_data",
				tab: "NONE",
				session: "CLEAR",
				application_id: application_id
			}
			chrome.runtime.sendMessage(message);
			chrome.storage.local.clear(() => { console.log("Storage Cleared") });
		}
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}	
});

function handleMessages(message, sender, sendResponse) {
	try{
		if(message['type'] == "credentials"){ 
			const username = message['username'];
			const password = message['password']; 

			const mainInterval = setInterval(() => {	
				try{
					const main_div = document.querySelector("#signin-container");
					const next_btn = main_div.querySelector("#form20 input[type='submit']");
					const username_input = main_div.querySelector("#input28");  

					if(next_btn && username_input){
						clearInterval(mainInterval);

						username_input.setAttribute("readonly", true);
						username_input.value = username;
						username_input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
						next_btn.click();

						let interval = setInterval(() => {
							try{
								const password_input = document.getElementById("input61");
								if(password_input){
									clearInterval(interval);

									var myp5 = new p5(s);
									password_input.setAttribute("readonly", true);
									password.style.filter = "blur(5px)";															
									password_input.value = password;
									password_input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
								}
							}
							catch(error){
								console.log("TraceQ Extension Content-Script Error: "+error);
							}							
						}, 1000);
					}
				}
				catch(error){
					console.log("TraceQ Extension Content-Script Error: "+error);
				}
			}, 1000);
		}
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}
	
}
chrome.runtime.onMessage.addListener(handleMessages);