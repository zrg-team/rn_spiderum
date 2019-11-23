export const MODULE_NAME = 'profile'

export const ENPOINTS = {
  getProfile: (user) => `http://${user}.spiderum.com/api/v2/user/getCustomDomainPosts`,
  getProfileNoDomain: (user) => `https://spiderum.com/api/v2/user/getUserNumberDataInfo?profile_name=${user}`,
  getProfilePost: (user) => `https://spiderum.com/api/v2/user/getUserCreatedPosts?profile_name=${user}`
}

export const AVATAR_URL = 'https://s3-ap-southeast-1.amazonaws.com/img.spiderum.com/sp-xs-avatar/'
