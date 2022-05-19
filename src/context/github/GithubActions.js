const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN


//search users
export const searchUsers = async (text) => {

    // Use Github API to search users
    const params = new URLSearchParams({
        q: text
    })

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        }
    })
    // store the users searched in items
    const {items} = await response.json()

    return items
}


//get single user
export const getUser = async (login) => {

    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        }
    })
    if (response.status === 404) {
        window.location = '/notfound'
    } else {
        // store the users searched in items
        const data = await response.json()

        return data
    }

    
}

// get user repositories
export const getUserRepos = async (login) => {

    const params = new URLSearchParams({
        sort: 'created',
        per_page: 10
    })  

    const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        }
    })
    // store the users searched in items
    const data = await response.json()

    return data
}