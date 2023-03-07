//Mettre le code JavaScript lié à la page photographer.html
async function getPhotographers() {
	const url = new URL(window.location.href)
	const originUrl = url.origin
	let reponse
	
	if (originUrl === "https://erkomxtil.github.io") {
		reponse = await fetch(`${originUrl}/fisheye/data/photographers.json`)
	} else {
		reponse = await fetch(`${originUrl}/data/photographers.json`)
	}

	const media = await reponse.json()
	return media
}

function getIdParameter() {
	let params = (new URL(document.location)).searchParams
	let id = parseInt(params.get("id"), 10)
	return id
}


async function photographersMediasFactory(type) {
	if (type === "photographer") {
		const { photographers } = await getPhotographers()
		return photographers
	}

	// if (type === "media") {
	// 	const { media } = await getPhotographers()
	// 	return media
	// }
}


async function displayPhotographer(idPhotographer) {
	const photographerInfo = await photographersMediasFactory("photographer")
	const header = document.querySelector(".photograph-header")
	const infos = photographerInfo.filter( info => info.id === idPhotographer)
	const info = infos[0]

	header.innerHTML = ` 
		<div className="photograph-infos">
			<h1>${info.name}</h1>
			<p>
				${info.city}, ${info.country}<br>
				${info.tagline}
			</p>
		</div>
		<button class="contact_button" onclick="displayModal()">Contactez-moi</button>
		<img src="assets/photographers/${info.portrait}" alt="${info.name}">
	`		
}


async function init() {
// Récupère les datas des photographes
	displayPhotographer(getIdParameter())

}
    
init()
			