import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";


const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({children}) => {

    // initial state for Reducer
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false,
    }
    // Reducer
    const [state, dispatch] = useReducer(githubReducer, initialState)

    //search users
    const searchUsers = async (text) => {
        setLoading()
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

        dispatch({
            type: 'GET_USERS',
            payload: items,
            loading: false,
        })
    }
    //get single user
    const getUser = async (login) => {
        setLoading()
    
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

            dispatch({
                type: 'GET_USER',
                payload: data,
                //loading: false,
        })
        }

        
    }

    // get user repositories
    const getUserRepos = async (login) => {
        setLoading()

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

        dispatch({
            type: 'GET_REPOS',
            payload: data,
            //loading: false,
        })
    }

    // clear users
    const clearUsers = () => dispatch({
        type: 'CLEAR_USERS'
    })


    // Set loading
    const setLoading = () => dispatch({
        type: 'SET_LOADING'
    })

    return <GithubContext.Provider value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        searchUsers,
        clearUsers,
        getUser,
        repos: state.repos,
        getUserRepos,
    }}> 
    
    {children} 
    
    </GithubContext.Provider>
}

export default GithubContext
