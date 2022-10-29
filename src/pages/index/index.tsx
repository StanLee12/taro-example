import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Tree from '../../components/index'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'

const dataSource = [
	{
		label: '水果',
		value: '1',
		children: [
			{
				label: '苹果',
				value: '1.1',
			},
			{
				label: '梨子',
				value: '1.2',
				isLeaf: true,
			}
		]
	},
	{
		label: '蔬菜',
		value: '2',
		children: [
			{
				label: '白菜',
				value: '2.1'
			},
			{
				label: '萝卜',
				value: '2.2'
			}
		]
	},
	{
		label: '调料',
		value: '3',
		children: [
			{
				label: '酱油',
				value: '3.1'
			},
			{
				label: '醋',
				value: '3.2'
			}
		]
	},
	{
		label: '饮料',
		value: '4',
		children: [
			{
				label: '可乐',
				value: '4.1'
			},
			{
				label: '果汁',
				value: '4.2'
			}
		]
	}
]

export default class Index extends Component<PropsWithChildren> {
  state = {
    value: []
  }
  
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onChange = (value) => {
	console.log('选中的值', value)
	this.setState({ value })
  }

  render () {
    const { value } = this.state;
    return (
      <View className='index'>
        <Tree
			multiple
			value={value}
			dataSource={dataSource} 
			onChange={this.onChange} 
		/>
      </View>
    )
  }
}
