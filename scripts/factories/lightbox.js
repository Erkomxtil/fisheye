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

function MouseNavigation() {
	const arrowBack = document.querySelector(".arrow-back")
	const arrowNext = document.querySelector(".arrow-next")

	arrowBack.addEventListener("click", (e) => {
		let mediaIdOnScreen = e.target.parentNode.parentNode.dataset.mediaId
		displayMediaLightbox(getMediaForLightboxNavigation(mediaIdOnScreen, "previous"))
	})

	arrowNext.addEventListener("click", (e) => {
		let mediaIdOnScreen = e.target.parentNode.parentNode.dataset.mediaId
		displayMediaLightbox(getMediaForLightboxNavigation(mediaIdOnScreen, "next"))
	})
}

/**
 * Navigation au clavier sur la page photographe quand une image est sélectionnée
 */
function keyboardNavigation() {
	document.addEventListener("keydown", (e) => {
		e.stopPropagation()
		const keyCode = e.key ? e.key: e.code
		const focusElement = document.activeElement
		const lightboxDisplay = document.getElementById("lightbox")

		if (keyCode === "Enter" && focusElement.tagName === "ARTICLE") {
			getDataFromPhotographerPage(e)
		} 

		if (keyCode === "Enter" && document.activeElement.classList.contains("arrow-back")) {
			let mediaIdOnScreen = focusElement.parentNode.parentNode.dataset.mediaId
			displayMediaLightbox(getMediaForLightboxNavigation(mediaIdOnScreen, "previous"))
		}

		if (keyCode === "Enter" && document.activeElement.classList.contains("arrow-next")) {
			let mediaIdOnScreen = focusElement.parentNode.parentNode.dataset.mediaId
			displayMediaLightbox(getMediaForLightboxNavigation(mediaIdOnScreen, "next"))
		}

		if(lightboxDisplay.getAttribute("style") === "display: flex;"){
			if (keyCode === "ArrowLeft") {
				let mediaIdOnScreen = lightboxDisplay.dataset.mediaId
				displayMediaLightbox(getMediaForLightboxNavigation(mediaIdOnScreen, "previous"))
			}
			
			if (keyCode === "ArrowRight") {	
				let mediaIdOnScreen = lightboxDisplay.dataset.mediaId
				displayMediaLightbox(getMediaForLightboxNavigation(mediaIdOnScreen, "next"))
			}
		}

		if (keyCode === "Enter" && document.activeElement.classList.contains("close-lightbox")) {
			closeLightBox()
			mainNonVisible("block")
			tabindexLightBox("closed")
			setTimeout(() => LightboxClosedFocus(e), 700)
		}
	})
}

function getMediaForLightboxNavigation(mediaId, arrowDirection) {
	let getArticleData = document.querySelector(`article[data-media-id="${mediaId}"]`)
	let scrMediaImg, scrMediaVideo, getPreviousMedia, getNextMedia, datas = {}, id, scrMediaVideoText 
	const arrowNext = document.querySelector(".arrow-next")
	const arrowBack = document.querySelector(".arrow-back")
	
	if (arrowDirection === "previous") {
		arrowNext.style.opacity = "1"
		getPreviousMedia = getArticleData?.previousSibling
		scrMediaImg = getPreviousMedia?.querySelector("img")
		scrMediaVideo = getPreviousMedia?.querySelector("video source")
		id = getPreviousMedia?.dataset.mediaId

		if (id === undefined) {
			arrowBack.style.opacity = "0.2"
		}
	}

	if (arrowDirection === "next") {
		arrowBack.style.opacity = "1"
		getNextMedia = getArticleData?.nextSibling
		scrMediaImg = getNextMedia?.querySelector("img")
		scrMediaVideo = getNextMedia?.querySelector("video source")
		scrMediaVideoText = getNextMedia?.querySelector("#lightbox-text")
		id = getNextMedia?.dataset.mediaId

		if (id === undefined) {
			arrowNext.style.opacity = "0.2"
		}
	}

	let media = scrMediaImg ? "image" : scrMediaVideo ? "video" : ""

	datas = {
		activeArticleId: id,
		srcImg: scrMediaImg?.getAttribute("src"),
		textImg: scrMediaImg?.getAttribute("alt"),
		srcVideo: scrMediaVideo?.getAttribute("src"),
		videoText: scrMediaVideoText,
		media: media
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
	const videoText = document.querySelector("video").dataset.infotext
	
	if(lightboxDatas.media === "image") {
		lightBox.dataset.mediaId = lightboxDatas.activeArticleId
		lightBox.style.display = "flex"

		lightBoxImg.setAttribute("src", lightboxDatas.srcImg)
		lightBoxImg.setAttribute("alt", lightboxDatas.textImg)
		textImgP.textContent = lightboxDatas.textImg
		lightBoxImg.style.display = "block"
		video.style.display = "none"
		video.dataset.visible = "false"
	}	
	
	if(lightboxDatas.media === "video") {
		lightBox.dataset.mediaId = lightboxDatas.activeArticleId
		lightBox.style.display = "flex"
		textImgP.textContent = videoText
		video.setAttribute("src", lightboxDatas.srcVideo)
		lightBoxImg.style.display = "none"
		video.style.display = "block"
		video.dataset.visible = "true"
	}
}

/**
 * Données pour afficher la lightbox aux clavier
 */
const lightboxDatas = function () {
	const activeArticle = document.activeElement
	let activeArticleId = activeArticle.dataset.mediaId
	const videoSrc = activeArticle
	const videoArticle = activeArticle.classList.contains("video")
	const source = videoSrc.querySelector("video source")
	const videoInfoText = videoSrc.querySelector("video")
	const img = activeArticle.querySelector("img")
	const media = videoArticle ? "video": "image"
	
	const srcVideo = source?.getAttribute("src")
	const srcImg = img?.getAttribute("src")
	const videoText = videoInfoText?.dataset.infotext 
	const textImg = img?.getAttribute("alt")
	
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
	MouseNavigation()
}

init()