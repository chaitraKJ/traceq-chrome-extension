console.log("TraceQ - ICounty script injected");

console.log("p5 sketch extension");

var s = function (sketch){
	const username = document.querySelector("form input[name='loginModel.username1']");
	const password = document.querySelector("form input[name='loginModel.password']");	

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

function handleMessages(message, sender, sendResponse){
	try{
		if(message['type'] == "credentials"){

			const interval = setInterval(() => {	
				const username = document.querySelector("form input[name='loginModel.username1']");
				const password = document.querySelector("form input[name='loginModel.password']");	

				if(username && password){
					clearInterval(interval);
					
					var myp5 = new p5(s);
					username.setAttribute("readonly", true);
					password.setAttribute("readonly", true);
					password.style.filter = "blur(5px)";

					username.value = message['username'];
					password.value = message['password'];	
				}
			}, 1000);
		}
	}
	catch(error){
		console.log("TraceQ Extension Content-Script Error: "+error);
	}
}
chrome.runtime.onMessage.addListener(handleMessages)