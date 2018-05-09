import { Input, Icon, Tag, Tooltip } from 'antd';
import React ,{ PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({url}) => ({
  url,
}))
export default class EditableTag extends PureComponent {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount(){
    this.matchKeyTags();
  }

  handleClose = () => {
    // const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags:[] });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { head,dispatch,item:{ key } } = this.props;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      // tags = [...tags, inputValue];
      tags = [inputValue];
    }
    // 修改数据:标签text
    dispatch({
      type:"url/patchTree",
      payload:{
        key:`${head}-${key}`,
        text:inputValue,
      },
    })
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  saveInputRef = (input) => {
    this.input = input
  }

  matchKeyTags = () =>{
    const { url:{ colsInfo },head,item:{ key }} = this.props;
    const [ first , second ] = key.split('-');
    for(const col of colsInfo){
      const dvaHead = col.head;
      const dvaFirst = col.first;
      const dvaSecond = col.second;
      const dvaText = col.text;
      if((head === dvaHead) && (first === dvaFirst) && (second === dvaSecond) && dvaText.length>0){
        this.setState({
          tags:[dvaText],
        })
      }
    }
  }

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const { item:{ key } } = this.props;
    const TreeNodeLevel = key.split('-').length; // 一级节点不显示标签
    const tagText = tags.length >0 ? "修改标签" : "添加标签";
    const iconType = tags.length > 0 ? "edit" : "plus";
    return (
      <div>
        {
          this.props.html ?
            <span dangerouslySetInnerHTML={this.props.html} style={{marginRight:10}} />
            :
            null
        }
        {
          TreeNodeLevel>1 ?
            (
              <span>
                {tags.map((tag) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag
                      key={tag}
                      closable
                      afterClose={() => this.handleClose()}
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                  <Input
                    ref={this.saveInputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={this.handleInputChange}
                    // onBlur={this.handleInputConfirm}
                    onPressEnter={this.handleInputConfirm}
                  />
                )}
                {!inputVisible && (
                  <Tag
                    onClick={this.showInput}
                    className={styles.tag}
                    // style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                    <Icon type={iconType} /> {tagText}
                  </Tag>
                )}
              </span>
            )
          :
          null
        }

      </div>
    );
  }
}
