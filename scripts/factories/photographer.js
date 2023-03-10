function photographerFactory(data) {
	const { name, id, city, country, tagline, price, portrait } = data
	
	const picture = `assets/photographers/${portrait}`
	
	function getUserCardDOM() {
		const url = new URL(window.location.href)
		const originUrl = url.origin
		let urlLink

		if(originUrl === "https://erkomxtil.github.io") {
			urlLink = `${originUrl}/fisheye/photographer.html?id=${id}`
		} else {
			urlLink =  `${originUrl}/photographer.html?id=${id}`
		}
		
		const article = document.createElement( "article" )

		article.innerHTML = `
			<a href="${urlLink}" role="link">
				<figure>
					<img src="assets/photographers/${portrait}" alt=${name}>
				</figure>
				<h2>${name}</h2>
			</a>
			<h3>${city}, ${country}</h3>
			<p>
				${tagline}<br>
				<span>${price}€/jour</span>
			</p>
		`
		return (article)
	}
	return { name, picture, getUserCardDOM }
}

async function getPhotographers(type) {
	const url = new URL(window.location.href)
	const originUrl = url.origin
	let reponse 

	if (originUrl === "https://erkomxtil.github.io") {
		reponse = await fetch(`${originUrl}/fisheye/data/photographers.json`)
	} else {
		reponse = await fetch(`${originUrl}/data/photographers.json`)
	}

	if (type === "photographer") {
		const {photographers} = await reponse.json()
		return photographers
	}
	if (type === "media") {
		const {media} = await reponse.json()
		return media
	}
}