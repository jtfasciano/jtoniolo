var appAlertClose = document.querySelectorAll("#alert-container");

init();

function init(){
	console.log(appAlertClose);
	for(var i = 0; i < appAlertClose.length; i++){
		appAlertClose[i].addEventListener("click", function(){
			this.parentNode.removeChild(appAlertClose[0]);
		});
	}
}
