async function getPhotographers() {
	const url = new URL(window.location.href)
	const originUrl = url.origin
	let reponse 

	if (originUrl === "https://erkomxtil.github.io") {
		reponse = await fetch(`${originUrl}/fisheye/data/photographers.json`)
	} else {
		reponse = await fetch(`${originUrl}/data/photographers.json`)
	}
	const photographers = await reponse.json()
	return photographers
}

async function displayData(photographers) {
	const photographersSection = document.querySelector(".photographer_section")

	photographers.forEach((photographer) => {
		const photographerModel = photographerFactory(photographer)
		const userCardDOM = photographerModel.getUserCardDOM()
		photographersSection.appendChild(userCardDOM)
	})
}

async function init() {
// Récupère les datas des photographes
	const { photographers } = await getPhotographers()
	displayData(photographers)
}
    
init()
    
