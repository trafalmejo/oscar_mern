import axios from 'axios'
import { GET_PROJECTS, ADD_PROJECT, DELETE_PROJECT, EDIT_PROJECT, PROJECTS_LOADING} from './types'


export const getProjects = () => dispatch => {
    dispatch(setProjectsLoading())
    axios
        .get('/api/projects')
        .then(res => 
            dispatch({
                type: GET_PROJECTS,
                payload: res.data
            }))
}

export const deleteProject = (id) => dispatch => {
    axios
        .delete('/api/projects/'+id)
        .then(res => 
            dispatch({
                type: DELETE_PROJECT,
                payload: id
            }))
}
export const addProject = (project) => dispatch => {
    axios
        .post('/api/projects', project)
        .then(res => 
            dispatch({
                    type: ADD_PROJECT,
                    payload: res.data
            }))}
export const setProjectsLoading = () => {
    return {
        type: PROJECTS_LOADING,
    }
}
