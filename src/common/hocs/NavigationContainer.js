import { register } from 'react-native-bundle-splitter'

const Navigation = register({
  require: () => require('../routes')
})

export default Navigation
