import { getRequests, getPlumbers, sendRequest, saveCompletion, changeRequest } from "./dataAccess.js"
import { deleteRequest } from "./dataAccess.js"

const requestsHTML = (request) => {
    const plumbers = getPlumbers()
   if(request.completed === false) {
   return `
    <li>
        ${request.description}
        <select class="plumbers" id="plumbers">
    <option value="">Choose</option>
    ${
        plumbers.map(
            plumber => {
                return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`
            }
        ).join("")
    }
</select>   
        <button class="request__delete"
                id="request--${request.id}">
            Delete
        </button>
    </li>
`} else {
    return `
    <li class ="complete">
        ${request.description}
        <button class="request__delete"
                id="request--${request.id}">
            Delete
        </button>
    </li>`
}
}

export const Requests = () => {
    const requests = getRequests()
    let html = `
        <ul>
            ${
                requests.map(requestsHTML).join("")
            }
            
        </ul>
    `

    return html
}

const mainContainer = document.querySelector("#container")

mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const [,requestId] = click.target.id.split("--")
        deleteRequest(parseInt(requestId))
    }
})

mainContainer.addEventListener(
    "change",
    (event) => {
        if (event.target.id === "plumbers") {
            const [requestId, plumberId] = event.target.value.split("--")
            
            /*
                This object should have 3 properties
                   1. requestId
                   2. plumberId
                   3. date_created
            */
            const completion = {
                requestId: requestId, 
                plumber: plumberId,
                date_created: new Date()
             }

             saveCompletion(completion)

            /*
                Invoke the function that performs the POST request
                to the `completions` resource for your API. Send the
                completion object as a parameter.
             */
                const requests = getRequests()
                for (const request of requests){
                    if(request.id === parseInt(requestId)){
                        const requestComplte = {
                            completed: true, 
                            plumber: plumberId, 
                            date_completed: new Date().toLocaleDateString()
                        }
                        changeRequest(requestComplte, request.id)
                    }
                }
        }
    }
)