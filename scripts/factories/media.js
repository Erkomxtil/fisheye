/**
 * On affiche les médias des photographes photo et vidéos
 * @param {*} idPhotographer On récupère l'id pour avoir les bonnes données
 */
async function displayMediaPhotographer(idPhotographer){
	const mediasDatas = await getPhotographers("media")
	const mediasInfos = mediasDatas.filter(media => media.photographerId === idPhotographer)

	const photographerInfo = await getPhotographers("photographer")
	const infos = photographerInfo.filter( info => info.id === idPhotographer)
	
	const info = infos[0]

	const mediaWrapper = document.querySelector(".media-wrapper")
	const likes = mediasInfos.map(like => like.likes)
	let totalLikes = 0 

	if (likes.length > 0) {
		totalLikes = likes.reduce(
			(accumulateur, valeurCourante) => accumulateur + valeurCourante
		)
	}
	
	/* Affichage des vignettes au départ */
	let datas = sortMediaInfo(mediasInfos, "popularity")
	displayMedia(datas, mediaWrapper)

	/* Affichage des média avec le select */
	getDataType(mediaWrapper, mediasInfos)


	/* Affichage des média avec le select au clavier */
	keyboardNavigationChoiceOfSortBy(mediaWrapper, mediasInfos)

	/*  Affichage de la lightbox */
	lightBoxOpen(mediaWrapper)

	likePrice(totalLikes,info)
}

/**
 * Gestion des likes et des honoraires
 * @param {*} likes nombre de like
 * @param {*} info on récupère les donnés du tarif
 */
async function likePrice(likes, info) {
	const likePrice = document.querySelector(".like-price")
	const likePriceInfo = document.createElement("div")
	likePriceInfo.classList.add("like-price-wrapper")
	const price = await info.price !== undefined ? info.price: ""

	likePriceInfo.innerHTML = `
		<div className="like">${likes}❤</div><div className="price">${price}€/jour</div>
	`
	likePrice.appendChild(likePriceInfo)
}

/**
 * Affichage des vignettes
 * @param {*} datas données pour l'affichage des vignettes
 * @param {*} tabIndexNumber changement du tabindex
 * @param {*} mediaWrapper injection du code dans le dom
 */
function displayMedia(datas, mediaWrapper) {
	datas.forEach((info) => {
		const article = document.createElement("article")
		let imgVideo
		article.setAttribute("aria-haspopup", "true")
		article.setAttribute("tabindex", 0)
		article.dataset.mediaId = info.id
	

		if(info.image){
			article.classList.add("image-media")
			imgVideo = `<img data-navigation="true" src="assets/images/${info.image}" alt="${info.title}" aria-label="${info.title}">`
		} else {
			article.classList.add("video")
			imgVideo = `
			<video data-infoText="${info.title}" aria-label="${info.title}">
        <source src="assets/images/${info.video}" type="video/mp4">
      </video>
			`
		}
		article.innerHTML = `
			${imgVideo}
      <div class="info-media">
			  <h2 lang="en">${info.title}</h2><span>${info.likes} ❤</span>
      </div>
		`
		mediaWrapper.appendChild(article)
	})
}

/**
 * Tri des données selon le select
 * @param {*} dataInfo les données de base 
 * @param {*} selected Définit le choix du tri
 * @returns 
 */
function sortMediaInfo(dataInfo, selected) {
	let sortedData
	if (selected === "popularity") {
		sortedData = dataInfo.sort((a,b) => a.likes - b.likes)
	}
	if (selected === "title") {
		sortedData = dataInfo.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0)
	}
	if (selected === "date") {
		sortedData = dataInfo.sort((a, b) => new Date(b.date) - new Date(a.date))
	}
	return sortedData
}

/**
 * ouverture du select au click
 */
