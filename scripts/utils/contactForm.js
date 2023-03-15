/**
 * 
 * @param {*} block on selectionne le block sur lequel on souhaite effectué le changement
 * @param {*} value on met la valeur de l'attribut
 * @param {*} aria on met l'attribut qui correspond au changement
 */
function blockAccessibility(block, value, aria) {
	const element = document.getElementById(block)
	element.setAttribute(aria, value)
}

/**
 * Ouverture du formulaire
 */
function displayModal() {
	const modal = document.getElementById("contact_modal")
	const prenom = document.getElementById("prenom")
	const inputDivs = document.querySelectorAll(".formData")

	inputDivs.forEach((e) => {
		e.dataset.errorVisible = "false"
	})

	modal.style.display = "block"	
	blockAccessibility("main", "true", "aria-hidden")
	blockAccessibility("header","true", "aria-hidden")
	blockAccessibility("contact_modal", "false", "aria-hidden")
	blockAccessibility("contact_modal", "false", "aria-hidden")

	tabIndexNavigationOpen()
	prenom.focus()
}

/**
 * fermeture du formulaire avec clavier, souris et sur validation des données
 */
function closeModalMultiWay() {
	if(checkData() === true) {
		closeModal()
	}

	// fermeture du formulaire à l'aide de la croix
	const btnCloseModal = document.getElementById("close-btn")
	btnCloseModal.addEventListener("click", ()=> {
		closeModal()
	})

	// Fermeture du formulaire avec la touche escape
	document.addEventListener("keydown", e => {
		const keyCode = e.key ? e.key : e.code
		if (keyCode === "Escape") {
			closeModal()

			const focusContact = document.getElementById("contact-me")
			focusContact.focus()
		}
	})
}

/**
 * Fermeture du formulaire
 */
function closeModal() {
	const modal = document.getElementById("contact_modal")
	const formulaire = document.getElementById("form-contact")
	modal.style.display = "none"
	blockAccessibility("main", "false", "aria-hidden")
	blockAccessibility("header", "false", "aria-hidden")
	blockAccessibility("contact_modal", "true", "aria-hidden")
	getData()
	tabIndexNavigationClose()
	formulaire.reset()
}

/**
 * On récupère les informations du formulaire quand elles sont validées
 */
function getData() {
	if(checkData() === true) {
		const email = document.getElementById("email").value
		const message = document.getElementById("message").value
		const firstName = document.getElementById("prenom").value
		const lastName = document.getElementById("nom").value

		const datas = {
			prenom: firstName,
			nom: lastName,
			email: email,
			message: message
		}

		console.log(datas)
	}
}

/**
 * 
 * @param {*} inputValue 
 * @returns On vérifie les données nom et prénom 
 */
function checkFirstAndName(inputValue) {
	if(inputValue !== undefined){
		const inputValueRaw = inputValue.value
		if(inputValueRaw.trim() !== "" && inputValue.value.length > 1) {
			inputValue.parentNode.setAttribute("data-error-visible", "false")
			return true
		} else  {
			inputValue.parentNode.setAttribute("data-error-visible", "true")
			return false
		}
	}
}

/**
 * 
 * @returns On vérifie si l'email est valide
 */
function checkEmail() {
	const email = document.getElementById("email")
	var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.value.match(emailRegex)) {
		email.parentNode.setAttribute("data-error-visible", "false")
		return true
	} else {
		email.parentNode.setAttribute("data-error-visible", "true")
		return false
	}
}

/**
 * 
 * @returns On vérifie si on a un message
 */ 
function checkMessage() {
	const message = document.getElementById("message")

	if (message.value !== undefined && message.value.trim() !== "" && message.value.length > 1) {
		message.parentNode.setAttribute("data-error-visible", "false")
		return true
	}	else {
		message.parentNode.setAttribute("data-error-visible", "true")
		return false
	}
}

/**
 * 
 * @returns On vérifie toutes les données avant la fermeture du formulaire
 */
function checkData() {
	const firstName = document.getElementById("prenom")
	const lastName = document.getElementById("nom")

	checkFirstAndName(firstName)
	checkFirstAndName(lastName)
	checkEmail()
	checkMessage()

	if (	
		checkFirstAndName(firstName) === true &&
		checkFirstAndName(lastName) === true &&
		checkEmail() === true &&
		checkMessage() === true) {
		return true
	} else {
		return false
	}
}

/**
 * Vérifications des datas quand on click sur le bouton
 */
function submitBtn()  {
	const btnSubmit = document.getElementById("btn-form")
	btnSubmit.addEventListener("click", (e) => {
		e.preventDefault()
		if( checkData() === true){
			closeModal()
		}
	})
}

/**
 * Changement de la tabulation avec le formualaire ouvert ou le tri des médias fermé
 * @param {*} typeOfBtn 
 */
function tabIndexNavigationOpen(typeOfBtn) {
	const header = document.querySelector("#header a")
	const contactBtn = document.querySelector(".contact_button")
	const sortBtn = document.querySelector("#sort-by")
	const articles = document.querySelectorAll(".media-wrapper article")
	const btnPopularity = document.getElementById("popularity-select")
	const btnDate = document.getElementById("date-select")
	const btnTitle = document.getElementById("title-select")

	if(typeOfBtn === "tri" ) {
		btnPopularity.setAttribute("tabindex", 0)
		btnDate.setAttribute("tabindex", 0)
		btnTitle.setAttribute("tabindex", 0)
	}

	header.setAttribute("tabindex", -1)
	contactBtn.setAttribute("tabindex", -1)
	sortBtn.setAttribute("tabindex", -1)

	articles.forEach( article => {
		article.setAttribute("tabindex", -1)
	})
}

/**
 * Changement de la tabulation avec le formualaire fermé ou le tri des médias fermé
 * @param {*} typeOfBtn 
 */
function tabIndexNavigationClose(typeOfBtn) {
	const header = document.querySelector("#header a")
	const contactBtn = document.querySelector(".contact_button")
	const sortBtn = document.querySelector("#sort-by")
	const articles = document.querySelectorAll(".media-wrapper article")
	const btnPopularity = document.getElementById("popularity-select")
	const btnDate = document.getElementById("date-select")
	const btnTitle = document.getElementById("title-select")

	if(typeOfBtn === "tri") {
		btnPopularity.setAttribute("tabindex", -1)
		btnDate.setAttribute("tabindex", -1)
		btnTitle.setAttribute("tabindex", -1)
	}

	header.setAttribute("tabindex", 0)
	contactBtn.setAttribute("tabindex", 0)
	sortBtn.setAttribute("tabindex", 0)

	articles.forEach( article => {
		article.setAttribute("tabindex", 0)
	})
}

function initForm() {
	closeModalMultiWay()
	submitBtn()
}

initForm()
