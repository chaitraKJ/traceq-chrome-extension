console.log("TraceQ - Tapestry script injected")

console.log("p5 sketch extension");

var s = function (sketch){
	const password = document.getElementById("LoginView1_Login1_Password");

	sketch.setup = function(){
		try{
			document.body.style.userSelect = "none";
			let h = document.body.clientHeight;
			let c = sketch.createCanvas(sketch.windowWidth, h);
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
			const y1 = coords.top + window.scrollY + 9;
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

function handleMessages(message, sender, sendResponse) {
	if(message['type'] == "credentials"){
		const main_div = document.getElementById("Login");
		const login_btn = main_div.querySelector("#btnLogin");

		const username_input = main_div.querySelector("#LoginView1_Login1_UserName");
		const password_input = main_div.querySelector("#LoginView1_Login1_Password");

		
		if(login_btn)	{
			sessionStorage.setItem("application_id", message['application_id']);
			login_btn.click();
		}
		if(username_input && password_input){
			var myp5 = new p5(s);
			username_input.value = message['username'];
			password_input.value = message['password'];

			username_input.setAttribute("readonly", true);
			password_input.setAttribute("readonly", true);
			password_input.style.filter = "blur(5px)";
		}
	}
}
chrome.runtime.onMessage.addListener(handleMessages);


async function get_credentials(id){
	try{
		const message = {
			type: "app_data",
			tab: "NONE",
			session: "CLEAR",
			application_id: id
		}
		await chrome.runtime.sendMessage(message);
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}
}

try{
	const application_id = sessionStorage.getItem("application_id");
	if(application_id){
		sessionStorage.removeItem("application_id");
		get_credentials(application_id);
	}
}
catch(error){
	console.log("TraceQ Extension Content-Script Error: "+error);
}