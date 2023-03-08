async function displayMediaPhotographer(idPhotographer){
	const mediasDatas = await getPhotographers("media")
	const photographerInfo = await getPhotographers("photographer")
	const infos = photographerInfo.filter( info => info.id === idPhotographer)
	const info = infos[0]
	const mediaWrapper = document.querySelector(".media-wrapper")
	const mediasInfos = mediasDatas.filter(media => media.photographerId === idPhotographer)
	const likes = mediasInfos.map(like => like.likes)
	const totalLikes = likes.reduce(
		(accumulateur, valeurCourante) => accumulateur + valeurCourante
	)
	console.log(totalLikes)

	mediasInfos.forEach(info => {
		const article = document.createElement("article")
		let imgVideo
		if(info.image){
			imgVideo = `<img src="assets/images/${info.image}" alt="${info.title}" />`
		} else {
			imgVideo = `
			<video controls="" width="350" height="auto">
        <source src="assets/images/${info.video}" type="video/mp4">
      </video>
			`
		}
		article.innerHTML = `
			${imgVideo}
      <div class="info-media">
			  <h2>${info.title}</h2><span>${info.likes} ❤</span>
      </div>
		`
		mediaWrapper.appendChild(article)
	})

	likePrice(totalLikes,info)
}


async function likePrice(likes, info) {
	const likePrice = document.querySelector(".like-price")
	const likePriceInfo = document.createElement("div")
	likePriceInfo.classList.add("like-price-wrapper")

	likePriceInfo.innerHTML = `
		<div className="like">${likes}❤</div><div className="price">${info.price}€/jour</div>
	`
	likePrice.appendChild(likePriceInfo)
}