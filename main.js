const inputBook = document.getElementById("inputBook")
inputBook.addEventListener("submit", handleSubmitInputBook)



let bookShelf = JSON.parse(localStorage.getItem("book-shelf")) || []

// get the data from localstorage
// if bookShelf does exist(i.e. not equal to null or undefined)
if(bookShelf){
  for(let i=0; i<bookShelf.length; i++){
    const bookStatusCard = createBookStatusCard(bookShelf[i])
    bookStatusCard.addEventListener("click",e => handleActionBookStatusCard(e,"BOOKSHELF"))
    moveCompleteIsBookBookShelf(bookStatusCard, bookShelf[i].isComplete)
  }
}

// search-options-btn toggle
{
  const searchOptionsBtn = document.querySelector(".search-options-btn")
  searchOptionsBtn.addEventListener("click", function(){
    this.nextElementSibling.classList.toggle("d-block")
  })
}


//  search section
{
  const searchBook = document.getElementById("searchBook")
  const searchOptions = document.querySelector(".search-options").children
  const searchBookInput = document.getElementById("searchBookInput")
  const searchResult = document.querySelector(".search-result")

  const search = {
    nameTobeSearched:"", // name of the author, name of the title
    searchBy:"" // author,title
  }
  searchBook.addEventListener("submit", handleSearchBook)
  
  searchBookInput.addEventListener("change", e => search.nameTobeSearched = e.target.value)
  
  for(let i=0; i<searchOptions.length; i++){
    searchOptions[i].addEventListener("click", e => {
      const value = e.target.dataset.searchOption 
      const searchOptionsBtn = document.querySelector('.search-options-btn')
      searchOptionsBtn.textContent = value
      search.searchBy = value
    })
  }


  function handleSearchBook(e){
    // if the user previously already search for something, clear it first.
    // good read: https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    if(searchResult.childElementCount>0) searchResult.replaceChildren()
    e.preventDefault()
    console.log(search);
    bookShelf.forEach(book => {
      // "searchBy" is for the "key" (of localstorage)
      // "nameTobeSearched" is for the "value" (of localstorage)
      if(book[search.searchBy] === search.nameTobeSearched){
        const bookStatusCard = createBookStatusCard(book)
        setStatusBookIsComplete(bookStatusCard,book.isComplete)
        bookStatusCard.addEventListener("click",e => handleActionBookStatusCard(e,"SEARCH-RESULT"))
        searchResult.insertBefore(bookStatusCard,searchResult.children[0])
      }
    })
    // if nothing found
    if(searchResult.childElementCount===0){
      const h1 = document.createElement("h1")
      h1.textContent = `${search.nameTobeSearched} is not found`
      searchResult.appendChild(h1)
    }
  }

}


// good read: https://www.w3schools.com/js/js_object_constructors.asp
function BookData(title,author,year,isComplete){
  this.id = new Date().getTime()
  this.title = title
  this.author = author
  this.year = year
  this.isComplete = isComplete
}

// good read: https://stackoverflow.com/questions/3547035/getting-html-form-values
function handleSubmitInputBook(e){
  e.preventDefault()
  const elements = e.target.elements
  const bookData = new BookData("","",null,null)

  for(let i=0; i<elements.length; i++){
    const item = elements.item(i)
    if(item.tagName==="INPUT"){
      if(item.id==="isComplete"){
        bookData[item.id] = item.checked
        continue
      }
      bookData[item.id] = item.value
    }
  }
  console.log("book data form: ",bookData)
  bookShelf.push(bookData)
  localStorage.setItem('book-shelf', JSON.stringify(bookShelf))

  const bookStatusCard = createBookStatusCard(bookData)
  moveCompleteIsBookBookShelf(bookStatusCard, bookData.isComplete)
  bookStatusCard.addEventListener("click",e => handleActionBookStatusCard(e,"BOOKSHELF"))
}

