// Ouverture de la lightbox
function lightBoxOpen(datas) {
	const articles = datas.querySelectorAll("article")
	
	articles.forEach(element => {
		element.addEventListener("click", (e) => {
			getDataFromPhotographerPage(e)
		})
	})
}

// Pour fermer la lightbox
function closeLightBox() {
	const lightBox = document.getElementById("lightbox")
	const img = document.getElementById("lightbox-image")
	const video = document.getElementById("lightbox-video")

	img.style.display = "block"
	video.style.display = "none"
	lightBox.style.display = "none"
	
}

// fermeture de la lightbox avec la croix
function closeBtnLightBox() {
	const closeBtn = document.querySelector(".close-lightbox")
	closeBtn.addEventListener("click", () => {
		closeLightBox()
		mainNonVisible("block")
	})
}

// fermeture de la lightbox avec la touche escape
function escapeCloseLightBox() {
	document.addEventListener("keydown", e => {
		const keyCode = e.key ? e.key : e.code
		if (keyCode === "Escape") {
			closeLightBox()
			mainNonVisible("block")
		}
	})
}

// Visibility = mettre le display du block
function mainNonVisible(visibility) {
	const main = document.querySelector("main")	
	main.style.display = visibility
}

// Navigation au clavier sur la page photographe quand une image est sélectionnée
function keyboardNavigation() {
	document.addEventListener("keydown", (e) => {
		const keyCode = e.key ? e.key: e.code
		const focusElement = document.activeElement.tagName
		
		if (keyCode === "Enter" && focusElement === "ARTICLE") {
			getDataFromPhotographerPage(e)
		} 
	})
}

// Récupération des datas de la page photographe
function getDataFromPhotographerPage(e) {
	const lightBoxImg = document.getElementById("lightbox-image")
	const lightBox = document.getElementById("lightbox")
	const activeArticle = document.activeElement
	const textImgP = document.getElementById("lightbox-text")

	mainNonVisible("none")

	if (activeArticle.classList.contains("video")){
		const videoSrc = activeArticle
		const videoText = videoSrc.getAttribute("data-infotext")
		const source = videoSrc.querySelector("source")
		const sourceSrc = source.getAttribute("src")			
		const video = document.getElementById("lightbox-video")

		lightBoxImg.style.display = "none"
		video.style.display = "block"
		video.setAttribute("src", sourceSrc)
		lightBox.style.display = "flex"
		textImgP.textContent = videoText
	} else {
		const img = activeArticle.querySelector("img")
		const srcImg = img?.getAttribute("src")
		const textImg = img?.getAttribute("alt")

		lightBox.style.display = "flex"
		lightBoxImg.setAttribute("src", srcImg)
		textImgP.textContent = textImg				
	}
}

// Initiation des functions
function init(){
	keyboardNavigation()
	escapeCloseLightBox()
	closeBtnLightBox()
}

init()
