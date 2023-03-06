async function getPhotographers() {
	const reponse = await fetch("http://127.0.0.1:5500/data/photographers.json")
	const photographers = await reponse.json()
	return photographers
}

async function displayData(photographers) {
	const photographersSection = document.querySelector(".photographer_section")

	photographers.forEach((photographer, tabIndex) => {
		const photographerModel = photographerFactory(photographer, tabIndex)
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
    
