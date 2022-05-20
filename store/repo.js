import { Octokit } from "octokit"

export const state = () => {
    return {
        tags: [],
        files: [],
    }
}

export const mutations = {

    setTags(state, tags) {
        state.tags = tags
    },

    setFiles(state, files) {
        state.files = files
    }
}

export const actions = {

    async getTags({ commit }, { owner, repo, pat }) {

        const octokit = new Octokit({
            auth: pat
        })

        let tags = await octokit.request('GET /repos/{owner}/{repo}/tags', { owner, repo })
        commit('setTags', tags.data)
        console.log(tags)
    },

    async getFiles({ commit }, { owner, repo, pat, path, ref }) {

        const octokit = new Octokit({
            auth: pat
        })

        let files = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', { owner, repo, path, ref })
        commit('setFiles', files.data)
        console.log(files)
    },

    async getFile({ commit }, { owner, repo, pat, path, ref }) {

        const octokit = new Octokit({
            auth: pat
        })

        let file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', { owner, repo, path, ref })
        console.log(file)
        return Buffer.from(file.data.content, 'base64').toString('utf8')
    }

}