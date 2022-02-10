import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        credentials:{
            bearerToken: '',
            loggedInUserId: '',
            loggedInUser: '',
            is_admin: 0,
            default_org:'root',
            org_home:0,
            selected_org_id:0,
            org_id:0,
            perms: {},
            layoutIdStack:[],
            currentLayoutId:0,
            directLoginLink:0,
            register: false,
            queryState:0,
            recentQuery:'',
            linkSelected:0,
            currentLayoutDescription:'',
            currentLayoutLabel:''

        }
    },
    getters:{
        getBearerToken(state){
            return state.credentials.bearerToken;
        },
        getLoggedInUserId(state){
            return state.credentials.loggedInUserId;
        },
        getLoggedInUser(state){
            return state.credentials.loggedInUser;
        },
        getIsAdmin(state){
            return state.credentials.is_admin;
        },
        getDefaultOrg(state){
            return state.credentials.default_org;
        },
        getOrgHomeId(state){
            return state.credentials.org_home;
        },
        getOrgId(state){
            return state.credentials.org_id
        },
        getSelectedOrgId(state){
            return state.credentials.selected_og_id
        },
        getPerms(state){
            return state.credentials.perms
        },
        getLayoutIdStack(state){
            return state.credentials.layoutIdStack
        },
        getCurrentLayoutId(state){
            return state.credentials.currentLayoutId
        },
        getCurrentLayoutDescription(state){
            return state.credentials.currentLayoutDescription
        },
        getCurrentLayoutLabel(state){
            return state.credentials.currentLayoutLabel
        },
        getDirectLoginLink(state){
            return state.credentials.directLoginLink
        },
        getQueryState(state){
            return state.credentials.queryState
        },
        getRecentQuery(state){
            return state.credentials.recentQuery
        },
        getLinkSelected(state){
            return state.credentials.linkSelected
        }
/*
        getRegister(state){
            return state.credentials.register
        }

 */
    },
    mutations:{
        setBearerToken(state, token){
            state.credentials.bearerToken = token;
        },
        setLoggedInUserId(state, loggedInUserId){
            state.credentials.loggedInUserId = loggedInUserId;
        },
        setLoggedInUser(state, loggedInUser){
            state.credentials.loggedInUser = loggedInUser;
        },
        setIsAdmin(state, isAdmin){
            state.credentials.is_admin = isAdmin;
        },
        setDefaultOrg(state, defaultOrg){
            state.credentials.default_org = defaultOrg;
        },
        setOrgHome(state, orgHome){
            state.credentials.org_home = orgHome;
        },
        setOrgId(state, orgId){
            state.credentials.org_id = orgId;
        },
        setSelectedOrgId(state, selectedOrgId){
            state.credentials.selected_og_id = selectedOrgId;
        },
        setPerms(state, currentPerms){
            state.credentials.perms=currentPerms;
        },
        setLayoutIdStack(state, layoutIdStack){
            state.credentials.layoutIdStack= layoutIdStack;
        },
        setCurrentLayoutId(state, currentLayoutId){
            state.credentials.currentLayoutId = currentLayoutId;
        },
        setCurrentLayoutDescription(state, currentLayoutDescription){
            state.credentials.currentLayoutDescription = currentLayoutDescription;
        },
        setCurrentLayoutLabel(state, currentLayoutLabel){
            state.credentials.currentLayoutLabel = currentLayoutLabel;
        },
        setDirectLoginLink(state, directLoginLink){
            state.credentials.directLoginLink = directLoginLink;
        },
        setQueryState(state, queryState){
            state.credentials.queryState = queryState;
        },
        setRecentQuery(state, recentQuery){
            state.credentials.recentQuery = recentQuery;
        },
        setLinkSelected(state, linkSelected){
            state.credentials.linkSelected = linkSelected;
        }
/*
        setRegister(state, registerState){
            state.credentials.register = registerState;
        }

 */

    }

})
