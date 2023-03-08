//Mettre le code JavaScript lié à la page photographer.html
function getIdParameter() {
	let params = (new URL(document.location)).searchParams
	let id = parseInt(params.get("id"), 10)
	return id
}

async function displayPhotographer(idPhotographer) {
	const photographerInfo = await getPhotographers("photographer")
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
	displayMediaPhotographer(getIdParameter())

}
    
init()
			