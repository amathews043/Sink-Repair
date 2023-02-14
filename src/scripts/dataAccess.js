const applicationState = {
    requests: [], 
}

const mainContainer = document.querySelector("#container")

const API = "http://localhost:8088"

export const getRequests = () => {
    const requestsArray = applicationState.requests.map(request => ({...request}))
    requestsArray.sort(function(x, y) {
        return (x.completed === y.completed)? 0 : x.completed? 1 : -1
    })
    return requestsArray
}

export const getPlumbers = () => {
    return applicationState.plumbers.map(plumber => ({...plumber}))
}


export const fetchRequests = () => {
    return fetch(`${API}/requests`)
        .then(response => response.json())
        .then(
            (data) => {
                // Store the external state in application state
                applicationState.requests = data
            }
        )
}

export const fetchPlumbers = () => {
    return fetch(`${API}/plumbers`)
        .then(response => response.json())
        .then(
            (data) => {
                applicationState.plumbers = data
            }
        )
}

export const sendRequest = (userServiceRequest) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userServiceRequest)
    }


    return fetch(`${API}/requests`, fetchOptions)
    .then(response => response.json())
    .then(() => {
        mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
    })
}

export const saveCompletion = (request) => {
    const fetchOptions = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    }
    return fetch(`${API}/completions`, fetchOptions)
    .then(response => response.json())
    .then(() => {
        mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
    })
}

export const changeRequest = (userServiceRequest, ID) => {
    const fetchOptions = {
        method: "PATCH", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userServiceRequest)
    }

    return fetch(`${API}/requests/${ID}`, fetchOptions)
    .then(response => response.json())
    .then(() => {
        mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
    })
}

export const fetchCompletions = () =>{
    return fetch(`${API}/completions`)
        .then(response => response.json())
        .then(
            (data) => {
                // Store the external state in application state
                applicationState.completions = data
            }
        )
}


export const deleteRequest = (id) => {
    return fetch(`${API}/requests/${id}`, { method: "DELETE" })
        .then(
            () => {
                mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
            }
        )
}
