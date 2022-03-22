
const getDefaultState = () => {
    return {
        isCollapse: false
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_COLLAPSE: (state, isCollapse) => {
        state.isCollapse = isCollapse;
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

