/**
 * 
 * @returns on récupère l'id du photographe
 */
function getIdParameter() {
	let params = (new URL(document.location)).searchParams
	let id = parseInt(params.get("id"), 10)
	return id
}

/**
 * On affiche les informations sur les photographes
 * @param {*} idPhotographer On récupère l'id du photographe pour afficher les données
 */
async function displayPhotographer(idPhotographer) {
	const photographerInfo = await getPhotographers("photographer")
	const header = document.querySelector(".photograph-header")
	const infos = photographerInfo.filter( info => info.id === idPhotographer)
	const info = infos[0]

	if (info !== undefined) {
		header.innerHTML = ` 
			<div className="photograph-infos">
				<h1>${info.name}</h1>
				<p>
					${info.city}, ${info.country}<br>
					${info.tagline}
				</p>
			</div>
			<button id="contact-me" tabindex="0" class="contact_button" onclick="displayModal()">Contactez-moi</button>
			<img src="assets/photographers/${info.portrait}" alt="${info.name}">
		`			
	}
}

/**
 *  On initialise les fonctions 
 */
async function init() {
	displayPhotographer(getIdParameter())
	displayMediaPhotographer(getIdParameter())
}
    
init()
			