// good read:
// https://stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
function handleActionBookStatusCard(e,type){
  const target = e.target
  const bookItemBox = target.closest(".book-item-box")
  console.log(type);
  switch(type){
    case "SEARCH-RESULT":
      if(target.classList.contains("isCompleteBtn")){
        const bookItemBoxClone = bookItemBox.cloneNode(true)
        bookShelf.forEach(book => {
          book.isComplete = !book.isComplete
          setStatusBookIsComplete(bookItemBox,book.isComplete)
          moveCompleteIsBookSearchResult(bookItemBoxClone, !book.isComplete)
        })
        console.log(bookItemBox);
      }else if(target.classList.contains("delete-status-book")){
        bookShelf = bookShelf.filter(book => book.id != bookItemBox.dataset.id)
        const bookItemBoxes = document.querySelectorAll(`article[data-id="${bookItemBox.dataset.id}"]`)
        console.log(bookItemBoxes);
        bookItemBoxes.forEach(bookItemBox => bookItemBox.remove())
      }
      break
    ;

    case "BOOKSHELF":
      console.log(bookItemBox);
      if(target.classList.contains("isCompleteBtn")){
        console.log(target)
        bookShelf.forEach(book => {
          if(book.id==bookItemBox.dataset.id){
            console.log(book.isComplete," ==> ",!book.isComplete)
            book.isComplete = !book.isComplete
            moveCompleteIsBookBookShelf(bookItemBox, book.isComplete)
          }
        })
      }
      // delete book + localstorage
      else if(target.classList.contains("delete-status-book")){
        console.log(target)
        bookShelf = bookShelf.filter(book => book.id != bookItemBox.dataset.id)
        bookItemBox.remove()
      }

      break
    ;

    default:
      return
    ;


  }
    
  localStorage.setItem('book-shelf', JSON.stringify(bookShelf))
}


function setStatusBookIsComplete(bookStatusCard,isComplete){
  console.log(bookStatusCard);
  const isCompleteBtn = bookStatusCard.querySelector(".isCompleteBtn")
  isCompleteBtn.style.backgroundColor = isComplete ? "#c0c0c0" : "#1cdc1c"
  isCompleteBtn.textContent = isComplete ? "belum dibaca" : "Selesai dibaca"
}


function moveCompleteIsBookBookShelf(bookStatusCard,isComplete){
  setStatusBookIsComplete(bookStatusCard,isComplete)
  if(isComplete){
    const completeBookshelfList = document.getElementById("completeBookshelfList")
    completeBookshelfList.insertBefore(bookStatusCard,completeBookshelfList.children[1])
  }else{
    const incompleteBookShelfList = document.getElementById("incompleteBookshelfList")
    incompleteBookShelfList.insertBefore(bookStatusCard,incompleteBookShelfList.children[1])
  }
}


function moveCompleteIsBookSearchResult(bookItemBoxClone, isCompleteStatusOriginal){
  setStatusBookIsComplete(bookItemBoxClone,!isCompleteStatusOriginal)
  const incompleteBookShelfList = document.getElementById("incompleteBookshelfList")
  const completeBookshelfList = document.getElementById("completeBookshelfList")

  if(isCompleteStatusOriginal){
    const children = completeBookshelfList.children
    for(let i=1; i<children.length; i++){
      const child = children[i]
      if(child.dataset.id===bookItemBoxClone.dataset.id){
        child.remove()
        incompleteBookShelfList.insertBefore(bookItemBoxClone, incompleteBookShelfList[0])
      }
    }
  }else{
    const children = incompleteBookShelfList.children
    console.log(children);
    for(let i=1; i<children.length; i++){
      const child = children[i]
      if(child.dataset.id===bookItemBoxClone.dataset.id){
        child.remove()
        completeBookshelfList.insertBefore(bookItemBoxClone, completeBookshelfList[0])
      }
    }
  }
}

function createBookStatusCard({id,title,author,year}){
  const article = document.createElement("article")
  article.setAttribute("data-id",id)
  article.classList.add("book-item-box")
  article.innerHTML = `
    <h3>${title}</h3>
    <p>Author: ${author}</p>
    <p>Year: ${year}</p>

    <div class="action">
      <button class="btn isCompleteBtn"></button>
      <button class="btn btn-danger delete-status-book">Hapus buku</button>
    </div>
  `
  return article
}
