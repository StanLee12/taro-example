import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtCheckbox, AtIcon } from 'taro-ui'
import cls from 'classnames'
import { ITreeItem } from './interface'
import Tree from './Tree'


const iconSize = 20
const iconColor = '#C7C7CC'
const checkIconSize = 18
const checkIconColor = '#1890FF'



interface ITreeItemState {
  visible: boolean;
  loading: boolean;
}

export default class TreeItem extends Component<ITreeItem, ITreeItemState> {

  static options = {
    styleIsolation: 'shared'
  }

  constructor(props) {
    super(props)
    const { treeDefaultExpandAll, data={} } = props
    const { children } = data
    const visible = treeDefaultExpandAll && Array.isArray(children) && children.length > 0
    this.state = {
      visible,
      loading: false,
    }
  }

  loaded = false

  handleToggleMore = async () => {
    const { visible } = this.state
    const { data, loadData } = this.props
    const { children } = data
    const hasChild = Array.isArray(children) && children.length > 0
    if (hasChild || this.loaded) {
      this.setState({
        visible: !visible,
      })
      return 
    } 
    if (typeof loadData === 'function') {
      this.setState({loading: true})
      await loadData(data)
      this.setState({
        visible: true,
        loading: false
      }, () => {
        this.loaded = true
      })
    } else {
      this.setState({
        visible: !visible,
      })
    }
  }

  handleRadioTreeChange = (value, disabled) => {
    if (disabled) return 
    const { onChange } = this.props
    onChange(value)
  }

  handleAddChildren = (children, selectedSet) => {
    children.forEach((child: any) => {
      selectedSet.add(child.value)
      if (Array.isArray(child.children) && child.children.length > 0) {
        this.handleAddChildren(child.children, selectedSet)
      }
    })
  }

  handleRemoveChildren = (children, selectedSet) => {
    children.forEach((child: any) => {
      selectedSet.delete(child.value)
      if (Array.isArray(child.children) && child.children.length > 0) {
        this.handleRemoveChildren(child.children, selectedSet)
      }
    })
  }

  handleMultipleChange = (selectedList) => {
    const { data, onChange } = this.props
    const { value, children } = data
    const hasChild = Array.isArray(children) && children.length > 0
    if (!hasChild) {
      onChange?.(selectedList)
      return
    }
    let selectedSet: any = new Set(selectedList);
    if (selectedSet.has(value) ) {
      this.handleAddChildren(children, selectedSet)
    } else {
      this.handleRemoveChildren(children, selectedSet)
    }
    onChange?.(Array.from(selectedSet))
  }

  render() {
    const { visible, loading } = this.state
    const { selectedValue, onChange, multiple, data, treeDefaultExpandAll, loadData } = this.props
    const { label, children, value, isLeaf, disabled } = data || {}
    const moreIcon = loading ? 'loading-3': visible ? 'chevron-down': 'chevron-up'
    const isRenderLeafIcon = isLeaf || (Array.isArray(children) && children.length > 0)
    const checked = selectedValue === value
    return (
      <View className="tree-item">
        <View className="tree-item-content">
          {/* ????????? */}
          {multiple&&(
            <AtCheckbox 
              options={[{
                label,
                value,
                disabled,
              }]}
              onChange={(value) => { this.handleMultipleChange(value) }}
              selectedList={selectedValue||[]}
            />)}
          {/* ????????? */}
          {!multiple&&(
            <View 
              onClick={() => this.handleRadioTreeChange(value, disabled)} 
              className="tree-item-radio"
            >
              <Text className={cls('label',{checked, disabled})}>
                {label}
              </Text>
              {checked&&(
                <AtIcon value='check' size={checkIconSize} color={checkIconColor}></AtIcon>
              )}
            </View>)}
          {/* ??????????????????????????????????????? */}
          {isRenderLeafIcon&&(
            <View className="tree-item-more" onClick={this.handleToggleMore}>
              <AtIcon value={moreIcon} size={iconSize} color={iconColor} />
            </View>)}
        </View>
        {/* ????????? */}
        <View className={cls({
          "none": !visible,
        })}>
          <Tree 
            value={selectedValue}
            multiple={multiple}
            onChange={onChange}
            loadData={loadData}
            dataSource={children} 
            treeDefaultExpandAll={treeDefaultExpandAll}
          />
        </View>
      </View>
    )
  }
}