function selectOpened() {
	const btnSelect = document.getElementById("sort-by")
	const optionList = document.querySelector(".dropdown-options")
	
	btnSelect.addEventListener("click", () => {
		const options = document.querySelectorAll(".dropdown-options li")

		optionList.style.display = "block"
		btnSelect.style.display = "none"

		tabIndexNavigationOpen("tri")
		
		options.forEach( (e) => {
			e.setAttribute("aria-selected", "false")
		})
	})
}

/**
 * choix du tri via le clavier et enter
 */
function keyboardNavigationSelect() {
	document.addEventListener("keydown", (e) => {
		const keyCode = e.key ? e.key: e.code
		const focusElement = document.activeElement
		const btnSelect = document.getElementById("sort-by")
		const optionList = document.querySelector(".dropdown-options")
		const options = document.querySelectorAll(".dropdown-options li")
		
		if (keyCode === "Enter" && focusElement.id === "sort-by") {
			optionList.style.display = "block"
			btnSelect.style.display = "none"
		
			tabIndexNavigationOpen("tri")
	
			options.forEach( (e) => {
				e.setAttribute("aria-selected", "false")
			})
		} 

		if (keyCode === "Enter" && focusElement.role === "option") {
			let value = focusElement.dataset.value

			switch (value) {
			case "popularity":
				btnSelect.innerText ="Popularité"
				break
			case "date":
				btnSelect.innerText ="Date"
				break
			case "title":
				btnSelect.innerText ="Titre"
				break
			default:
				break
			}
			
			focusElement.setAttribute("aria-selected", "true")
			optionList.style.display = "none"
			btnSelect.style.display = "block"
			tabIndexNavigationClose("tri")

			setTimeout( () => btnSelect.focus(), 50)
		}
	})
}

/**
 * fermeture du select au click
 */
function selectClosedOnClick() {
	const options = document.querySelectorAll(".dropdown-options li")
	
	options.forEach( (option) => {
		option.addEventListener("click", (e) => {
			const optionList = document.querySelector(".dropdown-options")
			const btnSortBy = document.getElementById("sort-by")

			let textBtn = e.target.innerText
			btnSortBy.innerText = textBtn
			btnSortBy.dataset.value = e.target.dataset.value
		
			e.target.setAttribute("aria-selected", "true")
			optionList.style.display = "none"
			btnSortBy.style.display = "block"
			tabIndexNavigationClose("tri")
		})
	})
}

/**
 * selection du type de tri et affichage des médias
 * @param {*} mediaWrapper injection du code dans le dom
 * @param {*} mediasInfos information concernant les médias
 */
function getDataType(mediaWrapper, mediasInfos) {
	const btnSelects = document.querySelectorAll(".dropdown-options li")
	const btnSortBy = document.getElementById("sort-by")

	btnSelects.forEach(( btn) => {
		btn.addEventListener("click", () => {
			mediaWrapper.innerHTML = ""
			const dataType = btnSortBy.dataset.value
			let datas = sortMediaInfo(mediasInfos, dataType)

			displayMedia(datas, mediaWrapper)
			function getDatasFromPhotographer(datas) {
				return datas
			}
		})
	})
}

/**
 * Affichage des médias avec le select au clavier
 * @param {*} mediaWrapper On inject les médias dans la page
 * @param {*} mediasInfos On récupère les bon médias
 * @param {*} tabIndexNumber pour la tabulation au clavier
 */
function keyboardNavigationChoiceOfSortBy(mediaWrapper, mediasInfos) {
	document.addEventListener("keydown", (e) => {
		const keyCode = e.key ? e.key: e.code
		const focusElement = document.activeElement
		
		if(keyCode === "Enter" && (focusElement.id === "popularity-select" || focusElement.id === "date-select" || focusElement.id === "title-select")) {
			mediaWrapper.innerHTML = ""
			const dataType = focusElement.dataset.value
			let datas = sortMediaInfo(mediasInfos, dataType)
			
			displayMedia(datas, mediaWrapper)

		}
	})
}

/**
 * Initialisation des différentes fonction
 */
function initMedia() {
	selectOpened()
	selectClosedOnClick()
	keyboardNavigationSelect()
}

initMedia()




