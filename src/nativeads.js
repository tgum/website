function hideadnote() {
	document.getElementById("ad-note").id = 'ad-note-hidden';
	document.getElementById("ad-note-content-wrapper").innerHTML = "";
	document.cookie = "notice-shown=true;path=/";
}

window.onload = () => {
	if (!document.cookie.includes("notice-shown")) {
		document.getElementById("ad-note-hidden").id = 'ad-note';
		document.getElementById("ad-note-content-wrapper").innerHTML = "No adblocker detected. " + 
		"Consider using an extention like <a href=https://ublockorigin.com/>uBlock Origin</a> to save time and bandwidth." +
		" <button onclick=hideadnote()>Click here to close.</button>";
	}
}
