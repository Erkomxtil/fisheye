/* no-unused-vars displayMediaPhotographer */
async function displayMediaPhotographer(idPhotographer){
	const mediasDatas = await getPhotographers("media")
	const photographerInfo = await getPhotographers("photographer")
	const infos = photographerInfo.filter( info => info.id === idPhotographer)
	const info = infos[0]
	const mediaWrapper = document.querySelector(".media-wrapper")
	const mediasInfos = mediasDatas.filter(media => media.photographerId === idPhotographer)
	const likes = mediasInfos.map(like => like.likes)
	let totalLikes = 0 
	let tabIndexNumber = 3

	if (likes.length > 0) {
		totalLikes = likes.reduce(
			(accumulateur, valeurCourante) => accumulateur + valeurCourante
		)
	}
	mediasInfos.forEach((info) => {
		tabIndexNumber++
		const article = document.createElement("article")
		article.setAttribute("aria-haspopup", "true")
		article.setAttribute("tabindex", tabIndexNumber)
	
		let imgVideo
		if(info.image){
			article.classList.add("image-media")
			imgVideo = `<img data-navigation="true" src="assets/images/${info.image}" alt="${info.title}" />`
		} else {
			article.classList.add("video")
			imgVideo = `
			<video data-infoText="${info.title}">
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
	
	lightBoxOpen(mediaWrapper)

	likePrice(totalLikes,info)
}


async function likePrice(likes, info) {
	const likePrice = document.querySelector(".like-price")
	const likePriceInfo = document.createElement("div")
	likePriceInfo.classList.add("like-price-wrapper")
	const price = info?.price !== undefined ? info.price: ""

	likePriceInfo.innerHTML = `
		<div className="like">${likes}❤</div><div className="price">${price}€/jour</div>
	`
	likePrice.appendChild(likePriceInfo)
}

