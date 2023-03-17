/**
 * Ouverture de la lightbox
 * @param {*} datas 
 */
function lightBoxOpen(datas) {
	const articles = datas.querySelectorAll("article")

	articles.forEach(element => {
		element.addEventListener("click", (e) => {
			getDataFromPhotographerPage(e)
		})
	})
}

/**
 * 
 * @returns On regarde si le select à changer l'ordre des vignettes
 */
function sortByHasChanged() {
	const targetNode = document.querySelector(".media-wrapper")
	const config = { attributes: true, childList: true }

	var callback = function(mutationsList) {
		for(var mutation of mutationsList) {
			if (mutation.type == "childList") {
				const mediaWrapper = document.querySelector(".media-wrapper")

				lightBoxOpen(mediaWrapper)
			}
		}
	}

	var observer = new MutationObserver(callback)
	observer.observe(targetNode, config)
}


/**
 * Pour fermer la lightbox
 */
function closeLightBox() {
	const lightBox = document.getElementById("lightbox")
	const img = document.getElementById("lightbox-image")
	const video = document.getElementById("lightbox-video")

	img.style.display = "block"
	video.style.display = "none"
	lightBox.style.display = "none"
	
}

/**
 * fermeture de la lightbox avec la croix au click
 */
function closeBtnLightBox() {
	const closeBtn = document.querySelector(".close-lightbox")
	closeBtn.addEventListener("click", (e) => {
		closeLightBox()
		mainNonVisible("block")
		tabindexLightBox("closed")
	})
}

/**
 * fermeture de la lightbox avec la touche echappe
 * 
 */
function escapeCloseLightBox() {
	document.addEventListener("keydown", e => {
		const keyCode = e.key ? e.key : e.code
		if (keyCode === "Escape") {
			closeLightBox()
			mainNonVisible("block")
			tabindexLightBox("closed")
			setTimeout(() => LightboxClosedFocus(e), 700)
		}
	})
}

/**
 * 
 * @param {*} visibility mettre le display du block pour l'afficher ou le cacher
 */
function mainNonVisible(visibility) {
	const main = document.querySelector("main")	
	main.style.display = visibility
}

/**
 * Navigation au clavier sur la page photographe quand une image est sélectionnée
 */
function keyboardNavigation() {
	document.addEventListener("keydown", (e) => {
		const keyCode = e.key ? e.key: e.code
		const focusElement = document.activeElement
		console.log(focusElement)

		if (keyCode === "Enter" && focusElement.tagName === "ARTICLE") {
			getDataFromPhotographerPage(e)
		} 

		// action pour la fléche retour	
		if (keyCode === "Enter" && document.activeElement.classList.contains("arrow-back")) {

			let mediaIdOnScreen = focusElement.parentNode.parentNode.dataset.mediaId
			console.log(keyCode)
			displayMediaLightbox(getPreviousMediasForNavigation(mediaIdOnScreen, "previous"))
		}

		if (keyCode === "Arrowleft") {
			console.log("arrow left")
		}

		// action pour la fléche suivant
		if (keyCode === "Enter" && document.activeElement.classList.contains("arrow-next")) {
			let mediaIdOnScreen = focusElement.parentNode.parentNode.dataset.mediaId
			displayMediaLightbox(getPreviousMediasForNavigation(mediaIdOnScreen, "next"))
		}

		if (keyCode === "Enter" && document.activeElement.classList.contains("close-lightbox")) {
			// action pour la croix
			closeLightBox()
			mainNonVisible("block")
			tabindexLightBox("closed")
			setTimeout(() => LightboxClosedFocus(e), 700)
		}
	})
}

function getPreviousMediasForNavigation(mediaId, arrowDirection) {
	const lightboxMediaId = document.getElementById("lightbox").dataset.mediaId
	const getArticleData = document.querySelector(`article[data-media-id="${mediaId}"]`)
	let scrMediaImg, scrMediaVideo, getPreviousMedia, getNextMedia, datas = {}, id

	if (arrowDirection === "previous") {
		getPreviousMedia = getArticleData.previousSibling
		scrMediaImg = getPreviousMedia?.querySelector("img")
		scrMediaVideo = getPreviousMedia?.querySelector("video source")
		id = getPreviousMedia.dataset.mediaId
		console.log(getPreviousMedia?.dataset.mediaId + " on Screen //", lightboxMediaId + " next media")
	}

	if (arrowDirection === "next") {
		getNextMedia = getArticleData.nextSibling
		scrMediaImg = getNextMedia?.querySelector("img")
		scrMediaVideo = getNextMedia?.querySelector("video source")
		id = getNextMedia.dataset.mediaId
		console.log(getNextMedia?.dataset.mediaId + " on Screen //", lightboxMediaId + " next media")
	}
	
	if(scrMediaImg) {
		datas = {
			srcImg: scrMediaImg.getAttribute("src"),
			textImg: scrMediaImg.getAttribute("alt"),
			activeArticleId: id,
			media: "image"
		}
	}
	if(scrMediaVideo) {
		datas = {
			srcVideo: scrMediaVideo.getAttribute("src"),
			activeArticleId: mediaId,
			media: "video"
		}
	}
	return datas
}

