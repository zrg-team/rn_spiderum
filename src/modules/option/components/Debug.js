import moment from 'moment'
import React, { Component } from 'react'
import * as FileSystem from 'react-native-fs'
import DeviceInfo from 'react-native-device-info'
import { Button, Text } from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/AntDesign'
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import configFile from '../../../configs'
import buildFile from '../../../configs/build'
import database from '../../../libraries/Database'
import CommonLoading from '../../../common/components/Widgets/CommonLoading'
import { wait } from '../../../common/utils/async'
import CollapsibleComponent from './CollapsibleComponent'

const COLORS = {
  INFO: '#5980C2',
  TIME: '#AD802D',
  DEBUG: '#933433'
}
const ICONS = {
  INFO: '💬',
  TIME: '🚀',
  DEBUG: '🚨',
  REQUEST: '📤'
}
export default class Debug extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: 0,
      storages: [],
      logs: [],
      offset: 0,
      info: '',
      config: '',
      state: '',
      loading: true
    }
    this.onSelect = this.onSelect.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.handleClearLog = this.handleClearLog.bind(this)
    this.handleReloadLog = this.handleReloadLog.bind(this)
    this.handleAddDivider = this.handleAddDivider.bind(this)
    this.handleLoadMoreLog = this.handleLoadMoreLog.bind(this)
    this.handleDownloadLog = this.handleDownloadLog.bind(this)
  }

  handleReloadLog () {
    this.getDataLogs(0)
  }

  async handleClearLog () {
    try {
      await database.model('logs').delete({})
      this.getDataLogs(0)
    } catch (err) {
    }
  }

  async handleAddDivider () {
    try {
      await database.model('logs').insert({
        timestamp: Date.now(),
        module: 'DIVIDER'
      })
      this.getDataLogs(0)
    } catch (err) {
    }
  }

  async componentDidMount () {
    try {
      const { state } = this.props
      await wait(400)
      CommonLoading.show(
        true,
        {
          title: 'Thank you, doctors, nurses, and other medical personnel who are on the front lines of this pandemic'
        }
      )
      this.getDataLogs()
      this.getInfo()
      const commit = buildFile.commit
      commit.authoredOn = moment.unix(commit.authoredOn).format('YYYY-MM-DD hh:mm:ss')
      commit.committedOn = moment.unix(commit.committedOn).format('YYYY-MM-DD hh:mm:ss')
      await wait(600)
      this.setState({
        loading: false,
        build: `
🛠️ Build: ${moment.unix(buildFile.buildDate / 1000).format('YYYY-MM-DD hh:mm:ss')}

🛠️ Build Folder: ${buildFile.projectFolder}
🛠️ Build Machine: ${buildFile.buildMachine}
🛠️ Build Node Version: ${buildFile.nodejs}
🛠️ Git Latest Tag: ${buildFile.gitLatestTag || ''}
🛠️ Git: ${buildFile.gitVersion || ''}
🛠️ Build Commit:

${JSON.stringify(commit, null, 2)}

🛠️ React Native Info:

${buildFile.reactNativeInfo}
🛠️ Build Gradle:
${buildFile.gradle}
  `,
        config: JSON.stringify(configFile, null, 2),
        state: JSON.stringify(state, null, 2)
      })
    } catch (err) {
      this.setState({
        loading: false
      })
    } finally {
      CommonLoading.hide()
    }
  }

  async getInfo () {
    try {
      const results = await Promise.all([
        DeviceInfo.getAvailableLocationProviders(),
        DeviceInfo.getBuildId(),
        DeviceInfo.getBrand(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBundleId(),
        DeviceInfo.getCarrier(),
        DeviceInfo.getDeviceType(),
        DeviceInfo.getDeviceName(),
        DeviceInfo.getMacAddress(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getModel(),
        DeviceInfo.getReadableVersion(),
        DeviceInfo.getSystemName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.getUsedMemory(),
        DeviceInfo.getUserAgent(),
        DeviceInfo.getVersion(),
        DeviceInfo.getIpAddress()
      ])
      const [
        providers,
        buildId,
        brand,
        buildNumber,
        bundleId,
        carrier,
        deviceType,
        deviceName,
        macAddress,
        manufacturer,
        model,
        readableVersion,
        systemName,
        systemVersion,
        totalMemory,
        usedMemory,
        userAgent,
        version,
        ipAddress
      ] = results
      const jsEngine = global && global._v8runtime && global._v8runtime()
        ? `V8 JIT - No INTL. Version: ${global._v8runtime().version}`
        : global && global.HermesInternal != null
          ? 'Hermes'
          : 'JSC'
      this.setState({
        info: JSON.stringify({
          Providers: providers,
          'Build Id': buildId,
          Brand: brand,
          'Build Number': buildNumber,
          'Bundle Id': bundleId,
          Carrier: carrier,
          'Device Type': deviceType,
          'Device Name': deviceName,
          'IP Address': ipAddress,
          'MAC Address': macAddress,
          Manufacturer: manufacturer,
          Model: model,
          'Readable Version': readableVersion,
          'System Name': systemName,
          'System Version': systemVersion,
          'Memory Usage': `${Math.round(usedMemory / 1024 / 1024)} MB / ${Math.round(totalMemory / 1024 / 1024)} MB`,
          'User Agent': userAgent,
          Version: version,
          'Javascript Engine': jsEngine
        }, null, 2)
      })
    } catch (err) {
    }
  }

  async getDataLogs (newOffset, options = {}) {
    try {
      const { offset, logs, query } = this.state
      const [{ rows }] = await database.model('logs').get({
        orders: [['timestamp', 'DESC']],
        limit: options.limit || 40,
        offset: newOffset !== undefined ? newOffset : offset
      })
      let result = newOffset !== 0 ? logs : []
      const length = rows.length
      for (let i = 0; i < length; i++) {
        result.push(rows.item(i))
      }
      const newQuery = query + 1
      result = result.filter(item => item.id !== 'LOAD_MORE')
      if (!options.ignoreSetState) {
        this.setState({
          query: newQuery,
          logs: [...result, { id: 'LOAD_MORE' }],
          offset: +(newOffset !== undefined ? newOffset : offset) + 40
        })
      }
      return result
    } catch (err) {
      return []
    }
  }

  async handleDownloadLog () {
    CommonLoading.show(
      true,
      {
        title: 'Thank you, doctors, nurses, and other medical personnel who are on the front lines of this pandemic'
      }
    )
    await wait(1000)
    const path = FileSystem.DocumentDirectoryPath + '/test.txt'
    let logData = await this.getDataLogs(0, { limit: 1000, ignoreSetState: true })
    logData = logData.map(item => {
      return `
[${moment.unix(item.timestamp / 1000).format('YYYY-MM-DD hh:mm:ss')}] ${ICONS[item.module]} ${item.module} ${ICONS[item.module]}
${item.data}
===================================================
`
    })
    // write the file
    FileSystem.writeFile(path, logData.join('\n'), 'utf8')
      .then((success) => {
        CommonLoading.hide()
      })
      .catch((err) => {
        console.debug('[WRITE LOG]', err)
        CommonLoading.hide()
      })
  }

  handleLoadMoreLog () {
    const { offset } = this.state
    this.getDataLogs(offset)
  }

  onSelect (item) {
    const { detail } = this.state
    this.setState({
      detail: `${detail}` === `${item.id}` ? undefined : item.id
    })
  }

  renderItem ({ item, index }) {
    const { detail } = this.state
    if (item.id === 'LOAD_MORE') {
      return (
        <Button
          appearance='ghost'
          onPress={this.handleLoadMoreLog}
          fullWidth
        >
          LOAD MORE
        </Button>
      )
    }
    if (item.module === 'DIVIDER') {
      return (
        <Text
          style={[
            styles.log_data,
            {
              paddingHorizontal: 5,
              paddingVertical: 5,
              textAlign: 'center',
              fontSize: 12
            }
          ]}
          numberOfLines={2}
          ellipsizeMode='clip'
        >
          🌁🌃🌄🌅🌆🌇🌉🌌🎑🎆🎇🏞️🏙️🌠🌁🌃🌄🌅🌆🌇🌉🌌🎑🎆🎇🏞️🏙️🌠
        </Text>
      )
    }
    const date = moment.unix(item.timestamp / 1000)
    return [
      <TouchableOpacity
        key='item'
        style={styles.log_item}
        onPress={() => this.onSelect(item)}
      >
        <Text
          style={styles.log_date}
        >
          {date.fromNow()}
        </Text>
        <Text
          style={{ color: COLORS[item.module] || '#FFFFFF', paddingRight: 5 }}
        >
          {ICONS[item.module] || ''} {item.module}
        </Text>
        <Text
          style={styles.log_data}
          ellipsizeMode='tail'
          numberOfLines={1}
        >
          {item.data}
        </Text>
      </TouchableOpacity>,
      `${detail}` === `${item.id}`
        ? (
          <View
            key='detail'
            style={{
              width: '100%',
              height: undefined
            }}
          >
            <Text
              h={5}
              style={styles.log_date_full}
            >
              {date.format('YYYY-MM-DD hh:mm:ss')}
            </Text>
            <SyntaxHighlighter
              language='javascript'
            >
              {item.data || ''}
            </SyntaxHighlighter>
          </View>
        ) : null
    ]
  }

  keyExtractor (data, index) {
    return data.id || index
  }

  render () {
    const { build, detail, logs, info, loading, query, config } = this.state
    if (loading) {
      return null
    }
    return (
      <View style={styles.container}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, color: 'green' }}>
            {
              `
ZRG-TEAM
🇻🇳 👨‍💻 🇻🇳
🅵🅾🆁 🅳🅴🆅🅴🅻🅾🅿🅴🆁
              `
            }
          </Text>
          <CollapsibleComponent title='DEVICE INFO'>
            <View style={[styles.detail]}>
              <SyntaxHighlighter
                language='javascript'
                highlighter='hljs'
              >
                {info || ''}
              </SyntaxHighlighter>
            </View>
          </CollapsibleComponent>
          <CollapsibleComponent title='BUILD INFORMATION'>
            <View style={[styles.detail]}>
              <SyntaxHighlighter
                language='javascript'
                highlighter='hljs'
              >
                {build || ''}
              </SyntaxHighlighter>
            </View>
          </CollapsibleComponent>
          <CollapsibleComponent title='CONFIG'>
            <View style={[styles.detail]}>
              <SyntaxHighlighter
                language='javascript'
                highlighter='hljs'
              >
                {config || ''}
              </SyntaxHighlighter>
            </View>
          </CollapsibleComponent>
          <Text
            style={{ textAlign: 'center', fontSize: 18, paddingVertical: 10, color: '#000' }}
          >
            APPLICATION LOGS
          </Text>
          <View style={{ width: '100%', flexDirection: 'row', display: 'flex' }}>
            <Button
              status='success'
              onPress={this.handleDownloadLog}
              containerStyle={{ borderRadius: 0 }}
              style={{ borderRadius: 0 }}
              icon={(style) => <Icon style={{ color: '#FFFFFF', fontSize: 18 }} name='download' />}
            />
            <Button
              containerStyle={{ borderRadius: 0 }}
              style={{ flex: 1, borderRadius: 0 }}
              onPress={this.handleReloadLog}
              icon={(style) => <Icon style={{ color: '#FFFFFF', fontSize: 18 }} name='reload1' />}
            >
              RELOAD
            </Button>
            <Button
              containerStyle={{ borderRadius: 0 }}
              style={{ flex: 1, borderRadius: 0 }}
              onPress={this.handleClearLog}
              icon={(style) => <Icon style={{ color: '#FFFFFF', fontSize: 18 }} name='close' />}
            >
              CLEAR
            </Button>
            <Button
              status='success'
              containerStyle={{ borderRadius: 0 }}
              style={{ borderRadius: 0 }}
              onPress={this.handleAddDivider}
              icon={(style) => <Icon style={{ color: '#FFFFFF', fontSize: 18 }} name='menuunfold' />}
            />
          </View>
          <FlatList
            data={logs}
            extraData={{ detail, query }}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            style={styles.log_list}
          />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
  },
  detail: {
    marginRight: 12
  },
  store_title: {
    width: '100%',
    paddingLeft: 10,
    paddingVertical: 10
  },
  log_item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12
  },
  log_date: { color: '#4D6B40', paddingRight: 5 },
  log_data: { flex: 1, paddingRight: 5, color: '#FFFFFF' },
  log_date_full: { width: '100%', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, color: '#107C10', backgroundColor: '#FFFFFF' },
  log_list: {
    width: '100%',
    height: undefined,
    backgroundColor: '#000000'
  },
  default_text: {
    color: '#107C10'
  }
})
