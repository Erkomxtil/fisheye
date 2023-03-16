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
			setTimeout(() => LightboxClosedFocus(e), 1000)
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
		const focusElement = document.activeElement.tagName
		
		if (keyCode === "Enter" && focusElement === "ARTICLE") {
			getDataFromPhotographerPage(e)
		} 
	})
}

/**
 * Récupération des datas de la page photographe et ouverture de la lightbox
 * @param {*} e 
 */
function getDataFromPhotographerPage(e) {
	const lightBoxImg = document.getElementById("lightbox-image")
	const video = document.getElementById("lightbox-video")
	const lightBox = document.getElementById("lightbox")
	const activeArticle = document.activeElement
	const textImgP = document.getElementById("lightbox-text")

	mainNonVisible("none")

	if (activeArticle.classList.contains("video")){
		const videoSrc = activeArticle
		const videoText = videoSrc.getAttribute("data-infotext")
		const videoId = videoSrc.dataset.mediaId
		const source = videoSrc.querySelector("source")
		const sourceSrc = source.getAttribute("src")			

		lightBoxImg.style.display = "none"
		video.style.display = "block"
		video.setAttribute("src", sourceSrc)
		video.dataset.mediaId = videoId
		lightBox.style.display = "flex"
		textImgP.textContent = videoText
		video.dataset.visible="true"
	} else {
		video.dataset.visible="false"
		const img = activeArticle.querySelector("img")
		const imgId = img?.parentElement.dataset.mediaId
		const srcImg = img?.getAttribute("src")
		const textImg = img?.getAttribute("alt")

		lightBox.style.display = "flex"
		lightBoxImg.setAttribute("src", srcImg)
		lightBoxImg.dataset.mediaId = imgId
		textImgP.textContent = textImg				
	}

	tabindexLightBox("open")
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
	const imgLightbox = document.getElementById("lightbox-image")
	const videoLightbox = document.getElementById("lightbox-video")
	const img = imgLightbox.dataset.mediaId
	const video = videoLightbox.dataset.mediaId
	console.log(video + " video", img + " img", videoLightbox.style.display)
	let data
	if (img !== undefined && videoLightbox.dataset.visible === "false") {
		data = img
	} 
	if (video !== undefined && videoLightbox.dataset.visible === "true"){
		data = video
	}

	document.querySelector(`article[data-media-id="${data}"]`).focus()
}

/**
 * Initiation des functions
 */
function init(){
	keyboardNavigation()
	escapeCloseLightBox()
	closeBtnLightBox()
}

init()