/**
 * Récupération des datas de la page photographe et ouverture de la lightbox
 * @param {*} e 
 */
function getDataFromPhotographerPage(e) {
	mainNonVisible("none")
	displayMediaLightbox(lightboxDatas())
	tabindexLightBox("open")
}

/**
 * Affichage des images dans la lightbox
 * @param {*} lightboxDatas On récupère les données de la page photographe
 */
function displayMediaLightbox(lightboxDatas) {
	const lightBox = document.getElementById("lightbox")
	const lightBoxImg = document.getElementById("lightbox-image") 
	const video = document.getElementById("lightbox-video")	
	const textImgP = document.getElementById("lightbox-text")

	console.log(lightboxDatas)
	if(lightboxDatas.media === "image") {
		lightBox.dataset.mediaId = lightboxDatas.activeArticleId
		lightBoxImg.setAttribute("src", lightboxDatas.srcImg)
		lightBox.style.display = "flex"
		lightBoxImg.setAttribute("alt", lightboxDatas.textImg)
		textImgP.textContent = lightboxDatas.textImg
		lightBoxImg.style.display = "block"
		video.style.display = "none"
		video.dataset.visible = "false"
	}	

	if(lightboxDatas.media === "video") {
		lightBox.dataset.mediaId = lightboxDatas.activeArticleId
		lightBox.style.display = "flex"
		textImgP.textContent = lightboxDatas.text
		lightBoxImg.style.display = "none"
		video.style.display = "block"
		video.setAttribute("src", lightboxDatas.srcVideo)
		video.dataset.visible = "true"
	}
}



/**
 * Données pour afficher la lightbox
 */
const lightboxDatas = function () {
	const activeArticle = document.activeElement
	const activeArticleId = activeArticle.dataset.mediaId
	const videoSrc = activeArticle
	const videoArticle = activeArticle.classList.contains("video")
	const videoText = videoSrc.getAttribute("data-infotext")
	let srcVideo = "", srcImg = "", textImg = "", media = ""

	if(videoArticle) {
		const source = videoSrc.querySelector("video source")
		srcVideo = source.getAttribute("src")
		// console.log(videoArticle)
		media = "video"
	}
	if(!videoArticle) {
		const img = activeArticle.querySelector("img")
		srcImg = img.getAttribute("src")
		textImg = img.getAttribute("alt")
		media = "image"
	}

	let	lightboxDatas = {
		activeArticleId,
		srcVideo,
		srcImg,
		videoText,
		textImg,
		media
	}

	return lightboxDatas
}

/**
 * Gestion du tabindex lors de l'ouverture de la lightbox
 * @param {*} event mettre si la lightbox est ouverte "open" ou fermé "closed"
 */
function tabindexLightBox(event){
	
	const btnClose = document.querySelector(".close-lightbox")
	const btnArrowBack = document.querySelector(".arrow-back")
	const btnArrowNext = document.querySelector(".arrow-next")
	let numberTabindex

	if (event === "open") {
		numberTabindex = 0
	}
	if (event === "closed") {
		numberTabindex = -1
	}

	btnClose.setAttribute("tabindex", numberTabindex)
	btnArrowBack.setAttribute("tabindex", numberTabindex)
	btnArrowNext.setAttribute("tabindex", numberTabindex)
}

/**
 * Gestion du focus après la fermeture de la lightbox avec echappe
 */
function LightboxClosedFocus() {
	const mediaId = document.getElementById("lightbox").dataset.mediaId
	console.log(mediaId)

	document.querySelector(`article[data-media-id="${mediaId}"]`).focus()
}

/**
 * Initiation des functions
 */
function init(){
	keyboardNavigation()
	escapeCloseLightBox()
	closeBtnLightBox()
	sortByHasChanged()
}

init()
