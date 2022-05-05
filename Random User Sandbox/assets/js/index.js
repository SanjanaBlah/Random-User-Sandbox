const API_URL = 'https://randomuser.me/api'
const personContainer = document.getElementById('person-cards')


/**
 * Lets make 2 copies of our data.
 * 'originalData' should not be modified when filtering or sorting.
 * 
 * These 2 copies will ensure that we can retrieve the original data after filtering it
 */
let originalData = []
let data = []

/**
 * This function will fetch data from randomuser.me API and store it in 
 * variables 'data' and 'originalData'
 */
async function fetchData (count) {
  // Count should not be a negative number
  if (count >= 0) {
    // Check if the provided count is greater than the amount of data we already have.
    // If it is greater, then we will have to fetch new data from the API.
    // Otherwise we can simply use our existing data
    if (count > originalData.length) {
      const response = await fetch(API_URL + '?results=' + count)
      const jsonResponse = await response.json()

      originalData = jsonResponse.results

      console.log(originalData)
    }

    // 'slice' will give us an array starting from the 2nd element till 'count'
    // This will help in displaying only the number of people that we want. 
    // 
    // Suppose 'originalData' contains 25 elements and 'count' is 21. The below code will
    // give us an array starting from 1st element till 21st element.
    // So the total number of elements in 'data' will be 20
    data = originalData.slice(0, count)
  }
}

/**
 * This function will set the greeting for a random user generated using API
 */
async function setGreeting () {
  // If we don't provide '?results=' in fetch, then we get data for a single person
  const response = await fetch(API_URL)
  const jsonResponse = await response.json()

  const person = jsonResponse.results[0]

  const greetingTag = document.getElementById('greeting')
  greetingTag.innerText = 'Welcome, ' + person.name.first + ' ' + person.name.last
}

/**
 * This function will display the data present in the variable 'data'
 */
function displayData () {
  // Clear the contents of 'personContainer' before setting new data to avoid duplication
  personContainer.innerHTML = ""

  // Iterate over every element in variable 'data' and create card for them
  for (const personData of data) {
    createPersonCard(personData)
  }
}

/**
 * This function will create a extra information div
 * We can display things like age, dob, gender, etc using this
 * The first parameter 'title' will be displayed on first line
 * The second parameter 'value' will be displayed on second line
 */
function createCardBottom (title, value) {
  const container = document.createElement('div')
  container.classList.add('card_bottom')

  const innerContainer = document.createElement('div')

  const titleTag = document.createElement('p')
  titleTag.innerText = title

  const valueTag = document.createElement('p')
  valueTag.innerText = value

  innerContainer.append(titleTag)
  innerContainer.append(valueTag)

  container.append(innerContainer)

  return container
}

/**
 * This function will create a card for the person provided as a parameter
 */
function createPersonCard (personData) {
  const personCard = document.createElement('div')
  personCard.classList.add('person_card')
  personCard.style.backgroundColor = getRandomColor()

  const nameTag = document.createElement('h2')
  nameTag.innerText = personData.name.title + ' ' + personData.name.first + ' ' + personData.name.last

  const placeTag = document.createElement('h4')
  placeTag.innerText = personData.location.city + ', ' + personData.location.country

  const personImage = document.createElement('img')
  personImage.src = personData.picture.large

  personCard.append(nameTag)
  personCard.append(placeTag)
  personCard.append(personImage)

  const emailTag = createCardBottom("Email:", personData.email)
  personCard.append(emailTag)

  const ageTag = createCardBottom("Age:", personData.dob.age)
  personCard.append(ageTag)

  const bdayTag = createCardBottom("DOB:", new Date(personData.dob.date).toLocaleDateString())
  personCard.append(bdayTag)

  const locationTag = createCardBottom("Gender:", personData.gender)
  personCard.append(locationTag)

  const phoneTag = createCardBottom("Phone:", personData.phone)
  personCard.append(phoneTag)

  personContainer.append(personCard)
}

/**
 * This function will setup the buttons and input tags used for filters
 */
function setupFilters () {
  const personCountInput = document.getElementById('people-count')
  personCountInput.addEventListener('input', (e) => {
    const count = e.target.value
    fetchData(count).then(function () {
      displayData()
    })
  })


  const showAll = document.getElementById('filter-show-all')
  showAll.onclick = function () {
    data = originalData
    displayData()
  }

  const showMale = document.getElementById('filter-show-male')
  showMale.onclick = function () {
    // This will filter 'originalData' and return only the people having their gender as 'male'
    //
    // The filter function will select elements from an array only if the function provided returns true.
    // Since our function only returns true if the gender is 'male' and otherwise false, this will allow us to filter 
    // our 'originalData' to show only people with gender as 'male' and store it inside 'data'
    data = originalData.filter(function (val) { return val.gender === 'male' })
    displayData()
  }

  const showFemale = document.getElementById('filter-show-female')
  showFemale.onclick = function () {
    // This will filter 'originalData' and return only the people having their gender as 'female'
    data = originalData.filter(function (val) { return val.gender === 'female' })
    displayData()
  }

  const sortFirstName = document.getElementById('filter-sort-first-name')
  sortFirstName.onclick = function () {
    // This will sort 'originalData' on the property 'name.first'
    // localeCompare will help us sort the data by comparing 2 strings
    //
    // The sort function will compare all elements in an array. If its compare function return 0, that indicates that
    // the elements are equal. If it return -1, then then first element is smaller than second. If it returns 1 then
    // the first element is larger than the second.
    //
    // localeCompare will check if the string is alphabetically smaller or larger internally and 
    // return appropriate value of - 1, 0, 1
    data = originalData.sort(function (a, b) { return a.name.first.localeCompare(b.name.first) })
    displayData()
  }

  const sortLastName = document.getElementById('filter-sort-last-name')
  sortLastName.onclick = function () {
    // This will sort 'originalData' on the property 'name.last'
    data = originalData.sort(function (a, b) { return a.name.last.localeCompare(b.name.last) })
    displayData()
  }

  const sortAge = document.getElementById('filter-sort-age')
  sortAge.onclick = function () {
    // This will sort 'originalData' on the property 'dob.age'
    data = originalData.sort(function (a, b) { return a.dob.age - b.dob.age })
    displayData()
  }

  const sortCity = document.getElementById('filter-sort-city')
  sortCity.onclick = function () {
    // This will sort 'originalData' on the property 'location.city'
    data = originalData.sort(function (a, b) { return a.location.city.localeCompare(b.location.city) })
    displayData()
  }
}

// https://stackoverflow.com/a/20129594
function getRandomColor () {
  const hue = Math.floor(Math.random() * 1000) * 137.508; // use golden angle approximation
  return `hsl(${hue},40%,55%)`;
}

// Set greeting for a random person
setGreeting().then(() => {
  // Initially fetch 20 people
  fetchData(20).then(() => {
    // After fetching is done, set other details
    displayData()
    setupFilters()
  })
})