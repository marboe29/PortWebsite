function eTextDropdown(){
    document.getElementById("ePopupText").classList.toggle("eShow");
    document.getElementById("eArrowOne").classList.toggle("eArrowShow");
}
function eTextDropdownTwo(){
    document.getElementById("ePopupTextTwo").classList.toggle("eShowTwo");
    document.getElementById("eArrowTwo").classList.toggle("eArrowShowTwo");
}
function eTextDropdownThree(){
    document.getElementById("ePopupTextThree").classList.toggle("eShowThree");
    document.getElementById("eArrowThree").classList.toggle("eArrowShowThree");
}

//Gets the emission projects popup text
		var ePopup = document.getElementById("emissionPopup");
		var eBtn = document.getElementById("emissionBtn");

		eBtn.click = function() {
		ePopup.style.display = "block";
		}

		window.onclick = function(event) {
		if (event.target == ePopup) {
			ePopup.style.display = "none";
		}
		}