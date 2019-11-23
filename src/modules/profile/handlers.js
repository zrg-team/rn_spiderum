import { requestLoading } from '../../common/effects'
import { ENPOINTS } from './models'
import { setProfileNews } from './actions'

function getProfileNoDomain (user) {
  return Promise.all([
    requestLoading({
      url: `${ENPOINTS.getProfileNoDomain(user)}`
    }).then(response => {
      return response.data
    }),
    getProfilePosts(user, 1)
  ])
}

function getProfilePosts (user, page = 1) {
  return requestLoading({
    url: `${ENPOINTS.getProfilePost(user)}`,
    params: {
      page
    }
  }).then(response => {
    return response.data.createdPosts
  })
}

function getProfileCustomDomain (user, page) {
  return requestLoading({
    url: `${ENPOINTS.getProfile(user)}`,
    params: {
      page
    }
  })
}

export default (dispatch, props) => ({
  getProfile: async (user, page = 1) => {
    try {
      return getProfileCustomDomain(user, page)
        .then(response => {
          const results = {}
          results.profile = response.data.getCreatorInfo
          results.posts = response.data.getCreatedPost
          if (!results.profile) {
            return getProfileNoDomain(user, page)
              .then((response) => {
                dispatch(setProfileNews({ page, results: response[1] }))
                return { profile: response[0], posts: response[1], noDomain: true }
              })
          }
          dispatch(setProfileNews({ page, results: results.posts }))
          return results
        })
    } catch (err) {
      return null
    }
  },
  loadMore: (user, page, noDomain) => {
    try {
      if (!noDomain) {
        return getProfileCustomDomain(user, page)
          .then(response => {
            const results = {}
            results.posts = response.data.getCreatedPost
            dispatch(setProfileNews({ page, results: results.posts }))
            return results
          })
      } else {
        return getProfilePosts(user, page)
          .then((response) => {
            dispatch(setProfileNews({ page, results: response }))
            return { posts: response, noDomain: true }
          })
      }
    } catch (err) {
      return null
    }
  }
})
