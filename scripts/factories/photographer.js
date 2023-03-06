function photographerFactory(data) {
	const { name, id, city, country, tagline, price, portrait } = data

	const picture = `assets/photographers/${portrait}`

	function getUserCardDOM() {
		const article = document.createElement( "article" )

		article.innerHTML = `
			<p>
				<a href="" data-id=${id}>
					<figure>
						<img src="assets/photographers/${portrait}" alt=${name}>
					</figure>
					<h2>${name}</h2>
				</a>
			</p>
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